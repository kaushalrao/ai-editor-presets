const fs = require('fs');
const path = require('path');

/**
 * Dynamically discovers all valid IDE adapters inside the adapters/ directory.
 */
function discoverAdapters(repoRoot) {
    const adaptersDir = path.join(repoRoot, 'adapters');
    const registry = {};

    if (!fs.existsSync(adaptersDir)) return registry;

    const directories = fs.readdirSync(adaptersDir).filter(f => {
        const fullPath = path.join(adaptersDir, f);
        return !f.startsWith('.') && fs.lstatSync(fullPath).isDirectory();
    });

    directories.forEach(dir => {
        const compilerPath = path.join(adaptersDir, dir, 'compiler.js');
        if (fs.existsSync(compilerPath)) {
            // Lazy load the adapter into the dictionary
            registry[dir] = {
                path: compilerPath,
                load: () => require(compilerPath)
            };
        }
    });

    return registry;
}

module.exports = { discoverAdapters };
