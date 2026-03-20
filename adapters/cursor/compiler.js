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
        const cursorDir = path.join(targetDir, '.cursor');
        
        console.log("   -> Compiling Global Core Principles...");
        copyDirRecursive(path.join(repoRoot, '1-core-principles'), path.join(cursorDir, 'rules'));
        
        if (languages && languages.length > 0) {
            languages.forEach(lang => {
                const cleanLang = lang.trim();
                console.log(`   -> Compiling Specific Ecosystem: [${cleanLang}]...`);
                const langPath = path.join(repoRoot, '2-ecosystems', cleanLang);
                
                if (fs.existsSync(langPath)) {
                    copyDirRecursive(langPath, path.join(cursorDir, 'rules'));
                } else {
                    console.warn(`   ⚠️  Warning: Ecosystem folder '${cleanLang}' not found in 2-ecosystems/!`);
                }
            });
        } else {
            console.log("   -> Compiling ALL Ecosystems (No specific language selected)...");
            // Copies all nested framework/language rules directly in
            copyDirRecursive(path.join(repoRoot, '2-ecosystems'), path.join(cursorDir, 'rules'));
        }
        
        console.log("   -> Injecting Prompt Macros (Slash commands)...");
        copyDirRecursive(path.join(repoRoot, '3-prompt-macros'), path.join(cursorDir, 'commands'));
        
        console.log("   -> Injecting Core Agents...");
        copyDirRecursive(path.join(repoRoot, '4-agents'), path.join(cursorDir, 'agents'));
        
        console.log("   -> Exporting Static Configurations (MCP/Skills)...");
        copyDirRecursive(path.join(repoRoot, 'adapters/cursor/static'), cursorDir);
    }
}
