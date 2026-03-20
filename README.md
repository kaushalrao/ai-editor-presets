# AI Editor Presets: AI Unified Rule Architecture 🌀

An enterprise-grade, scalable repository for sharing AI coding guidelines, domain-driven design principles, and custom agent rules across your entire engineering team.

Unlike traditional dotfile overrides, **AI Editor Presets** acts as a smart, dynamically compiled library that integrates perfectly with **Cursor, GitHub Copilot, and Antigravity** without polluting your global IDE configurations.

## 🚀 Key Features

- **Editor Agnostic**: Write your AI rules once in Markdown. AI Editor Presets compiles them into `.cursor/rules`, `.agents/`, or flattens them into `.github/copilot-instructions.md`.
- **Ecosystem Targeting**: No more AI context bloat! Select exactly which framework you are working with (e.g., `react` or `python`) so your IDE only loads the rules relevant to that specific codebase.
- **Git Poisoning Prevention**: AI Editor Presets actively intercepts your repository's `.gitignore` and auto-injects tracking protection, guaranteeing you never accidentally commit your local AI states.
- **Interactive Setup Wizard**: Beautiful terminal UI lets developers use arrow keys to pick languages and editors natively.
- **Smart Sync & Delta Detection**: AI Editor Presets tracks your choices in a hidden `.ai-editor-presets.json` file. Future runs use content hashing to skip redundant writes!

---

## 🛠️ Getting Started

Integrating **AI Editor Presets** rules into any repository takes exactly one command.

Navigate to your project folder and run:
```bash
npx ai-editor-presets
```
*(Or if running from source: `npx github:kaushalrao/ai-editor-presets#develop`)*

### The Setup Wizard
Running AI Editor Presets without arguments opens the interactive setup:
1. **Choose your IDE Adapter:** (Cursor, GitHub Copilot, Antigravity)
2. **Select your Ecosystems:** Press **Space** to toggle (e.g. `[x] react`, `[ ] python`).

### Silent Flag Overrides
For CI/CD or power users, bypass the wizard via flags:
```bash
npx ai-editor-presets --editor=cursor --language=react,api-design
```

---

## 📂 Architecture & Contribution

AI Editor Presets rules are separated by domain for accurate compilation:

```text
ai-editor-presets/
├── 1-core-principles/         # Universal rules (Architecture, Security)
├── 2-ecosystems/              # Framework rules (Python, React)
├── 3-prompt-macros/           # Slash commands / Workflows
├── 4-agents/                  # Agent persona definitions
└── adapters/                  # Compiler logic per IDE
```

**To add a new language:**
Create a folder under `2-ecosystems/` (e.g. `2-ecosystems/go/`). AI Editor Presets dynamically scans this and presents 'go' in the UI!

**Strict Markdown Validation:**
To guarantee that LLMs flawlessly ingest tokens, any PR is evaluated by a GitHub Action validating `markdownlint` syntax and running end-to-end compiler verification.
