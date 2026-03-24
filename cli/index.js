#!/usr/bin/env node

const path = require('path');
const logger = require('./ui/logger');
const stateService = require('./services/state');
const pc = require('picocolors');

const REPO_ROOT = path.join(__dirname, '..');
const TARGET_DIR = process.cwd();

const HELP_TEXT = `
${pc.bold(pc.cyan('AI Editor Presets - CLI'))}

${pc.bold('Usage:')} npx ai-editor-presets [command] [options]

${pc.bold('Commands:')}
  ${pc.green('init')}      (default) Initialize or Sync your presets based on current config.
  ${pc.green('add')}       Add a new framework or language to your configuration.
  ${pc.green('remove')}    Remove an existing framework or language from your configuration.
  ${pc.green('help')}      Show this help menu.

${pc.bold('Options (Headless Mode):')}
  --editor=<name>     Bypass prompt. Specify editor (e.g., cursor, copilot, antigravity).
  --language=<names>  Bypass prompt. Comma-separated ecosystems (e.g., react,python).

${pc.bold('Examples:')}
  npx ai-editor-presets                      ${pc.dim('# Interactive setup or silent sync')}
  npx ai-editor-presets add                  ${pc.dim('# Interactively add an ecosystem')}
  npx ai-editor-presets add python           ${pc.dim('# Immediately add Python')}
  npx ai-editor-presets remove react         ${pc.dim('# Immediately remove React')}
  npx ai-editor-presets --editor=cursor --language=react
`;

function parseArgs(args) {
    const command = args.find(a => !a.startsWith('--')) || 'init';
    const payloadIndex = args.indexOf(command) + 1;
    const payload = (command !== 'init' && payloadIndex < args.length) ? args[payloadIndex] : null;

    const getFlag = name => {
        const arg = args.find(a => a.startsWith(`--${name}=`));
        return arg ? arg.split('=')[1] : null;
    };

    return {
        command,
        payload,
        editorFlag: getFlag('editor'),
        languagesText: getFlag('language'),
        isHelp: args.includes('--help') || args.includes('-h') || command === 'help'
    };
}

async function execute() {
    try {
        const { command, payload, editorFlag, languagesText, isHelp } = parseArgs(process.argv.slice(2));

        if (isHelp) {
            console.log(HELP_TEXT);
            return process.exit(0);
        }

        if (command === 'add') {
            return await require('./commands/add').execute(REPO_ROOT, TARGET_DIR, payload);
        }

        if (command === 'remove') {
            return await require('./commands/remove').execute(REPO_ROOT, TARGET_DIR, payload);
        }

        if (command === 'init' && !editorFlag && languagesText === null) {
            const config = stateService.readConfig(TARGET_DIR);
            if (config) {
                console.log(pc.cyan(`◇  Found existing .ai-editor-presets.json configuration! Updating AI Editor Presets rules...`));
                if (await require('./commands/sync').execute(REPO_ROOT, TARGET_DIR)) return;
            }
        }

        await require('./commands/setup').execute(REPO_ROOT, TARGET_DIR, editorFlag, languagesText);
    } catch (err) {
        logger.error(`Critical Execution Failure: ${err.message}`);
        process.exit(1);
    }
}

execute();
