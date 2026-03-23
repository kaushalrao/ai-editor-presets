const fs = require('fs');
const path = require('path');

function discoverAdapters(repoRoot) {
    const adaptersDir = path.join(repoRoot, 'adapters');
    if (!fs.existsSync(adaptersDir)) return {};

    return fs.readdirSync(adaptersDir)
        .filter(f => !f.startsWith('.') && fs.lstatSync(path.join(adaptersDir, f)).isDirectory())
        .reduce((acc, dir) => {
            const compilerPath = path.join(adaptersDir, dir, 'compiler.js');
            if (fs.existsSync(compilerPath)) {
                acc[dir] = {
                    path: compilerPath,
                    load: () => require(compilerPath)
                };
            }
            return acc;
        }, {});
}

module.exports = { discoverAdapters };
