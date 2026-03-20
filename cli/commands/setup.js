const fs = require('fs');
const path = require('path');
const prompts = require('../ui/prompts');
const compilerService = require('../services/compiler');
const stateService = require('../services/state');
const gitService = require('../services/git');

async function execute(repoRoot, targetDir, editorFlag, languagesFlag) {
    const ecosystemsDir = path.join(repoRoot, '2-ecosystems');
    const availableLanguages = fs.existsSync(ecosystemsDir) ? fs.readdirSync(ecosystemsDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(ecosystemsDir, f)).isDirectory()) : [];

    const adaptersDir = path.join(repoRoot, 'adapters');
    const availableEditors = fs.existsSync(adaptersDir) ? fs.readdirSync(adaptersDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(adaptersDir, f)).isDirectory()) : ['cursor'];

    let editor = editorFlag;
    let languages = languagesFlag ? languagesFlag.split(',').map(s => s.trim()).filter(Boolean) : null;

    if (!editor) {
        editor = await prompts.singleSelectPrompt("Which IDE adapter should we compile for?", availableEditors);
    }

    if (languages === null) {
        languages = await prompts.multiSelectPrompt("Select the exact Ecosystems to install:", availableLanguages);
    }

    // Map targets to tracking memory
    let currentConfig = stateService.readConfig(targetDir) || {};
    currentConfig[editor] = languages;

    // Persist explicitly and sync
    stateService.writeConfig(targetDir, currentConfig);
    gitService.updateGitignore(targetDir);
    compilerService.syncAllConfigs(repoRoot, targetDir, currentConfig);
}

module.exports = { execute };
