# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
### [1.1.1](https://github.com/kaushalrao/ai-editor-presets/compare/v1.1.0...v1.1.1) (2026-03-23)

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [v1.1.0](https://github.com/kaushalrao/ai-editor-presets/compare/v1.0.0...v1.1.0) (2026-03-23)

### Features

* Add AI scaling strategy document, configure CI workflow, and update the test script in package.json ([4d351d8](https://github.com/kaushalrao/ai-editor-presets/commit/4d351d8e6b5a23e60ebe0f01d2f6846d4c89d6ef))
* Add automated GitHub UI release workflow triggered by version tags ([5080ee5](https://github.com/kaushalrao/ai-editor-presets/commit/5080ee5734aa99f8a153aa639dfc9ccf1b943b49))
* Add Copilot compiler to consolidate AI commons markdown into `copilot-instructions.md` and include a new compilation test ([9ce8389](https://github.com/kaushalrao/ai-editor-presets/commit/9ce83897f55f220702d0f8f373d1161f35991ba2))
* Add repository analysis and AI scaling strategy documentation, and update compiler to export core AI personas ([e9f91e3](https://github.com/kaushalrao/ai-editor-presets/commit/e9f91e39b6bec9c4fd2d2362e780a78d38dd9c03))
* Add standard-version for automated release management ([5cda960](https://github.com/kaushalrao/ai-editor-presets/commit/5cda9608427fdc9e55aa8ed621add0fea45eb548))
* Dynamically update .gitignore with editor-specific entries based on AI Commons configuration ([008a26d](https://github.com/kaushalrao/ai-editor-presets/commit/008a26d9a10f72b6cadb39918b6838c5cd163028))
* Expand  entries to include multiple AI configuration files ([5d94550](https://github.com/kaushalrao/ai-editor-presets/commit/5d94550984f8a3c29de20145f0b27f29187732d2))
* Implement `add`/`remove` CLI commands, introduce markdown linting, and remove deprecated agent/rule definitions ([dc5d0b3](https://github.com/kaushalrao/ai-editor-presets/commit/dc5d0b3334a23910e2e79f0082073e750aa7c15c))
* Implement an interactive CLI for guided editor and language setup, and add repository analysis documentation ([94eae87](https://github.com/kaushalrao/ai-editor-presets/commit/94eae87259bd02a625229a71477b15e889681980))
* Implement pre-commit linting with Husky, add a  script, and update markdownlint configuration ([0459dad](https://github.com/kaushalrao/ai-editor-presets/commit/0459dade0e7f65cea66852a638b8078eb82fc577))
* Implement tracking and purging of generated adapter files using a new `managedFiles` configuration ([9442e43](https://github.com/kaushalrao/ai-editor-presets/commit/9442e43cf6db40957373ecc69788031634ba77fd))
* Introduce antigravity adapter with SonarQube and PR review skills, and add a comprehensive AI scaling strategy document ([35e1b32](https://github.com/kaushalrao/ai-editor-presets/commit/35e1b322de99c6ae7ad19c7715742cc7fb74b43d))
* Introduce shared filesystem utilities and compiler registry, refactor adapters to use new utilities and async compilation ([e010b41](https://github.com/kaushalrao/ai-editor-presets/commit/e010b41271b82fe4995ad762d8f0bfd6b4cbd5b5))
* Prefix compiled rules with ecosystem names, add GitHub Actions CI for CLI compilation tests, and update the package test script ([8391c91](https://github.com/kaushalrao/ai-editor-presets/commit/8391c9196853a9246b785261152d9c8e1adc9b1e))
* Provide detailed file operation statistics (created, updated, skipped) for rules compilation and CLI output ([a22be52](https://github.com/kaushalrao/ai-editor-presets/commit/a22be52168aba950bb181aa2b13ed2ad19865c21))
* Rebrand project to AI Commons, implement a CLI with persistent configuration for silent updates, and add test documentation ([168376d](https://github.com/kaushalrao/ai-editor-presets/commit/168376dc2b7b76cbbf02c7295ac1163f6669ba75))
* Update compiler report format to include detailed `stats` objects ([3ab85d7](https://github.com/kaushalrao/ai-editor-presets/commit/3ab85d7124e3c3b91fd94e8304c7c9ba63088039))

### Bug Fixes

* **ci:** point github actions explicitly to new modular cli/index.js entrypoint ([14a2216](https://github.com/kaushalrao/ai-editor-presets/commit/14a22166bf3a2613198e10db3744e81e8ed948ac))
* **cli:** restore empty string parameter handling to bypass headless UI crashes ([ebbd923](https://github.com/kaushalrao/ai-editor-presets/commit/ebbd9233984998f3ab81870256abf967490bc0f4))

## [v1.0.0](https://github.com/kaushalrao/ai-editor-presets/compare/v5080ee5...v1.0.0) (2026-03-23)

### Features

* **AI Editor Presets**: Initial release of the AI Unified Rule Architecture.
* **Adapters**: Integrated support for Cursor, Copilot, and Antigravity.
* **Ecosystems**: Added targeted support for React, Python, Java, and more.
* **CLI**: Interactive setup wizard with `npx` capability.
* **Git Safety**: Automated `.gitignore` management.
