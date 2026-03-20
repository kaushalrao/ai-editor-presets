const fs = require('fs');
const path = require('path');
const logger = require('../ui/logger');

const CONFIG_FILE = '.ai-editor-presets.json';

function getConfigPath(targetDir) {
    return path.join(targetDir, CONFIG_FILE);
}

function readConfig(targetDir) {
    const configPath = getConfigPath(targetDir);
    if (!fs.existsSync(configPath)) {
        return null;
    }
    
    try {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(fileContent);
        
        // Ensure structural dictionary mapping exists natively
        if (typeof config !== 'object' || Array.isArray(config)) {
            throw new Error("Invalid format. Expected a dictionary object.");
        }
        return config;
    } catch (e) {
        logger.error(`Could not parse ${CONFIG_FILE}. It may be corrupted.`);
        return null;
    }
}

function writeConfig(targetDir, configObject) {
    const configPath = getConfigPath(targetDir);
    try {
        fs.writeFileSync(configPath, JSON.stringify(configObject, null, 2));
    } catch (e) {
        logger.error(`Failed to securely write to ${CONFIG_FILE}.`);
    }
}

module.exports = {
    readConfig,
    writeConfig,
    CONFIG_FILE
};
