# AI Editor Presets 🌀
[![npm version](https://img.shields.io/npm/v/ai-editor-presets.svg)](https://www.npmjs.com/package/ai-editor-presets)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**AI Editor Presets** is an enterprise-grade CLI tool for dynamically injecting AI coding standards, domain-driven design principles, and custom agent rules into your project.

Stop manually copying `.mdc` or `.md` files. **AI Editor Presets** acts as a smart, dynamically compiled library that integrates perfectly with **Cursor, GitHub Copilot, and Antigravity** without polluting your global IDE configurations.

---

## 🚀 Quick Start

Run **AI Editor Presets** in any project directory to instantly set up your AI environment:

```bash
npx ai-editor-presets
```

### What happens next?
1. **Interactive Wizard**: A beautiful UI lets you pick your IDE (Cursor, Copilot, Antigravity).
2. **Ecosystem Selector**: Choose your stack (e.g., `react`, `python`, `java`).
3. **Smart Injection**: The CLI compiles the exact rules you need and auto-configures your `.gitignore` to prevent tracking of local AI states.

---

## ✨ Key Features

- **Editor Agnostic**: Write rules once. AI Editor Presets compiles them into `.cursor/rules`, `.agents/`, or flattens them for Copilot.
- **Micro-Context Injection**: Select exactly which frameworks you are using so your IDE isn't bloated with irrelevant rules.
- **Git Safety First**: Automatically injects tracking protection into your `.gitignore` so you never accidentally commit rule states.
- **Zero-Friction Updates**: Run `npx ai-editor-presets` again at any time to silently sync to the latest standards.
- **Smart Delta Detection**: Uses content hashing to only overwrite files that have actually changed.

---

## 🛠️ CLI Commands & Usage

Run the CLI natively to trigger the interactive setup wizard or to silently sync existing configs:

```bash
npx ai-editor-presets
```

### Commands

- `init` (default): Initialize a new project or sync existing presets without prompting.
- `add [ecosystem]?`: Add a new framework or language. If omitted, an interactive menu launches.
- `remove [ecosystem]?`: Remove an existing framework or language. If omitted, an interactive menu launches.
- `help`: Display the standard CLI usage and options menu.

### Headless Flags (CI/CD)

Bypass the wizard for automated setups using flags:

```bash
npx ai-editor-presets --editor=cursor --language=react
npx ai-editor-presets add python
npx ai-editor-presets remove react
```

---

## 📂 Repository Architecture

**AI Editor Presets** rules are modular and domain-driven:

- `core/`: Universal rules (Architecture, Security, Documentation).
- `ecosystems/`: Framework-specific rules (React, Python, Java, etc.).
- `library/prompts/`: Shared slash commands and workflows.
- `library/agents/`: Core agent persona definitions.
- `adapters/`: The compiler logic that transforms rules for specific IDEs.

---

## 🤝 Contributing & Customization

**AI Editor Presets** is built to be extended. To add a new language, simply create a file under `ecosystems/` in the appropriate category (e.g., `ecosystems/languages/go.md`). The CLI will automatically detect it and present it as an option.

---

## 🧪 Testing

The repository uses **Vitest** for native, high-performance end-to-end integration testing. Tests simulate real-world CLI commands across all adapters and assert exact compilation outputs.

```bash
npm test
```

---

*Join the future of AI-native engineering with AI Editor Presets.*


