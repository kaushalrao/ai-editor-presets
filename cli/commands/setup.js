const fs = require('fs');
const path = require('path');
const { outro } = require('@clack/prompts');
const pc = require('picocolors');
const prompts = require('../ui/prompts');
const compilerService = require('../services/compiler');
const stateService = require('../services/state');
const gitService = require('../services/git');
const { applyProfile, listProfiles } = require('../services/profile-resolver');
const { discoverEcosystems } = require('../utils/discovery');

function parseLanguages(flag, available) {
    if (flag === 'all') return available;
    if (flag === '') return [];
    if (typeof flag === 'string') return flag.split(',').map(s => s.trim()).filter(Boolean);
    return null;
}

async function execute(repoRoot, targetDir, editorFlag, languagesFlag, profileFlag) {
    const availableLanguages = discoverEcosystems(repoRoot);
    const adaptersDir = path.join(repoRoot, 'adapters');
    const availableEditors = fs.existsSync(adaptersDir)
        ? fs.readdirSync(adaptersDir).filter(f => !f.startsWith('.') && fs.lstatSync(path.join(adaptersDir, f)).isDirectory())
        : ['cursor'];

    const editor = editorFlag || await prompts.singleSelectPrompt("Which IDE adapter should we compile for?", availableEditors);

    let languages = parseLanguages(languagesFlag, availableLanguages);

    if (languages === null) {
        if (!profileFlag) {
            profileFlag = await prompts.profileSelectPrompt(listProfiles());
        }

        if (profileFlag) {
            languages = [];
            outro(pc.green('Configuration captured! Compiling rules...'));
        } else {
            languages = await prompts.multiSelectPrompt("Select Ecosystems:", availableLanguages);
        }
    }

    const config = stateService.readConfig(targetDir) || {};
    config[editor] = languages;
    if (profileFlag) config.profile = profileFlag;

    stateService.writeConfig(targetDir, config);
    gitService.updateGitignore(targetDir, config);
    await compilerService.syncAllConfigs(repoRoot, targetDir, applyProfile(config));
}

module.exports = { execute };
