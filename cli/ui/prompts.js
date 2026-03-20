const { intro, outro, select, multiselect, isCancel } = require('@clack/prompts');
const pc = require('picocolors');

async function singleSelectPrompt(message, options) {
    intro(pc.bgCyan(pc.black(' 🚀 AI COMMONS SETUP ')));
    
    const mappedOptions = options.map(opt => ({ value: opt, label: opt }));
    
    const result = await select({
        message: message,
        options: mappedOptions,
    });
    
    if (isCancel(result)) {
        outro(pc.yellow('Setup cancelled.'));
        process.exit(0);
    }
    
    return result;
}

async function multiSelectPrompt(message, options) {
    const mappedOptions = options.map(opt => ({ value: opt, label: opt }));
    
    const result = await multiselect({
        message: `${message} (Space to toggle, Enter to confirm)`,
        options: mappedOptions,
        required: false,
    });
    
    if (isCancel(result)) {
        outro(pc.yellow('Setup cancelled.'));
        process.exit(0);
    }
    
    outro(pc.green('Configuration captured! Compiling rules...'));
    return result;
}

module.exports = { singleSelectPrompt, multiSelectPrompt };
