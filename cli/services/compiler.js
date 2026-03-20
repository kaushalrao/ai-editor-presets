const fs = require('fs');
const path = require('path');
const { spinner } = require('@clack/prompts');
const pc = require('picocolors');
const logger = require('../ui/logger');
const stateService = require('./state');
const gitService = require('./git');
const { discoverAdapters } = require('../core/registry');

async function runAdapter(repoRoot, targetDir, adapterName, adapterModule, languages) {
    const s = spinner();
    s.start(pc.cyan(`Syncing [${adapterName.toUpperCase()}] rules...`));

    const ctx = {
        paths: { repoRoot, targetDir },
        languages: languages || [],
        logger: logger
    };

    try {
        const adapter = adapterModule.load();
        const { files, report } = await Promise.resolve(adapter.compile(ctx));
        
        s.stop(pc.green(`Successfully synchronized ${adapterName.toUpperCase()}!`));

        if (report && report.length > 0) {
            report.forEach((section, i) => {
                const prefix = i === report.length - 1 ? '└─' : '├─';
                const fileLabel = section.count === 1 ? 'file' : 'files';
                console.log(pc.dim(`  ${prefix} `) + pc.white(`${section.name}: `) + pc.cyan(`${section.count} ${fileLabel}`));
            });
            console.log('');
        }
        return files || [];
    } catch (e) {
        s.stop(pc.red(`Sync failed for ${adapterName}`));
        logger.error(`${adapterName} Error: ${e.message}`);
        return []; // Partial failure: don't kill other adapters
    }
}

async function syncAllConfigs(repoRoot, targetDir, currentConfig) {
    const oldManagedFiles = currentConfig.managedFiles || [];
    const registry = discoverAdapters(repoRoot);
    
    // Purge old files
    oldManagedFiles.forEach(f => {
        if (fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch (e) {}
        }
    });

    const syncTasks = [];
    for (const [editor, languages] of Object.entries(currentConfig)) {
        if (editor === 'managedFiles' || !registry[editor]) continue;
        syncTasks.push(runAdapter(repoRoot, targetDir, editor, registry[editor], languages));
    }

    const results = await Promise.all(syncTasks);
    const newManagedFiles = results.flat();

    currentConfig.managedFiles = newManagedFiles;
    stateService.writeConfig(targetDir, currentConfig);
    gitService.updateGitignore(targetDir);
}

module.exports = { syncAllConfigs };
