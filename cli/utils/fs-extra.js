const fs = require('fs');
const path = require('path');

/**
 * Recursively copies rules from src to dest with optional filename prefixing.
 * Used by all IDE adapters for synchronized rule generation.
 */
function copyRules(src, dest, prefix = '', ledger = []) {
    if (!fs.existsSync(src)) return 0;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    let count = 0;
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            count += copyRules(srcFile, path.join(dest, file), prefix, ledger);
        } else {
            let destFileName = file;
            if (prefix && !file.toLowerCase().startsWith(prefix.toLowerCase())) {
                destFileName = `${prefix}-${file}`;
            }
            const destFile = path.join(dest, destFileName);
            fs.copyFileSync(srcFile, destFile);
            ledger.push(destFile);
            count++;
        }
    });
    return count;
}

/**
 * Collects markdown rule paths recursively for flattened compilation.
 */
function collectRules(src) {
    let filesList = [];
    if (!fs.existsSync(src)) return filesList;
    
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            filesList = filesList.concat(collectRules(srcFile));
        } else if (file.endsWith('.md') || file.endsWith('.mdc')) {
            filesList.push(srcFile);
        }
    });
    return filesList;
}

module.exports = { copyRules, collectRules };
