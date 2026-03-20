const fs = require('fs');
const path = require('path');
const logger = require('../ui/logger');

function updateGitignore(projectDir) {
    const gitignorePath = path.join(projectDir, '.gitignore');
    const ignoreLines = [
        '.ai-commons.json',
        '.cursor/',
        '.agents/',
        '.github/copilot-instructions.md'
    ];
    
    try {
        let content = '';
        if (fs.existsSync(gitignorePath)) {
            content = fs.readFileSync(gitignorePath, 'utf8');
        } else {
            logger.step(`🛡️  Created .gitignore to prevent accidental tracking of AI Configuration files.`);
        }
        
        let appendContent = '\n# AI Commons Config Tracker\n';
        let added = false;
        
        for (const line of ignoreLines) {
            if (!content.includes(line)) {
                appendContent += `${line}\n`;
                added = true;
            }
        }
        
        if (added) {
            fs.appendFileSync(gitignorePath, appendContent);
            logger.step(`🛡️  Added AI configurations to .gitignore to prevent accidental commits.`);
        }
    } catch (e) {
        // Fail silently if there are permission issues
    }
}

module.exports = { updateGitignore };
