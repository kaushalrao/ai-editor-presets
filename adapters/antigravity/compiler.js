const fs = require('fs');
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
        const coreStats = copyRules(path.join(repoRoot, 'core'), path.join(agentDir, 'rules'), '', writtenFiles, '.mdc');
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
                    const stats = copyRules(foundPath, path.join(agentDir, 'rules'), lang, writtenFiles, '.mdc');
                    if (stats.created + stats.updated + stats.skipped > 0) {
                        report.push({ name: `${lang} Ecosystem`, stats });
                    }
                }
            });
        } else {
            const totalEcoStats = copyRules(ecosystemsPath, path.join(agentDir, 'rules'), '', writtenFiles, '.mdc');
            report.push({ name: 'All Ecosystems', stats: totalEcoStats });
        }

        // Workflows
        const workflowStats = copyRules(path.join(repoRoot, 'library/prompts'), path.join(agentDir, 'workflows'), '', writtenFiles);
        report.push({ name: 'Workflows', stats: workflowStats });

        // Personas
        const personaStats = copyRules(path.join(repoRoot, 'library/agents'), path.join(agentDir, 'personas'), '', writtenFiles, '.mdc');
        report.push({ name: 'AI Personas', stats: personaStats });

        // Shared Skills
        const skillStats = copyRules(path.join(repoRoot, 'library/skills'), path.join(agentDir, 'skills'), '', writtenFiles);
        report.push({ name: 'Shared Skills', stats: skillStats });

        // Static Configs
        const staticStats = copyRules(path.join(repoRoot, 'adapters/antigravity/static'), agentDir, '', writtenFiles);
        report.push({ name: 'Static Configs', stats: staticStats });

        return { files: writtenFiles, report };
    }
}
