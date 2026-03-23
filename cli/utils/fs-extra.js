const fs = require('fs');
const path = require('path');

function processFile(src, destDir, prefix, targetExt, ledger, stats) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    const fileName = path.basename(src);
    let destFileName = fileName;

    if (prefix && !fileName.toLowerCase().startsWith(prefix.toLowerCase())) {
        destFileName = `${prefix}-${fileName}`;
    }

    if (targetExt) {
        destFileName = path.basename(destFileName, path.extname(destFileName)) + targetExt;
    }

    const destFile = path.join(destDir, destFileName);
    ledger.push(destFile);

    const srcContent = fs.readFileSync(src, 'utf8');
    
    if (fs.existsSync(destFile)) {
        if (srcContent === fs.readFileSync(destFile, 'utf8')) {
            stats.skipped++;
            return;
        }
        fs.writeFileSync(destFile, srcContent);
        stats.updated++;
        return;
    }

    fs.writeFileSync(destFile, srcContent);
    stats.created++;
}

/**
 * Recursively copies rules from src to dest with optional filename prefixing.
 */
function copyRules(src, dest, prefix = '', ledger = [], targetExt = null) {
    if (!fs.existsSync(src)) return { created: 0, updated: 0, skipped: 0 };
    
    const stats = { created: 0, updated: 0, skipped: 0 };
    const srcStat = fs.lstatSync(src);

    if (srcStat.isFile()) {
        processFile(src, dest, prefix, targetExt, ledger, stats);
        return stats;
    }

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            const res = copyRules(srcFile, path.join(dest, file), prefix, ledger, targetExt);
            stats.created += res.created;
            stats.updated += res.updated;
            stats.skipped += res.skipped;
            return;
        }
        processFile(srcFile, dest, prefix, targetExt, ledger, stats);
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
        const srcPath = path.join(src, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            filesList = filesList.concat(collectRules(srcPath));
            return;
        }
        if (file.endsWith('.md') || file.endsWith('.mdc')) {
            filesList.push(srcPath);
        }
    });

    return filesList;
}

module.exports = { copyRules, collectRules };
