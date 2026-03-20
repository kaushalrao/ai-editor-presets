const fs = require('fs');
const path = require('path');
const logger = require('../ui/logger');

function updateGitignore(projectDir) {
    const gitignorePath = path.join(projectDir, '.gitignore');
    const BLOCK_START = '# --- AI COMMONS INJECT START ---';
    const BLOCK_END = '# --- AI COMMONS INJECT END ---';
    const blockContent = `\n${BLOCK_START}\n.ai-commons.json\n.cursor/\n.agents/\n.github/copilot-instructions.md\n${BLOCK_END}\n`;
    
    try {
        let content = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

        // Safely enforce idempotency strictly via AI-specific wrapping block bounds naturally bypassing false comment collision limits
        if (!content.includes(BLOCK_START)) {
            if (content && !content.endsWith('\n')) content += '\n';
            fs.writeFileSync(gitignorePath, content + blockContent);
            logger.step(`🛡️  Added AI configurations to .gitignore to prevent accidental commits.`);
        }
    } catch (e) {
        // Fail silently if there are permission issues natively
    }
}

module.exports = { updateGitignore };
