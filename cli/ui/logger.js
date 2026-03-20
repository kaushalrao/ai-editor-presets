const pc = require('picocolors');

module.exports = {
    success: (msg) => console.log(pc.green(`✅ ${msg}`)),
    error: (msg) => console.error(pc.red(`❌ Error: ${msg}`)),
    warn: (msg) => console.log(pc.yellow(`⚠️  ${msg}`)),
    info: (msg) => console.log(pc.cyan(`◇  ${msg}`)),
    step: (msg) => console.log(pc.dim(`  │  `) + pc.gray(msg)),
    header: (msg) => console.log(pc.bgCyan(pc.black(`\n ⚙️  ${msg} \n`))),
    clear: () => console.clear()
};
