const fs = require('fs');
const path = require('path');
const { collectRules } = require('../../cli/utils/fs-extra');

module.exports = {
    name: 'copilot',
    compile: function(ctx) {
        const { repoRoot, targetDir } = ctx.paths;
        const githubDir = path.join(targetDir, '.github');
        if (!fs.existsSync(githubDir)) fs.mkdirSync(githubDir, { recursive: true });
        
        const copilotFile = path.join(githubDir, 'copilot-instructions.md');
        let consolidatedContent = "# Copilot AI Commons Instructions\n\n";
        let report = [];
        
        const appendFiles = (categoryName, files) => {
            if (files.length === 0) return 0;
            consolidatedContent += `\n## ${categoryName}\n\n`;
            files.forEach(filePath => {
                const fileName = path.basename(filePath);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                consolidatedContent += `### Rule Section: ${fileName}\n\n${fileContent}\n\n---\n`;
            });
            return files.length;
        };

        // Core
        const coreCount = appendFiles('Core Principles', collectRules(path.join(repoRoot, '1-core-principles')));
        report.push({ name: 'Core Principles', stats: { created: 0, updated: 0, skipped: coreCount } });

        // Ecosystems
        if (ctx.languages && ctx.languages.length > 0) {
            ctx.languages.forEach(lang => {
                const langPath = path.join(repoRoot, '2-ecosystems', lang);
                const count = appendFiles(`Ecosystem: ${lang}`, collectRules(langPath));
                if (count > 0) report.push({ name: `${lang} Ecosystem`, stats: { created: 0, updated: 0, skipped: count } });
            });
        } else {
            const ecosystemsPath = path.join(repoRoot, '2-ecosystems');
            const count = appendFiles('All Ecosystems', collectRules(ecosystemsPath));
            report.push({ name: 'All Ecosystems', stats: { created: 0, updated: 0, skipped: count } });
        }

        // Macros
        const macroCount = appendFiles('Prompt Macros', collectRules(path.join(repoRoot, '3-prompt-macros')));
        report.push({ name: 'Prompt Macros', stats: { created: 0, updated: 0, skipped: macroCount } });

        // Agents
        const agentCount = appendFiles('Agent Personas', collectRules(path.join(repoRoot, '4-agents')));
        report.push({ name: 'Agent Personas', stats: { created: 0, updated: 0, skipped: agentCount } });
        
        let writeStat = { created: 0, updated: 0, skipped: 0 };
        if (fs.existsSync(copilotFile)) {
            const existingContent = fs.readFileSync(copilotFile, 'utf8');
            if (existingContent === consolidatedContent) {
                writeStat.skipped = 1;
            } else {
                fs.writeFileSync(copilotFile, consolidatedContent);
                writeStat.updated = 1;
            }
        } else {
            fs.writeFileSync(copilotFile, consolidatedContent);
            writeStat.created = 1;
        }

        report.push({ name: 'Consolidated Loader', stats: writeStat });
        
        return { files: [copilotFile], report };
    }
}
