#!/usr/bin/env node

const path = require('path');
const logger = require('./ui/logger');
const stateService = require('./services/state');
const pc = require('picocolors');

const repoRoot = path.join(__dirname, '..');
const targetDir = process.cwd();

async function execute() {
    try {
        const rawArgs = process.argv.slice(2);
        const command = rawArgs.find(a => !a.startsWith('--')) || 'init';
        const targetPayload = command !== 'init' ? rawArgs[rawArgs.indexOf(command) + 1] : null;

        const editorArg = rawArgs.find(a => a.startsWith('--editor='));
        const languageArg = rawArgs.find(a => a.startsWith('--language='));
        
        let editorFlag = editorArg ? editorArg.split('=')[1] : null;
        let languagesText = languageArg ? languageArg.split('=')[1] : null;

        // Lazy load the appropriate command on-demand to minimize startup latency natively
        if (command === 'add') {
            const cmdAdd = require('./commands/add');
            return await cmdAdd.execute(repoRoot, targetDir, targetPayload);
        } 

        if (command === 'remove') {
            const cmdRemove = require('./commands/remove');
            return await cmdRemove.execute(repoRoot, targetDir, targetPayload);
        }

        // Attempt a silent continuous integration sync natively if zero explicitly overriding flags are triggered
        if (command === 'init' && !editorFlag && languagesText === null) {
            const config = stateService.readConfig(targetDir);
            if (config) {
                console.log(pc.cyan(`◇  Found existing .ai-editor-presets.json configuration! Updating AI Editor Presets rules...`));
                const cmdSync = require('./commands/sync');
                const synced = await cmdSync.execute(repoRoot, targetDir);
                if (synced) return;
            }
        }

        // Default to initializing the robust UI setup wizard natively or explicitly overriding parameters silently
        const cmdSetup = require('./commands/setup');
        await cmdSetup.execute(repoRoot, targetDir, editorFlag, languagesText);
    } catch (err) {
        logger.error(`Critical Execution Failure: ${err.message}`);
        process.exit(1);
    }
}

execute();
