# AI Commons

An enterprise-grade, scalable repository for sharing AI coding guidelines, domain-driven design principles, and custom agent rules across your entire engineering team.

Unlike traditional dotfile overrides, AI Commons acts as a smart, dynamically compiled library that integrates perfectly with **Cursor, GitHub Copilot, and Antigravity** without polluting your global IDE configurations.

## 🚀 Key Features (V2 Architecture)

- **Editor Agnostic**: Write your AI rules strictly once in Markdown. The built-in CLI engine natively compiles them into `.cursor/rules`, `.agents/`, or uniquely flattens them into `.github/copilot-instructions.md`.
- **Ecosystem Targeting**: No more AI context bloat! Select exactly which framework you are working with (e.g., `react` or `python`) so your IDE only loads the rules relevant to that specific codebase.
- **Git Poisoning Prevention**: The CLI actively intercepts your repository's `.gitignore` and auto-injects tracking protection, guaranteeing you never accidentally commit your local AI states to the main branch!
- **Interactive Setup Wizard**: Beautiful terminal UI lets developers use arrow keys to pick languages and editors natively without installing bulky third-party dependencies.
- **Auto-Updating State Tracker**: The CLI saves your project choices to a hidden `.ai-commons.json` file. Future runs automatically read this state to silently fetch the newest rules!

---

## 🛠️ Getting Started

Integrating the AI Commons rules into any repository on your machine takes exactly one command. You do not need to clone this repository manually.

Navigate to your active project folder in your terminal and run:
```bash
npx github:kaushalrao/aifsd-commons#develop
```

### The Setup Wizard
If you run the initialization command without any explicit arguments, it will open an interactive setup wizard:
1. **Choose your IDE Adapter:** (Cursor, GitHub Copilot, Antigravity)
2. **Select your Ecosystems:** Press **Space** to toggle the languages your project uses (e.g. `[x] react`, `[ ] python`).

When you hit **Enter**, it will instantly compile and inject the AI rules natively into your repository!

### Silent Flag Overrides
For CI/CD scripts or power users, you can bypass the interactive wizard by specifying your targets via flags:
```bash
npx github:kaushalrao/aifsd-commons#develop --editor=cursor --language=react,api-design
```

---

## 🔄 Updating & Modifying Rules

Whenever the central team publishes new security guidelines or refactoring prompt macros to this repository, you simply run the exact same `npx` command in your terminal again!
```bash
npx -y github:kaushalrao/aifsd-commons#develop
```
**State Persistence:** Because your initial installation stored a `.ai-commons.json` file in your repository root, the CLI will skip the interactive wizard entirely and silently update your rules in the background based on your previously saved preferences!

### Advanced CLI Routing
Instead of wiping your configuration, you can dynamically `add` or `remove` rules from your local tracking configuration. The script will automatically intercept your `.ai-commons.json` state, apply the changes, and execute a silent background update instantly!
```bash
# Add python rules to your local AI environment
npx github:kaushalrao/aifsd-commons#develop add python

# Remove api-design rules
npx github:kaushalrao/aifsd-commons#develop remove api-design
```

---

## 📂 Architecture & Adding Rules

To contribute new intelligence to the AI Commons repository, understand that rules are strictly separated by domain so they can be accurately compiled by the `adapters/`:

```text
ai-commons/
├── 1-core-principles/         # Universal rules (e.g., Architecture, Security)
├── 2-ecosystems/              # Framework-specific rules (e.g., Python, React)
├── 3-prompt-macros/           # Slash commands accessible by the user
├── 4-agents/                  # Complex agent persona definitions
└── adapters/                  # Compiler logic that translates rules to IDEs
```

**To add a new language:**
Simply create a new folder under `2-ecosystems/` (e.g. `2-ecosystems/go/`). The CLI engine dynamically scans this directory and will instantly present 'go' as an option in your interactive Terminal UI!

**Strict Markdown Validation (CI/CD):**
To guarantee that LLMs flawlessly ingest token logic, any Pull Request submitted to this repository is actively evaluated by a headless Node 24 GitHub Action. This validates strict `markdownlint` syntax (while safely bypassing LLM-specific line-length limitations via our `.markdownlint.json` custom configuration) and runs end-to-end compiler deployment verification.
