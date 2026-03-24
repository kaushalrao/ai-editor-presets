const fs = require('fs');
const path = require('path');
const os = require('os');

const BUILT_IN_PROFILES_DIR = path.join(__dirname, '..', '..', 'profiles');
const USER_PROFILES_DIR = path.join(os.homedir(), '.ai-editor-presets', 'profiles');
const EXCLUDED_KEYS = new Set(['profile', 'managedFiles']);

function loadProfile(name) {
    const userPath = path.join(USER_PROFILES_DIR, `${name}.json`);
    const builtInPath = path.join(BUILT_IN_PROFILES_DIR, `${name}.json`);
    const profilePath = fs.existsSync(userPath) ? userPath : builtInPath;
    if (!fs.existsSync(profilePath)) return null;
    try {
        return JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    } catch (_) {
        return null;
    }
}

function readDir(dir, source) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({ name: f.replace('.json', ''), source }));
}

function listProfiles() {
    return [...readDir(BUILT_IN_PROFILES_DIR, 'built-in'), ...readDir(USER_PROFILES_DIR, 'custom')];
}

function applyProfile(config) {
    if (!config.profile) return config;
    const profile = loadProfile(config.profile);
    if (!profile) return config;

    const profileLanguages = profile.languages || [];
    const merged = { ...config };
    Object.keys(merged)
        .filter(key => !EXCLUDED_KEYS.has(key))
        .forEach(key => {
            const existing = Array.isArray(merged[key]) ? merged[key] : [];
            merged[key] = [...new Set([...existing, ...profileLanguages])];
        });
    return merged;
}

module.exports = { loadProfile, listProfiles, applyProfile };
