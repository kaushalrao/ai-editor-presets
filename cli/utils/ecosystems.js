const stateService = require('../services/state');
const logger = require('../ui/logger');
const prompts = require('../ui/prompts');

const isValidEcosystem = name => /^[a-zA-Z0-9_-]+$/.test(name);

function getInstalledEcosystems(config) {
    const installed = new Set();
    Object.entries(config).forEach(([editor, languages]) => {
        if (editor !== 'managedFiles') {
            languages.forEach(l => installed.add(l));
        }
    });
    return Array.from(installed);
}

function getConfigOrExit(targetDir) {
    const config = stateService.readConfig(targetDir);
    if (!config) {
        logger.error(`No config found. Please run 'npx ai-editor-presets init' first!`);
        process.exit(1);
    }
    return config;
}

function processEcosystemFlag(ecosystem) {
    if (!isValidEcosystem(ecosystem)) {
        logger.error(`Invalid ecosystem name '${ecosystem}'.`);
        process.exit(1);
    }
    return [ecosystem];
}

async function promptEcosystems(message, available) {
    if (!available || available.length === 0) return [];
    const selected = await prompts.multiSelectPrompt(message, available);
    return selected || [];
}

module.exports = { 
    isValidEcosystem, 
    getInstalledEcosystems, 
    getConfigOrExit, 
    processEcosystemFlag, 
    promptEcosystems 
};
