const fs = require('fs');
const path = require('path');
const logger = require('../ui/logger');

const CONFIG_FILE = '.ai-editor-presets.json';

const getConfigPath = targetDir => path.join(targetDir, CONFIG_FILE);

function readConfig(targetDir) {
    const configPath = getConfigPath(targetDir);
    if (!fs.existsSync(configPath)) return null;
    
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (typeof config !== 'object' || Array.isArray(config)) {
            throw new Error("Invalid format");
        }
        return config;
    } catch (e) {
        logger.error(`Could not parse ${CONFIG_FILE}.`);
        return null;
    }
}

function writeConfig(targetDir, configObject) {
    try {
        fs.writeFileSync(getConfigPath(targetDir), JSON.stringify(configObject, null, 2));
    } catch (e) {
        logger.error(`Failed to write to ${CONFIG_FILE}.`);
    }
}

module.exports = { readConfig, writeConfig, CONFIG_FILE };
