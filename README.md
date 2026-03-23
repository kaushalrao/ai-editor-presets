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

## 🛠️ Usage & Flags

Bypass the wizard for CI/CD or automated setups using flags:

```bash
# Setup Cursor rules for a React project
npx ai-editor-presets --editor=cursor --language=react

# Setup for multiple ecosystems
npx ai-editor-presets --editor=antigravity --language=react,api-design
```

---

## 📂 Repository Architecture

**AI Editor Presets** rules are modular and domain-driven:

- `1-core-principles/`: Universal rules (Architecture, Security, Documentation).
- `2-ecosystems/`: Framework-specific rules (React, Python, Java, etc.).
- `3-prompt-macros/`: Shared slash commands and workflows.
- `4-agents/`: Core agent persona definitions.
- `adapters/`: The compiler logic that transforms rules for specific IDEs.

---

## 🤝 Contributing & Customization

**AI Editor Presets** is built to be extended. To add a new language, simply create a folder under `2-ecosystems/` (e.g., `2-ecosystems/go/`). The registry will automatically detect it and present it as an option in the CLI.

---

*Join the future of AI-native engineering with AI Editor Presets.*


