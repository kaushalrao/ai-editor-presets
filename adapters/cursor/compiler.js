const path = require('path');
const { copyRules } = require('../../cli/utils/fs-extra');

module.exports = {
    name: 'cursor',
    compile: function(ctx) {
        const { repoRoot, targetDir } = ctx.paths;
        const cursorDir = path.join(targetDir, '.cursor');
        
        let writtenFiles = [];
        let report = [];

        // Global Core
        const coreStats = copyRules(path.join(repoRoot, '1-core-principles'), path.join(cursorDir, 'rules'), '', writtenFiles);
        report.push({ name: 'Core Principles', stats: coreStats });

        // Ecosystems
        if (ctx.languages && ctx.languages.length > 0) {
            ctx.languages.forEach(lang => {
                const langPath = path.join(repoRoot, '2-ecosystems', lang);
                const stats = copyRules(langPath, path.join(cursorDir, 'rules'), lang, writtenFiles);
                if (stats.created + stats.updated + stats.skipped > 0) {
                    report.push({ name: `${lang} Ecosystem`, stats });
                }
            });
        } else {
            const ecosystemsPath = path.join(repoRoot, '2-ecosystems');
            const totalEcoStats = copyRules(ecosystemsPath, path.join(cursorDir, 'rules'), '', writtenFiles);
            report.push({ name: 'All Ecosystems', stats: totalEcoStats });
        }

        // Macros
        const macroStats = copyRules(path.join(repoRoot, '3-prompt-macros'), path.join(cursorDir, 'commands'), '', writtenFiles);
        report.push({ name: 'Prompt Macros', stats: macroStats });

        // Agents
        const agentStats = copyRules(path.join(repoRoot, '4-agents'), path.join(cursorDir, 'agents'), '', writtenFiles);
        report.push({ name: 'Core Agents', stats: agentStats });

        // Static
        const staticStats = copyRules(path.join(repoRoot, 'adapters/cursor/static'), cursorDir, '', writtenFiles);
        report.push({ name: 'IDE Configs', stats: staticStats });

        return { files: writtenFiles, report };
    }
}
