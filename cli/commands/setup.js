const fs = require('fs');
const path = require('path');
const prompts = require('../ui/prompts');
const compilerService = require('../services/compiler');
const stateService = require('../services/state');
const gitService = require('../services/git');

async function execute(repoRoot, targetDir, editorFlag, languagesFlag) {
    const ecosystemsDir = path.join(repoRoot, 'ecosystems');
    let availableLanguages = [];
    if (fs.existsSync(ecosystemsDir)) {
        const categories = ['languages', 'frameworks', 'patterns'];
        categories.forEach(cat => {
            const catPath = path.join(ecosystemsDir, cat);
            if (fs.existsSync(catPath)) {
                const files = fs.readdirSync(catPath)
                    .filter(f => !f.startsWith('.') && (fs.lstatSync(path.join(catPath, f)).isDirectory() || f.endsWith('.md')))
                    .map(f => path.basename(f, path.extname(f)));
                availableLanguages = [...availableLanguages, ...files];
            }
        });
    }

    const adaptersDir = path.join(repoRoot, 'adapters');
    const availableEditors = fs.existsSync(adaptersDir) ? fs.readdirSync(adaptersDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(adaptersDir, f)).isDirectory()) : ['cursor'];

    let editor = editorFlag;
    
    let languages = null;
    if (languagesFlag === 'all') {
        languages = availableLanguages;
    } else if (languagesFlag === '') {
        languages = [];
    } else if (typeof languagesFlag === 'string') {
        languages = languagesFlag.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (!editor) {
        editor = await prompts.singleSelectPrompt("Which AI Standards IDE adapter should we compile for?", availableEditors);
    }

    if (languages === null) {
        languages = await prompts.multiSelectPrompt("Select the exact Ecosystems to install:", availableLanguages);
    }

    // Map targets to tracking memory
    let currentConfig = stateService.readConfig(targetDir) || {};
    currentConfig[editor] = languages;

    // Persist explicitly and sync
    stateService.writeConfig(targetDir, currentConfig);
    gitService.updateGitignore(targetDir, currentConfig);
    await compilerService.syncAllConfigs(repoRoot, targetDir, currentConfig);
}

module.exports = { execute };
