const fs = require('fs');
const path = require('path');
const logger = require('../ui/logger');
const stateService = require('./state');
const gitService = require('./git');

function runAdapter(repoRoot, targetDir, editor, languages) {
    const adapterPath = path.join(repoRoot, 'adapters', editor, 'compiler.js');
    if (!fs.existsSync(adapterPath)) {
        logger.error(`Adapter not found for editor: ${editor}`);
        process.exit(1);
    }

    const adapter = require(adapterPath);
    logger.header(`Syncing rules for [${editor.toUpperCase()}] into -> ${targetDir}`);

    try {
        const generatedFiles = adapter.compile(repoRoot, targetDir, languages);
        logger.success(`AI Commons rules synced successfully for ${editor}!`);
        return generatedFiles || [];
    } catch (e) {
        logger.error(`Error during sync: ${e.stack || e.message}`);
        process.exit(1);
    }
}

function syncAllConfigs(repoRoot, targetDir, currentConfig) {
    const oldManagedFiles = currentConfig.managedFiles || [];
    
    // Purge old mapped files structurally
    oldManagedFiles.forEach(f => {
        if (fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch (e) {}
        }
    });

    let newManagedFiles = [];
    for (const [editor, languages] of Object.entries(currentConfig)) {
        if (editor === 'managedFiles') continue;
        const result = runAdapter(repoRoot, targetDir, editor, languages);
        if (Array.isArray(result)) newManagedFiles.push(...result);
    }

    currentConfig.managedFiles = newManagedFiles;
    stateService.writeConfig(targetDir, currentConfig);
    gitService.updateGitignore(targetDir);
}

module.exports = { runAdapter, syncAllConfigs };
