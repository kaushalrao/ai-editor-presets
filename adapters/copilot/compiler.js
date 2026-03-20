const fs = require('fs');
const path = require('path');

function collectMarkdownFiles(src) {
    let filesList = [];
    if (!fs.existsSync(src)) return filesList;
    
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            filesList = filesList.concat(collectMarkdownFiles(srcFile));
        } else if (file.endsWith('.md') || file.endsWith('.mdc')) {
            filesList.push(srcFile);
        }
    });
    return filesList;
}

module.exports = {
    compile: function(repoRoot, targetDir, languages) {
        // GitHub Copilot relies on a strictly flattened .github/copilot-instructions.md
        const githubDir = path.join(targetDir, '.github');
        if (!fs.existsSync(githubDir)) fs.mkdirSync(githubDir, { recursive: true });
        
        const copilotFile = path.join(githubDir, 'copilot-instructions.md');
        let consolidatedContent = "# Copilot AI Commons Instructions\n\n";
        
        const appendFiles = (categoryName, files) => {
            if (files.length === 0) return;
            consolidatedContent += `\n## ${categoryName}\n\n`;
            files.forEach(filePath => {
                const fileName = path.basename(filePath);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                console.log(`     📄 Appending rule: ${fileName}`);
                consolidatedContent += `### Rule Section: ${fileName}\n\n${fileContent}\n\n---\n`;
            });
        };

        console.log("   -> Compiling Global Core Principles for Copilot...");
        appendFiles('Core Principles', collectMarkdownFiles(path.join(repoRoot, '1-core-principles')));
        
        if (languages && languages.length > 0) {
            languages.forEach(lang => {
                const cleanLang = lang.trim();
                console.log(`   -> Compiling Specific Ecosystem: [${cleanLang}]...`);
                const langPath = path.join(repoRoot, '2-ecosystems', cleanLang);
                if (fs.existsSync(langPath)) {
                    appendFiles(`Ecosystem: ${cleanLang}`, collectMarkdownFiles(langPath));
                } else {
                    console.warn(`   ⚠️  Warning: Ecosystem folder '${cleanLang}' not found in 2-ecosystems/!`);
                }
            });
        } else {
            console.log("   -> Compiling ALL Ecosystems...");
            const ecosystemsPath = path.join(repoRoot, '2-ecosystems');
            if (fs.existsSync(ecosystemsPath)) {
                fs.readdirSync(ecosystemsPath).forEach(langFolder => {
                    if (langFolder.startsWith('.')) return;
                    const langPath = path.join(ecosystemsPath, langFolder);
                    if (fs.lstatSync(langPath).isDirectory()) {
                        appendFiles(`Ecosystem: ${langFolder}`, collectMarkdownFiles(langPath));
                    }
                });
            }
        }
        
        console.log("   -> Injecting Prompt Macros...");
        appendFiles('Prompt Macros', collectMarkdownFiles(path.join(repoRoot, '3-prompt-macros')));
        
        console.log("   -> Exporting Core AI Personas...");
        appendFiles('Agent Personas', collectMarkdownFiles(path.join(repoRoot, '4-agents')));
        
        // Copilot doesn't strictly support raw skills extraction securely yet.
        
        fs.writeFileSync(copilotFile, consolidatedContent);
        console.log(`\n   ✅ Successfully generated ${copilotFile}`);
        
        return [copilotFile];
    }
}
