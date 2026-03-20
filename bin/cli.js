#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("🚀 Welcome to the AI Commons Setup CLI!");

// Basic argument parsing
const args = process.argv.slice(2);
const editorArg = args.find(a => a.startsWith('--editor='));
const languageArg = args.find(a => a.startsWith('--language='));

// Default to cursor if not specified
const editor = editorArg ? editorArg.split('=')[1] : 'cursor';
// Split languages into an array if available
const languages = languageArg ? languageArg.split('=')[1].split(',') : [];

const repoRoot = path.join(__dirname, '..');
const targetDir = process.cwd();

// Load the selected editor adapter
const adapterPath = path.join(repoRoot, 'adapters', editor, 'compiler.js');
if (!fs.existsSync(adapterPath)) {
  console.error(`\n❌ Adapter not found for editor: ${editor}`);
  console.error(`Available adapters currently implemented: cursor`);
  process.exit(1);
}

const adapter = require(adapterPath);
console.log(`\n⚙️  Syncing rules for [${editor.toUpperCase()}] into -> ${targetDir}\n`);

try {
    adapter.compile(repoRoot, targetDir, languages);
    console.log(`\n✅ AI Commons rules synced successfully for ${editor}!`);
    console.log(`You are now ready to code!`);
} catch (e) {
    console.error(`\n❌ Error during sync:`, e.message);
    process.exit(1);
}
