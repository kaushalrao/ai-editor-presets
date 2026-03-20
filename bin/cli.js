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
        const generatedFiles = adapter.compile(repoRoot, targetDir, languages);
        console.log(`\n✅ AI Commons rules synced successfully for ${editor}!`);
        return generatedFiles || [];
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

function updateGitignore(projectDir) {
    const gitignorePath = path.join(projectDir, '.gitignore');
    const ignoreLines = [
        '.ai-commons.json',
        '.cursor/',
        '.agents/',
        '.github/copilot-instructions.md'
    ];
    
    try {
        let content = '';
        if (fs.existsSync(gitignorePath)) {
            content = fs.readFileSync(gitignorePath, 'utf8');
        } else {
            console.log(`   -> 🛡️  Created .gitignore to prevent accidental tracking of AI Configuration files.`);
        }
        
        let appendContent = '\n# AI Commons Config Tracker\n';
        let added = false;
        
        for (const line of ignoreLines) {
            if (!content.includes(line)) {
                appendContent += `${line}\n`;
                added = true;
            }
        }
        
        if (added) {
            fs.appendFileSync(gitignorePath, appendContent);
            console.log(`   -> 🛡️  Added AI configurations to .gitignore to prevent accidental commits.`);
        }
    } catch (e) {
        // Fail silently if there are permission issues
    }
}

function syncAllConfigs(config) {
    const oldManagedFiles = config.managedFiles || [];
    
    // Purge old mapped files structurally
    oldManagedFiles.forEach(f => {
        if (fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch (e) {}
        }
    });

    let newManagedFiles = [];
    for (const [editor, languages] of Object.entries(config)) {
        if (editor === 'managedFiles') continue;
        const result = runCompiler(editor, languages);
        if (Array.isArray(result)) newManagedFiles.push(...result);
    }

    config.managedFiles = newManagedFiles;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    updateGitignore(targetDir);
}

function saveConfigAndRun(editor, languages) {
    let currentConfig = {};
    if (fs.existsSync(configPath)) {
        try { Object.assign(currentConfig, JSON.parse(fs.readFileSync(configPath, 'utf8'))); } catch (e) { }
    }
    currentConfig[editor] = languages;
    syncAllConfigs(currentConfig);
}

async function execute() {
    const rawArgs = process.argv.slice(2);
    const command = rawArgs.find(a => !a.startsWith('--')) || 'init';
    const targetPayload = command !== 'init' ? rawArgs[rawArgs.indexOf(command) + 1] : null;

    let editor = editorArg ? editorArg.split('=')[1] : null;
    let languagesText = languageArg ? languageArg.split('=')[1] : null;

    if (command === 'add' || command === 'remove') {
        if (!targetPayload) {
            console.error(`❌ Error: Please specify an ecosystem to ${command} (e.g. npx ai-commons ${command} python)`);
            return process.exit(1);
        }
        if (!fs.existsSync(configPath)) {
            console.error("❌ Error: No .ai-commons.json tracker found. Please run 'npx ai-commons init' first!");
            return process.exit(1);
        }
        
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        let modified = false;

        for (const [savedEditor, savedLanguages] of Object.entries(config)) {
            if (command === 'add') {
                if (!savedLanguages.includes(targetPayload)) {
                    savedLanguages.push(targetPayload);
                    modified = true;
                }
            } else if (command === 'remove') {
                const idx = savedLanguages.indexOf(targetPayload);
                if (idx > -1) {
                    savedLanguages.splice(idx, 1);
                    modified = true;
                }
            }
        }
        
        if (modified) {
            console.log(`✅ Successfully ${command}ed '${targetPayload}' to your AI tracking config!`);
            syncAllConfigs(config);
        } else {
            console.log(`⚠️ '${targetPayload}' is already in the requested state.`);
        }
        return;
    }

    // Auto-update if config exists and no explicit flags are passed
    if (fs.existsSync(configPath) && !editor && languagesText === null) {
        console.log("📂 Found existing .ai-commons.json configuration! Updating silently...");
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            syncAllConfigs(config);
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
