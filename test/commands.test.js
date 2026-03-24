import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cliPath = path.resolve(__dirname, '../cli/index.js');
const testDir = path.resolve(__dirname, '../.test-sandbox');

function runCLI(args) {
    return execSync(`node ${cliPath} ${args}`, { encoding: 'utf8', stdio: 'inherit' });
}

function getConfig() {
    const configPath = path.join(testDir, '.ai-editor-presets.json');
    if (!fs.existsSync(configPath)) return null;
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

describe('AI Commons CLI', () => {
    beforeAll(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
        fs.mkdirSync(testDir);
        process.chdir(testDir);
    });

    afterAll(() => {
        process.chdir(__dirname);
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should initialize a new configuration', () => {
        runCLI('--editor=cursor --language=react');
        const config = getConfig();
        expect(config).toBeDefined();
        expect(config.cursor).toContain('react');
    });

    it('should add an ecosystem via the add command', () => {
        runCLI('add python');
        const config = getConfig();
        expect(config.cursor).toContain('python');
        expect(config.cursor).toContain('react'); // Original flag remains
    });

    it('should remove an ecosystem via the remove command', () => {
        runCLI('remove react');
        const config = getConfig();
        expect(config.cursor).not.toContain('react');
        expect(config.cursor).toContain('python');
    });
});
