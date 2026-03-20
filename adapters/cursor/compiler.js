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
        const coreCount = copyRules(path.join(repoRoot, '1-core-principles'), path.join(cursorDir, 'rules'), '', writtenFiles);
        report.push({ name: 'Core Principles', count: coreCount });

        // Ecosystems
        if (ctx.languages && ctx.languages.length > 0) {
            ctx.languages.forEach(lang => {
                const langPath = path.join(repoRoot, '2-ecosystems', lang);
                const count = copyRules(langPath, path.join(cursorDir, 'rules'), lang, writtenFiles);
                if (count > 0) report.push({ name: `${lang} Ecosystem`, count });
            });
        } else {
            const ecosystemsPath = path.join(repoRoot, '2-ecosystems');
            let totalEcoCount = copyRules(ecosystemsPath, path.join(cursorDir, 'rules'), '', writtenFiles);
            report.push({ name: 'All Ecosystems', count: totalEcoCount });
        }

        // Macros
        const macroCount = copyRules(path.join(repoRoot, '3-prompt-macros'), path.join(cursorDir, 'commands'), '', writtenFiles);
        report.push({ name: 'Prompt Macros', count: macroCount });

        // Agents
        const agentCount = copyRules(path.join(repoRoot, '4-agents'), path.join(cursorDir, 'agents'), '', writtenFiles);
        report.push({ name: 'Core Agents', count: agentCount });

        // Static
        const staticCount = copyRules(path.join(repoRoot, 'adapters/cursor/static'), cursorDir, '', writtenFiles);
        report.push({ name: 'IDE Configs', count: staticCount });

        return { files: writtenFiles, report };
    }
}
