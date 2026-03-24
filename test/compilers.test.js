import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cliPath = path.resolve(__dirname, '../cli/index.js');
const testDir = path.resolve(__dirname, '../.test-sandbox-compilers');

function runCLI(args) {
    return execSync(`node ${cliPath} ${args}`, { encoding: 'utf8', stdio: 'ignore', cwd: testDir });
}

describe('AI Commons Compilers', () => {
    beforeAll(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
        fs.mkdirSync(testDir);
    });

    afterAll(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should compile Cursor rules for specific ecosystems', () => {
        runCLI('--editor=cursor --language=react,python');
        const targetPath = path.join(testDir, '.cursor/rules');
        expect(fs.existsSync(targetPath)).toBe(true);
        expect(fs.lstatSync(targetPath).isDirectory()).toBe(true);
    });

    it('should compile Antigravity personas natively for all ecosystems', () => {
        runCLI('--editor=antigravity --language=""');
        const targetPath = path.join(testDir, '.agents/personas');
        expect(fs.existsSync(targetPath)).toBe(true);
        expect(fs.lstatSync(targetPath).isDirectory()).toBe(true);
    });

    it('should compile Copilot instructions into a flat concatenation', () => {
        runCLI('--editor=copilot --language=react');
        const targetPath = path.join(testDir, '.github/copilot-instructions.md');
        expect(fs.existsSync(targetPath)).toBe(true);
        expect(fs.lstatSync(targetPath).isFile()).toBe(true);
    });
});
