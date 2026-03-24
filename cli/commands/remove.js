const compilerService = require('../services/compiler');
const logger = require('../ui/logger');
const { getConfigOrExit, processEcosystemFlag, getInstalledEcosystems, promptEcosystems } = require('../utils/ecosystems');

async function execute(repoRoot, targetDir, ecosystem) {
    const config = getConfigOrExit(targetDir);
    let ecosystemsToRemove = ecosystem ? processEcosystemFlag(ecosystem) : [];

    if (!ecosystem) {
        const installed = getInstalledEcosystems(config);
        if (installed.length === 0) {
            logger.warn("No ecosystems are currently installed.");
            return;
        }
        ecosystemsToRemove = await promptEcosystems("Select ecosystems to remove:", installed);
        if (!ecosystemsToRemove.length) return;
    }
    
    let modified = false;
    Object.entries(config).forEach(([editor, languages]) => {
        if (editor === 'managedFiles') return;
        const initialLength = languages.length;
        config[editor] = languages.filter(lang => !ecosystemsToRemove.includes(lang));
        if (config[editor].length !== initialLength) modified = true;
    });
    
    if (!modified) {
        logger.warn(`The selected ecosystems were not found in config.`);
        return;
    }

    logger.success(`Removed ${ecosystemsToRemove.join(', ')} from config!`);
    await compilerService.syncAllConfigs(repoRoot, targetDir, config);
}

module.exports = { execute };
