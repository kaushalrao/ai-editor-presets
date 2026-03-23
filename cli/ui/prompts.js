const { intro, outro, select, multiselect, isCancel } = require('@clack/prompts');
const pc = require('picocolors');

function handleCancel(result) {
    if (!isCancel(result)) return;
    outro(pc.yellow('Setup cancelled.'));
    process.exit(0);
}

const mapOptions = options => options.map(opt => ({ value: opt, label: opt }));

async function singleSelectPrompt(message, options) {
    intro(pc.bgCyan(pc.black(' 🚀 AI STANDARDS SETUP ')));
    const result = await select({ message, options: mapOptions(options) });
    handleCancel(result);
    return result;
}

async function multiSelectPrompt(message, options) {
    const result = await multiselect({
        message: `${message} (Space to toggle, Enter to confirm)`,
        options: mapOptions(options),
        required: false
    });
    handleCancel(result);
    outro(pc.green('Configuration captured! Compiling rules...'));
    return result;
}

module.exports = { singleSelectPrompt, multiSelectPrompt };
