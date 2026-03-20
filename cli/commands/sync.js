const stateService = require('../services/state');
const compilerService = require('../services/compiler');
const logger = require('../ui/logger');

function execute(repoRoot, targetDir) {
    const config = stateService.readConfig(targetDir);
    if (!config) {
        logger.warn("Could not read existing config. Defaulting to setup wizard.");
        return false; // return false to signal that the caller should fall back to setup route
    }
    
    logger.info("Found existing .ai-commons.json configuration! Updating silently...");
    compilerService.syncAllConfigs(repoRoot, targetDir, config);
    return true;
}

module.exports = { execute };
