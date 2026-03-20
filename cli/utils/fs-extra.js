const fs = require('fs');
const path = require('path');

/**
 * Recursively copies rules from src to dest with optional filename prefixing.
 * Used by all IDE adapters for synchronized rule generation.
 */
function copyRules(src, dest, prefix = '', ledger = []) {
    if (!fs.existsSync(src)) return { created: 0, updated: 0, skipped: 0 };
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    let stats = { created: 0, updated: 0, skipped: 0 };

    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            const res = copyRules(srcFile, path.join(dest, file), prefix, ledger);
            stats.created += res.created;
            stats.updated += res.updated;
            stats.skipped += res.skipped;
        } else {
            let destFileName = file;
            if (prefix && !file.toLowerCase().startsWith(prefix.toLowerCase())) {
                destFileName = `${prefix}-${file}`;
            }
            const destFile = path.join(dest, destFileName);
            ledger.push(destFile);

            if (fs.existsSync(destFile)) {
                const srcContent = fs.readFileSync(srcFile, 'utf8');
                const destContent = fs.readFileSync(destFile, 'utf8');
                if (srcContent === destContent) {
                    stats.skipped++;
                } else {
                    fs.writeFileSync(destFile, srcContent);
                    stats.updated++;
                }
            } else {
                fs.copyFileSync(srcFile, destFile);
                stats.created++;
            }
        }
    });
    return stats;
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
