import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(__dirname, '..');
const cliPath = path.resolve(REPO_ROOT, 'cli/index.js');
const testDir = path.resolve(REPO_ROOT, '.test-sandbox-profiles');
const profileResolver = require('../cli/services/profile-resolver');

function runCLI(args) {
    return execSync(`node ${cliPath} ${args}`, { encoding: 'utf8', stdio: 'pipe', cwd: testDir });
}

function getConfig() {
    const configPath = path.join(testDir, '.ai-editor-presets.json');
    if (!fs.existsSync(configPath)) return null;
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

describe('Profile Resolver — Unit Tests', () => {
    describe('loadProfile()', () => {
        it('should load a built-in profile by name', () => {
            const profile = profileResolver.loadProfile('frontend');
            expect(profile).toBeDefined();
            expect(profile.languages).toContain('react');
        });

        it('should load the backend profile with correct languages', () => {
            const profile = profileResolver.loadProfile('backend');
            expect(profile).toBeDefined();
            expect(profile.languages).toContain('python');
            expect(profile.languages).toContain('api-design');
            expect(profile.languages).toContain('database-design');
        });

        it('should return null for an unknown profile', () => {
            const profile = profileResolver.loadProfile('non-existent-profile');
            expect(profile).toBeNull();
        });
    });

    describe('listProfiles()', () => {
        it('should list all built-in profiles', () => {
            const profiles = profileResolver.listProfiles();
            const names = profiles.map(p => p.name);
            expect(names).toContain('default');
            expect(names).toContain('frontend');
            expect(names).toContain('backend');
        });

        it('should tag built-in profiles with source "built-in"', () => {
            const profiles = profileResolver.listProfiles();
            const builtIn = profiles.filter(p => p.source === 'built-in');
            expect(builtIn.length).toBeGreaterThan(0);
        });
    });

    describe('applyProfile()', () => {
        it('should return config unchanged when no profile is set', () => {
            const config = { antigravity: ['react'], managedFiles: [] };
            expect(profileResolver.applyProfile(config)).toEqual(config);
        });

        it('should return config unchanged when profile is unknown', () => {
            const config = { antigravity: ['react'], profile: 'unknown' };
            expect(profileResolver.applyProfile(config)).toEqual(config);
        });

        it('should merge profile languages into each editor entry', () => {
            const config = { antigravity: ['react'], profile: 'backend' };
            const merged = profileResolver.applyProfile(config);
            expect(merged.antigravity).toContain('react');
            expect(merged.antigravity).toContain('python');
            expect(merged.antigravity).toContain('api-design');
        });

        it('should not duplicate languages already present in config', () => {
            const config = { antigravity: ['python'], profile: 'backend' };
            const merged = profileResolver.applyProfile(config);
            const pythonCount = merged.antigravity.filter(l => l === 'python').length;
            expect(pythonCount).toBe(1);
        });

        it('should not apply profile languages to reserved keys (profile, managedFiles)', () => {
            const config = { antigravity: ['react'], profile: 'backend', managedFiles: [] };
            const merged = profileResolver.applyProfile(config);
            expect(merged.profile).toBe('backend');
            expect(merged.managedFiles).toEqual([]);
        });
    });
});

describe('Profile CLI Integration', () => {
    beforeAll(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
        fs.mkdirSync(testDir);
    });

    afterAll(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should persist the profile flag in project config', () => {
        runCLI('--editor=antigravity --profile=frontend');
        const config = getConfig();
        expect(config).toBeDefined();
        expect(config.profile).toBe('frontend');
    });

    it('should inject profile languages during compilation', () => {
        runCLI('--editor=antigravity --profile=backend');
        const config = getConfig();
        expect(config.profile).toBe('backend');
        expect(config.managedFiles.length).toBeGreaterThan(0);
    });

    it('should list available profiles via the profiles command', () => {
        const output = execSync(`node ${cliPath} profiles`, { encoding: 'utf8', cwd: testDir });
        const plain = output.replace(/\x1b\[[0-9;]*m/g, '');
        expect(plain).toContain('Available Profiles');
        expect(plain).toContain('frontend');
        expect(plain).toContain('backend');
        expect(plain).toContain('default');
    });
});
