# AI Editor Presets 🌀
[![npm version](https://img.shields.io/npm/v/ai-editor-presets.svg)](https://www.npmjs.com/package/ai-editor-presets)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**AI Editor Presets** is an enterprise-grade CLI tool for dynamically injecting AI coding standards, domain-driven design principles, and custom agent rules into your project.

Stop manually copying `.mdc` or `.md` files. **AI Editor Presets** acts as a smart, dynamically compiled library that integrates perfectly with **Cursor, GitHub Copilot, and Antigravity** without polluting your global IDE configurations.

---

## 🚀 Quick Start

```bash
npx ai-editor-presets
```

1. **Editor**: Pick your IDE (Cursor, Copilot, Antigravity).
2. **Profile** *(optional)*: Load a named rule bundle (e.g., `backend`, `frontend`).
3. **Ecosystems**: Choose your stack — or skip if a profile was selected.

---

## ✨ Key Features

- **Editor Agnostic**: Rules compiled into `.cursor/rules`, `.agents/`, or Copilot format.
- **Org-Level Profiles**: Apply named rule bundles (`backend`, `frontend`) across all projects.
- **Micro-Context Injection**: Select exactly the frameworks you use — no bloat.
- **Git Safety First**: Auto-injects `.gitignore` protection for rule states.
- **Zero-Friction Updates**: Re-run at any time to silently sync to the latest standards.
- **Smart Delta Detection**: Content hashing ensures only changed files are overwritten.

---

## 🛠️ CLI Commands & Usage

```bash
npx ai-editor-presets
```

### Commands

| Command | Description |
| :--- | :--- |
| `init` | (default) Initialize or silently sync existing config. |
| `add [ecosystem]` | Add a framework. Launches interactive menu if omitted. |
| `remove [ecosystem]` | Remove a framework. Launches interactive menu if omitted. |
| `profiles` | List all available built-in and custom profiles. |
| `help` | Show CLI usage and options. |

### Headless Flags (CI/CD)

```bash
npx ai-editor-presets --editor=cursor --language=react
npx ai-editor-presets --editor=antigravity --profile=backend
npx ai-editor-presets add python
npx ai-editor-presets remove react
npx ai-editor-presets profiles
```

---

## 👤 Org-Level Profiles

Profiles are named rule bundles that enforce a standard set of ecosystems across all projects.

### Built-in Profiles

| Profile | Languages Injected |
| :--- | :--- |
| `default` | *(baseline — customizable)* |
| `backend` | `python`, `api-design`, `database-design` |
| `frontend` | `react` |

### Custom Profiles

Drop a JSON file into `~/.ai-editor-presets/profiles/` to create a personal or org-wide override:

```json
// ~/.ai-editor-presets/profiles/my-team.json
{
  "description": "My team's standard setup.",
  "languages": ["react", "python"]
}
```

Custom profiles override built-ins of the same name and appear in `npx ai-editor-presets profiles`.

---

## 📂 Repository Architecture

- `core/`: Universal rules (Architecture, Security, Documentation).
- `ecosystems/`: Framework-specific rules (React, Python, Java, etc.).
- `profiles/`: Named rule bundles for team or org-level standardization.
- `library/prompts/`: Shared slash commands and workflows.
- `library/agents/`: Core agent persona definitions.
- `adapters/`: Compiler logic that transforms rules for specific IDEs.

---

## 🤝 Contributing & Customization

To add a new ecosystem, create a file under `ecosystems/` in the appropriate category (e.g., `ecosystems/languages/go.md`). The CLI auto-detects and presents it as an option.

To add a new profile, create a JSON file under `profiles/` following the schema of existing profiles.

---

## 🧪 Testing

```bash
npm test
```

Uses **Vitest** for high-performance integration testing across all adapters and profile scenarios.


