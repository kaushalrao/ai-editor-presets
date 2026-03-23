const fs = require('fs');
const path = require('path');
const prompts = require('../ui/prompts');
const compilerService = require('../services/compiler');
const stateService = require('../services/state');
const gitService = require('../services/git');

function discoverEcosystems(repoRoot) {
    const ecoDir = path.join(repoRoot, 'ecosystems');
    if (!fs.existsSync(ecoDir)) return [];

    return ['languages', 'frameworks', 'patterns'].reduce((acc, cat) => {
        const catPath = path.join(ecoDir, cat);
        if (!fs.existsSync(catPath)) return acc;

        const files = fs.readdirSync(catPath)
            .filter(f => !f.startsWith('.') && (fs.lstatSync(path.join(catPath, f)).isDirectory() || f.endsWith('.md')))
            .map(f => path.basename(f, path.extname(f)));
        return [...acc, ...files];
    }, []);
}

function parseLanguages(flag, available) {
    if (flag === 'all') return available;
    if (flag === '') return [];
    if (typeof flag === 'string') return flag.split(',').map(s => s.trim()).filter(Boolean);
    return null;
}

async function execute(repoRoot, targetDir, editorFlag, languagesFlag) {
    const availableLanguages = discoverEcosystems(repoRoot);
    const adaptersDir = path.join(repoRoot, 'adapters');
    const availableEditors = fs.existsSync(adaptersDir) 
        ? fs.readdirSync(adaptersDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(adaptersDir, f)).isDirectory()) 
        : ['cursor'];

    let editor = editorFlag || await prompts.singleSelectPrompt("Which IDE adapter should we compile for?", availableEditors);
    let languages = parseLanguages(languagesFlag, availableLanguages) || await prompts.multiSelectPrompt("Select Ecosystems:", availableLanguages);

    const config = stateService.readConfig(targetDir) || {};
    config[editor] = languages;

    stateService.writeConfig(targetDir, config);
    gitService.updateGitignore(targetDir, config);
    await compilerService.syncAllConfigs(repoRoot, targetDir, config);
}

module.exports = { execute };
