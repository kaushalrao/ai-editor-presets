const compilerService = require('../services/compiler');
const logger = require('../ui/logger');
const { discoverEcosystems } = require('../utils/discovery');
const { getConfigOrExit, processEcosystemFlag, getInstalledEcosystems, promptEcosystems } = require('../utils/ecosystems');

async function execute(repoRoot, targetDir, ecosystem) {
    const config = getConfigOrExit(targetDir);
    let ecosystemsToAdd = ecosystem ? processEcosystemFlag(ecosystem) : [];

    if (!ecosystem) {
        const available = discoverEcosystems(repoRoot);
        const installed = getInstalledEcosystems(config);
        const uninstalled = available.filter(e => !installed.includes(e));
        
        if (uninstalled.length === 0) {
            logger.warn("All available ecosystems are already installed!");
            return;
        }
        
        ecosystemsToAdd = await promptEcosystems("Select ecosystems to add:", uninstalled);
        if (!ecosystemsToAdd.length) return;
    }
    
    let modified = false;
    Object.entries(config).forEach(([editor, languages]) => {
        if (editor === 'managedFiles') return;
        ecosystemsToAdd.forEach(eco => {
            if (!languages.includes(eco)) {
                languages.push(eco);
                modified = true;
            }
        });
    });
    
    if (!modified) {
        logger.warn(`The selected ecosystems are already present.`);
        return;
    }

    logger.success(`Added ${ecosystemsToAdd.join(', ')} to config!`);
    await compilerService.syncAllConfigs(repoRoot, targetDir, config);
}

module.exports = { execute };
