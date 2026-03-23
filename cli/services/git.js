const fs = require('fs');
const path = require('path');

const BLOCK_START = '# --- AI STANDARDS INJECT START ---';
const BLOCK_END = '# --- AI STANDARDS INJECT END ---';

const EDITOR_MAP = {
    'cursor': '.cursor/',
    'antigravity': '.agents/',
    'copilot': '.github/copilot-instructions.md'
};

function updateGitignore(projectDir, config = {}) {
    const gitignorePath = path.join(projectDir, '.gitignore');
    
    const lines = ['.ai-editor-presets.json', ...Object.keys(config).map(e => EDITOR_MAP[e]).filter(Boolean)];
    const blockContent = `${BLOCK_START}\n${[...new Set(lines)].join('\n')}\n${BLOCK_END}`;
    
    try {
        let content = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

        if (content.includes(BLOCK_START) && content.includes(BLOCK_END)) {
            const re = new RegExp(`${BLOCK_START}[\\s\\S]*?${BLOCK_END}`, 'g');
            content = content.replace(re, blockContent);
        } else {
            content += (content && !content.endsWith('\n') ? '\n' : '') + `\n${blockContent}\n`;
        }
        
        fs.writeFileSync(gitignorePath, content);
    } catch (e) {
        // Silent fail on permission issues
    }
}

module.exports = { updateGitignore };
