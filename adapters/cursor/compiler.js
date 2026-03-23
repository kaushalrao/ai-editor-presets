const fs = require('fs');
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
        const coreStats = copyRules(path.join(repoRoot, 'core'), path.join(cursorDir, 'rules'), '', writtenFiles);
        report.push({ name: 'Core Principles', stats: coreStats });

        // Ecosystems
        const ecosystemsPath = path.join(repoRoot, 'ecosystems');
        if (ctx.languages && ctx.languages.length > 0) {
            ctx.languages.forEach(lang => {
                // Find matching file or folder recursively
                const possiblePaths = [
                    path.join(ecosystemsPath, 'languages', lang),
                    path.join(ecosystemsPath, 'frameworks', lang),
                    path.join(ecosystemsPath, 'patterns', lang),
                    path.join(ecosystemsPath, 'languages', `${lang}.md`),
                    path.join(ecosystemsPath, 'frameworks', `${lang}.md`),
                    path.join(ecosystemsPath, 'patterns', `${lang}.md`)
                ];
                
                let foundPath = possiblePaths.find(p => fs.existsSync(p));
                if (foundPath) {
                    const stats = copyRules(foundPath, path.join(cursorDir, 'rules'), lang, writtenFiles);
                    report.push({ name: `${lang} Ecosystem`, stats });
                }
            });
        } else {
            const totalEcoStats = copyRules(ecosystemsPath, path.join(cursorDir, 'rules'), '', writtenFiles);
            report.push({ name: 'All Ecosystems', stats: totalEcoStats });
        }

        // Macros
        const macroStats = copyRules(path.join(repoRoot, 'library/prompts'), path.join(cursorDir, 'commands'), '', writtenFiles);
        report.push({ name: 'Prompt Macros', stats: macroStats });

        // Agents
        const agentStats = copyRules(path.join(repoRoot, 'library/agents'), path.join(cursorDir, 'agents'), '', writtenFiles);
        report.push({ name: 'Core Agents', stats: agentStats });

        // Shared Skills
        const skillStats = copyRules(path.join(repoRoot, 'library/skills'), path.join(cursorDir, 'skills'), '', writtenFiles);
        report.push({ name: 'Shared Skills', stats: skillStats });

        // Static Configs
        const staticStats = copyRules(path.join(repoRoot, 'adapters/cursor/static'), cursorDir, '', writtenFiles);
        report.push({ name: 'IDE Configs', stats: staticStats });

        return { files: writtenFiles, report };
    }
}
