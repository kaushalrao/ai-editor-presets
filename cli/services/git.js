const fs = require('fs');
const path = require('path');
const logger = require('../ui/logger');

function updateGitignore(projectDir, config = {}) {
    const gitignorePath = path.join(projectDir, '.gitignore');
    const BLOCK_START = '# --- AI COMMONS INJECT START ---';
    const BLOCK_END = '# --- AI COMMONS INJECT END ---';
    
    // Dynamic mapping of Editor -> Gitignore Entry
    const EDITOR_MAP = {
        'cursor': '.cursor/',
        'antigravity': '.agents/',
        'copilot': '.github/copilot-instructions.md'
    };

    let lines = ['.ai-commons.json'];
    Object.keys(config).forEach(editor => {
        if (EDITOR_MAP[editor]) lines.push(EDITOR_MAP[editor]);
    });

    const blockContent = `${BLOCK_START}\n${[...new Set(lines)].join('\n')}\n${BLOCK_END}`;
    
    try {
        let content = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

        // If block exists, replace it for surgical updates natively
        if (content.includes(BLOCK_START) && content.includes(BLOCK_END)) {
            const re = new RegExp(`${BLOCK_START}[\\s\\S]*?${BLOCK_END}`, 'g');
            content = content.replace(re, blockContent);
        } else {
            // Otherwise append it fresh
            if (content && !content.endsWith('\n')) content += '\n';
            content += `\n${blockContent}\n`;
        }
        
        fs.writeFileSync(gitignorePath, content);
    } catch (e) {
        // Fail silently if there are permission issues natively
    }
}

module.exports = { updateGitignore };
