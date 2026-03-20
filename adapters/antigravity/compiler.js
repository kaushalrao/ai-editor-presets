const path = require('path');
const { copyRules } = require('../../cli/utils/fs-extra');

module.exports = {
    name: 'antigravity',
    compile: function(ctx) {
        const { repoRoot, targetDir } = ctx.paths;
        const agentDir = path.join(targetDir, '.agents');
        
        let writtenFiles = [];
        let report = [];

        // Global Core
        const coreStats = copyRules(path.join(repoRoot, '1-core-principles'), path.join(agentDir, 'rules'), '', writtenFiles);
        report.push({ name: 'Core Principles', stats: coreStats });

        // Ecosystems
        if (ctx.languages && ctx.languages.length > 0) {
            ctx.languages.forEach(lang => {
                const langPath = path.join(repoRoot, '2-ecosystems', lang);
                const stats = copyRules(langPath, path.join(agentDir, 'rules'), lang, writtenFiles);
                if (stats.created + stats.updated + stats.skipped > 0) {
                    report.push({ name: `${lang} Ecosystem`, stats });
                }
            });
        } else {
            const ecosystemsPath = path.join(repoRoot, '2-ecosystems');
            const totalEcoStats = copyRules(ecosystemsPath, path.join(agentDir, 'rules'), '', writtenFiles);
            report.push({ name: 'All Ecosystems', stats: totalEcoStats });
        }

        // Workflows
        const workflowStats = copyRules(path.join(repoRoot, '3-prompt-macros'), path.join(agentDir, 'workflows'), '', writtenFiles);
        report.push({ name: 'Workflows', stats: workflowStats });

        // Personas
        const personaStats = copyRules(path.join(repoRoot, '4-agents'), path.join(agentDir, 'personas'), '', writtenFiles);
        report.push({ name: 'AI Personas', stats: personaStats });

        // Static
        const staticStats = copyRules(path.join(repoRoot, 'adapters/antigravity/static'), agentDir, '', writtenFiles);
        report.push({ name: 'Static Configs', stats: staticStats });

        return { files: writtenFiles, report };
    }
}
