const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            copyDirRecursive(srcFile, destFile);
        } else {
            console.log(`     📄 Copied rule: ${file}`);
            fs.copyFileSync(srcFile, destFile);
        }
    });
}

module.exports = {
    compile: function(repoRoot, targetDir, languages) {
        // Antigravity leverages a global .agents folder
        const agentDir = path.join(targetDir, '.agents');
        
        console.log("   -> Compiling Global Core Principles for Antigravity...");
        copyDirRecursive(path.join(repoRoot, '1-core-principles'), path.join(agentDir, 'rules'));
        
        if (languages && languages.length > 0) {
            languages.forEach(lang => {
                const cleanLang = lang.trim();
                console.log(`   -> Compiling Specific Ecosystem: [${cleanLang}]...`);
                const langPath = path.join(repoRoot, '2-ecosystems', cleanLang);
                if (fs.existsSync(langPath)) {
                    copyDirRecursive(langPath, path.join(agentDir, 'rules'));
                } else {
                    console.warn(`   ⚠️  Warning: Ecosystem folder '${cleanLang}' not found in 2-ecosystems/!`);
                }
            });
        } else {
            console.log("   -> Compiling ALL Ecosystems...");
            copyDirRecursive(path.join(repoRoot, '2-ecosystems'), path.join(agentDir, 'rules'));
        }
        
        console.log("   -> Injecting Prompt Macros as Antigravity Workflows...");
        copyDirRecursive(path.join(repoRoot, '3-prompt-macros'), path.join(agentDir, 'workflows'));
        
        console.log("   -> Exporting Static Configurations & Skills...");
        copyDirRecursive(path.join(repoRoot, 'adapters/antigravity/static'), agentDir);
    }
}
