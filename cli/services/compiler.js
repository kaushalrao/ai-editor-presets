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
        
        s.stop(pc.green(`Successfully processed ${adapterName.toUpperCase()}!`));

        if (report && report.length > 0) {
            report.forEach((section, i) => {
                const prefix = i === report.length - 1 ? '└─' : '├─';
                let labelParts = [];
                if (section.stats.created > 0) labelParts.push(pc.green(`+${section.stats.created} new`));
                if (section.stats.updated > 0) labelParts.push(pc.yellow(`~${section.stats.updated} updated`));
                if (section.stats.skipped > 0) labelParts.push(pc.dim(`• ${section.stats.skipped} pinned`));
                
                const statsLine = labelParts.length > 0 ? labelParts.join(pc.dim(' | ')) : pc.dim('no changes');
                console.log(pc.dim(`  ${prefix} `) + pc.white(`${section.name}: `) + statsLine);
            });
            console.log('');
        }
        return files || [];
    } catch (e) {
        s.stop(pc.red(`Sync failed for ${adapterName}`));
        logger.error(`${adapterName} Error: ${e.message}`);
        return [];
    }
}

async function syncAllConfigs(repoRoot, targetDir, currentConfig) {
    const oldManagedFiles = currentConfig.managedFiles || [];
    const registry = discoverAdapters(repoRoot);
    
    const syncTasks = [];
    for (const [editor, languages] of Object.entries(currentConfig)) {
        if (editor === 'managedFiles' || !registry[editor]) continue;
        syncTasks.push(runAdapter(repoRoot, targetDir, editor, registry[editor], languages));
    }

    const results = await Promise.all(syncTasks);
    const newManagedFiles = results.flat();

    // Surgical Orphan Cleanup: Only delete files that were tracked but didn't reappear in this sync
    const managedSet = new Set(newManagedFiles);
    oldManagedFiles.forEach(f => {
        if (!managedSet.has(f) && fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch (e) {}
        }
    });

    currentConfig.managedFiles = newManagedFiles;
    stateService.writeConfig(targetDir, currentConfig);
    gitService.updateGitignore(targetDir, currentConfig);
}

module.exports = { syncAllConfigs };
