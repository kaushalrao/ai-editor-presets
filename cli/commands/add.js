const stateService = require('../services/state');
const compilerService = require('../services/compiler');
const logger = require('../ui/logger');

async function execute(repoRoot, targetDir, ecosystem) {
    if (!ecosystem) {
        logger.error("Please specify an ecosystem to add (e.g. npx ai-commons add python)");
        process.exit(1);
    }
    
    // Security verification protecting strictly against Directory Traversal exploitation natively
    if (!/^[a-zA-Z0-9_-]+$/.test(ecosystem)) {
        logger.error(`Security Block: Invalid ecosystem name '${ecosystem}'. Path traversal vectors are formally rejected.`);
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
        if (!savedLanguages.includes(ecosystem)) {
            savedLanguages.push(ecosystem);
            modified = true;
        }
    }
    
    if (modified) {
        logger.success(`Successfully added '${ecosystem}' to your AI tracking config!`);
        await compilerService.syncAllConfigs(repoRoot, targetDir, config);
    } else {
        logger.warn(`'${ecosystem}' is already in the requested state.`);
    }
}

module.exports = { execute };
