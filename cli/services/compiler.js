const fs = require('fs');
const { spinner } = require('@clack/prompts');
const pc = require('picocolors');
const logger = require('../ui/logger');
const stateService = require('./state');
const gitService = require('./git');
const { discoverAdapters } = require('../core/registry');

function formatReport(report) {
    if (!report || report.length === 0) return;

    report.forEach((section, i) => {
        const prefix = i === report.length - 1 ? '└─' : '├─';
        const parts = [
            section.stats.created > 0 && pc.green(`+${section.stats.created} new`),
            section.stats.updated > 0 && pc.yellow(`~${section.stats.updated} updated`),
            section.stats.skipped > 0 && pc.dim(`• ${section.stats.skipped} pinned`)
        ].filter(Boolean);
        
        const statsLine = parts.length > 0 ? parts.join(pc.dim(' | ')) : pc.dim('no changes');
        console.log(pc.dim(`  ${prefix} `) + pc.white(`${section.name}: `) + statsLine);
    });
    console.log('');
}

async function runAdapter(repoRoot, targetDir, adapterName, adapterModule, languages) {
    const s = spinner();
    s.start(pc.cyan(`Syncing [${adapterName.toUpperCase()}] rules...`));

    try {
        const adapter = adapterModule.load();
        const { files, report } = await Promise.resolve(adapter.compile({
            paths: { repoRoot, targetDir },
            languages: languages || [],
            logger
        }));
        
        s.stop(pc.green(`Successfully processed ${adapterName.toUpperCase()}!`));
        formatReport(report);
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
    
    const tasks = Object.entries(currentConfig)
        .filter(([editor]) => editor !== 'managedFiles' && registry[editor])
        .map(([editor, languages]) => runAdapter(repoRoot, targetDir, editor, registry[editor], languages));

    const results = await Promise.all(tasks);
    const newManagedFiles = results.flat();

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
