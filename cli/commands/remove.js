const stateService = require('../services/state');
const compilerService = require('../services/compiler');
const logger = require('../ui/logger');

const isValidEcosystem = name => /^[a-zA-Z0-9_-]+$/.test(name);

async function execute(repoRoot, targetDir, ecosystem) {
    if (!ecosystem) {
        logger.error("Please specify an ecosystem to remove (e.g. npx ai-editor-presets remove python)");
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
        if (editor === 'managedFiles') return;
        const initialLength = languages.length;
        config[editor] = languages.filter(lang => lang !== ecosystem);
        if (config[editor].length !== initialLength) modified = true;
    });
    
    if (!modified) {
        logger.warn(`'${ecosystem}' was not found in config.`);
        return;
    }

    logger.success(`Removed '${ecosystem}' from config!`);
    await compilerService.syncAllConfigs(repoRoot, targetDir, config);
}

module.exports = { execute };
