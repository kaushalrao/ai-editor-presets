const stateService = require('../services/state');
const compilerService = require('../services/compiler');
const logger = require('../ui/logger');

const isValidEcosystem = name => /^[a-zA-Z0-9_-]+$/.test(name);

async function execute(repoRoot, targetDir, ecosystem) {
    if (!ecosystem) {
        logger.error("Please specify an ecosystem to add (e.g. npx ai-editor-presets add python)");
        process.exit(1);
    }
    
    if (!isValidEcosystem(ecosystem)) {
        logger.error(`Invalid ecosystem name '${ecosystem}'.`);
        process.exit(1);
    }
    
    const config = stateService.readConfig(targetDir);
    if (!config) {
        logger.error(`No config found. Please run 'npx ai-editor-presets init' first!`);
        process.exit(1);
    }
    
    let modified = false;
    Object.entries(config).forEach(([editor, languages]) => {
        if (editor !== 'managedFiles' && !languages.includes(ecosystem)) {
            languages.push(ecosystem);
            modified = true;
        }
    });
    
    if (!modified) {
        logger.warn(`'${ecosystem}' is already present.`);
        return;
    }

    logger.success(`Added '${ecosystem}' to config!`);
    await compilerService.syncAllConfigs(repoRoot, targetDir, config);
}

module.exports = { execute };
