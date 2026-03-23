#!/usr/bin/env node

const path = require('path');
const logger = require('./ui/logger');
const stateService = require('./services/state');
const pc = require('picocolors');

const repoRoot = path.join(__dirname, '..');
const targetDir = process.cwd();

async function execute() {
    try {
        const args = process.argv.slice(2);
        const command = args.find(a => !a.startsWith('--')) || 'init';
        const payload = command !== 'init' ? args[args.indexOf(command) + 1] : null;

        const getFlag = name => {
            const arg = args.find(a => a.startsWith(`--${name}=`));
            return arg ? arg.split('=')[1] : null;
        };

        const editorFlag = getFlag('editor');
        const languagesText = getFlag('language');

        if (command === 'add') {
            return await require('./commands/add').execute(repoRoot, targetDir, payload);
        }

        if (command === 'remove') {
            return await require('./commands/remove').execute(repoRoot, targetDir, payload);
        }

        if (command === 'init' && !editorFlag && languagesText === null) {
            const config = stateService.readConfig(targetDir);
            if (config) {
                console.log(pc.cyan(`◇  Found existing .ai-editor-presets.json configuration! Updating AI Editor Presets rules...`));
                if (await require('./commands/sync').execute(repoRoot, targetDir)) return;
            }
        }

        await require('./commands/setup').execute(repoRoot, targetDir, editorFlag, languagesText);
    } catch (err) {
        logger.error(`Critical Execution Failure: ${err.message}`);
        process.exit(1);
    }
}

execute();
