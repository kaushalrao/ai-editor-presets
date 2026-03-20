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
        const coreCount = copyRules(path.join(repoRoot, '1-core-principles'), path.join(agentDir, 'rules'), '', writtenFiles);
        report.push({ name: 'Core Principles', count: coreCount });

        // Ecosystems
        if (ctx.languages && ctx.languages.length > 0) {
            ctx.languages.forEach(lang => {
                const langPath = path.join(repoRoot, '2-ecosystems', lang);
                const count = copyRules(langPath, path.join(agentDir, 'rules'), lang, writtenFiles);
                if (count > 0) report.push({ name: `${lang} Ecosystem`, count });
            });
        } else {
            const ecosystemsPath = path.join(repoRoot, '2-ecosystems');
            let totalEcoCount = copyRules(ecosystemsPath, path.join(agentDir, 'rules'), '', writtenFiles);
            report.push({ name: 'All Ecosystems', count: totalEcoCount });
        }

        // Workflows
        const workflowCount = copyRules(path.join(repoRoot, '3-prompt-macros'), path.join(agentDir, 'workflows'), '', writtenFiles);
        report.push({ name: 'Workflows', count: workflowCount });

        // Personas
        const personaCount = copyRules(path.join(repoRoot, '4-agents'), path.join(agentDir, 'personas'), '', writtenFiles);
        report.push({ name: 'AI Personas', count: personaCount });

        // Static
        const staticCount = copyRules(path.join(repoRoot, 'adapters/antigravity/static'), agentDir, '', writtenFiles);
        report.push({ name: 'Static Configs', count: staticCount });

        return { files: writtenFiles, report };
    }
}
