#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const editorArg = args.find(a => a.startsWith('--editor='));
const languageArg = args.find(a => a.startsWith('--language='));

const repoRoot = path.join(__dirname, '..');
const targetDir = process.cwd();

// Dynamically fetch available configurations
const ecosystemsDir = path.join(repoRoot, '2-ecosystems');
const availableLanguages = fs.existsSync(ecosystemsDir) ? fs.readdirSync(ecosystemsDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(ecosystemsDir, f)).isDirectory()) : [];

const adaptersDir = path.join(repoRoot, 'adapters');
const availableEditors = fs.existsSync(adaptersDir) ? fs.readdirSync(adaptersDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(adaptersDir, f)).isDirectory()) : ['cursor'];

function runCompiler(editor, languages) {
    const adapterPath = path.join(repoRoot, 'adapters', editor, 'compiler.js');
    if (!fs.existsSync(adapterPath)) {
        console.error(`\n❌ Adapter not found for editor: ${editor}`);
        process.exit(1);
    }

    const adapter = require(adapterPath);
    console.log(`\n⚙️  Syncing rules for [${editor.toUpperCase()}] into -> ${targetDir}\n`);

    try {
        adapter.compile(repoRoot, targetDir, languages);
        console.log(`\n✅ AI Commons rules synced successfully for ${editor}!`);
    } catch (e) {
        console.error(`\n❌ Error during sync:`, e.stack || e.message);
        process.exit(1);
    }
}

async function singleSelectPrompt(message, options) {
    return new Promise(resolve => {
        let cursor = 0;
        const render = () => {
            console.clear();
            console.log(`🚀 Welcome to the AI Commons Setup CLI!\n`);
            console.log(message);
            console.log("(Use arrow keys to navigate, Enter to confirm)\n");

            options.forEach((opt, i) => {
                const isHovered = i === cursor;
                const prefix = isHovered ? '> (o)' : '  ( )';
                const color = isHovered ? '\x1b[36m' : '\x1b[0m';
                console.log(`${color}${prefix} ${opt}\x1b[0m`);
            });
        };

        const onData = (data) => {
            const str = data.toString();
            if (str === '\u001b[A') cursor = cursor > 0 ? cursor - 1 : options.length - 1;
            else if (str === '\u001b[B') cursor = cursor < options.length - 1 ? cursor + 1 : 0;
            else if (str === '\r' || str === '\n') {
                process.stdin.removeListener('data', onData);
                process.stdin.setRawMode(false);
                process.stdin.pause();
                resolve(options[cursor]);
                return;
            } else if (str === '\u0003') process.exit(0);
            render();
        };

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onData);
        render();
    });
}

async function multiSelectPrompt(message, options) {
    return new Promise(resolve => {
        let cursor = 0;
        const selected = new Set();

        const render = () => {
            console.clear();
            console.log(`🚀 Welcome to the AI Commons Setup CLI!\n`);
            console.log(message);
            console.log("(Use arrow keys to navigate, Space to toggle, Enter to confirm)\n");

            options.forEach((opt, i) => {
                const isSelected = selected.has(i);
                const isHovered = i === cursor;
                const checkbox = isSelected ? '[x]' : '[ ]';
                const prefix = isHovered ? '> ' : '  ';
                const color = isHovered ? '\x1b[36m' : '\x1b[0m';
                console.log(`${color}${prefix}${checkbox} ${opt}\x1b[0m`);
            });
            console.log('\n  💡 Tip: If you leave all boxes unchecked, ALL ecosystems will be installed by default.');
        };

        const onData = (data) => {
            const str = data.toString();
            if (str === '\u001b[A') cursor = cursor > 0 ? cursor - 1 : options.length - 1;
            else if (str === '\u001b[B') cursor = cursor < options.length - 1 ? cursor + 1 : 0;
            else if (str === ' ') {
                if (selected.has(cursor)) selected.delete(cursor);
                else selected.add(cursor);
            } else if (str === '\r' || str === '\n') {
                process.stdin.removeListener('data', onData);
                process.stdin.setRawMode(false);
                process.stdin.pause();
                console.clear();
                resolve(Array.from(selected).map(i => options[i]));
                return;
            } else if (str === '\u0003') process.exit(0);
            render();
        };

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onData);
        render();
    });
}

const configPath = path.join(targetDir, '.ai-commons.json');

function saveConfigAndRun(editor, languages) {
    let currentConfig = {};
    if (fs.existsSync(configPath)) {
        try { Object.assign(currentConfig, JSON.parse(fs.readFileSync(configPath, 'utf8'))); } catch (e) { }
    }

    currentConfig[editor] = languages;
    fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));

    runCompiler(editor, languages);
}

async function execute() {
    let editor = editorArg ? editorArg.split('=')[1] : null;
    let languagesText = languageArg ? languageArg.split('=')[1] : null;

    // Auto-update if config exists and no explicit flags are passed
    if (fs.existsSync(configPath) && !editor && languagesText === null) {
        console.log("📂 Found existing .ai-commons.json configuration! Updating silently...");
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (config.editor) {
                // Handle legacy format gracefully
                runCompiler(config.editor, config.languages);
            } else {
                // Handle the new dictionary mapping to seamlessly auto-update all installed IDE rules at once!
                for (const [savedEditor, savedLanguages] of Object.entries(config)) {
                    runCompiler(savedEditor, savedLanguages);
                }
            }
            return;
        } catch (e) {
            console.log("⚠️  Could not read existing config. Defaulting to setup wizard.");
        }
    }

    if (editor && languagesText !== null) {
        const languages = languagesText ? languagesText.split(',').map(s => s.trim()).filter(Boolean) : [];
        saveConfigAndRun(editor, languages);
        return;
    }

    if (!editor) {
        editor = await singleSelectPrompt("Which IDE adapter should we compile for?", availableEditors);
    }

    let languages = [];
    if (languagesText === null) {
        languages = await multiSelectPrompt("Select the exact Ecosystems to install:", availableLanguages);
    } else {
        languages = languagesText ? languagesText.split(',').map(s => s.trim()).filter(Boolean) : [];
    }

    console.clear();
    saveConfigAndRun(editor, languages);
}

execute();
