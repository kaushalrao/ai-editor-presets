const stateService = require('../services/state');
const compilerService = require('../services/compiler');
const logger = require('../ui/logger');

function execute(repoRoot, targetDir, ecosystem) {
    if (!ecosystem) {
        logger.error("Please specify an ecosystem to remove (e.g. npx ai-commons remove python)");
        process.exit(1);
    }
    
    const config = stateService.readConfig(targetDir);
    if (!config) {
        logger.error(`No ${stateService.CONFIG_FILE} tracker found. Please run 'npx ai-commons init' first!`);
        process.exit(1);
    }
    
    let modified = false;
    for (const [savedEditor, savedLanguages] of Object.entries(config)) {
        if (savedEditor === 'managedFiles') continue;
        const idx = savedLanguages.indexOf(ecosystem);
        if (idx > -1) {
            savedLanguages.splice(idx, 1);
            modified = true;
        }
    }
    
    if (modified) {
        logger.success(`Successfully removed '${ecosystem}' from your AI tracking config!`);
        compilerService.syncAllConfigs(repoRoot, targetDir, config);
    } else {
        logger.warn(`'${ecosystem}' is already in the requested state.`);
    }
}

module.exports = { execute };
