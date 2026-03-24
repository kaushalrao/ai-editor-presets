const fs = require('fs');
const path = require('path');

function discoverEcosystems(repoRoot) {
    const ecoDir = path.join(repoRoot, 'ecosystems');
    if (!fs.existsSync(ecoDir)) return [];

    return ['languages', 'frameworks', 'patterns'].reduce((acc, cat) => {
        const catPath = path.join(ecoDir, cat);
        if (!fs.existsSync(catPath)) return acc;

        const files = fs.readdirSync(catPath)
            .filter(f => !f.startsWith('.') && (fs.lstatSync(path.join(catPath, f)).isDirectory() || f.endsWith('.md')))
            .map(f => path.basename(f, path.extname(f)));
        return [...acc, ...files];
    }, []);
}

module.exports = { discoverEcosystems };
