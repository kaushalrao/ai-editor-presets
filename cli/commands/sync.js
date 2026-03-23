const stateService = require('../services/state');
const compilerService = require('../services/compiler');
const logger = require('../ui/logger');

async function execute(repoRoot, targetDir) {
    const config = stateService.readConfig(targetDir);
    if (!config) {
        logger.warn("No existing config found. Falling back to setup.");
        return false;
    }
    
    await compilerService.syncAllConfigs(repoRoot, targetDir, config);
    return true;
}

module.exports = { execute };
