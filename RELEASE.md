# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/kaushalrao/aifsd-commons/compare/v1.1.1...v1.2.0) (2026-03-20)


### Features

* Introduce shared filesystem utilities and compiler registry, refactor adapters to use new utilities and async compilation ([8371bac](https://github.com/kaushalrao/aifsd-commons/commit/8371bac08b51b9879310a20a70b6ddabd86d982e))
* Provide detailed file operation statistics (created, updated, skipped) for rules compilation and CLI output ([f883fb7](https://github.com/kaushalrao/aifsd-commons/commit/f883fb72ba6379215470b1fe05caeed2db02af97))


### Bug Fixes

* **ci:** point github actions explicitly to new modular cli/index.js entrypoint ([f3da83d](https://github.com/kaushalrao/aifsd-commons/commit/f3da83d1df29e08133b715a33fdac2e571415e15))
* **cli:** restore empty string parameter handling to bypass headless UI crashes ([9db8529](https://github.com/kaushalrao/aifsd-commons/commit/9db8529ba57a6f24252a2498e760a8c42a60e8f0))

## 1.1.0 (2026-03-20)


### Features

* Add AI scaling strategy document, configure CI workflow, and update the test script in package.json ([4d351d8](https://github.com/kaushalrao/aifsd-commons/commit/4d351d8e6b5a23e60ebe0f01d2f6846d4c89d6ef))
* Add automated GitHub UI release workflow triggered by version tags ([5080ee5](https://github.com/kaushalrao/aifsd-commons/commit/5080ee5734aa99f8a153aa639dfc9ccf1b943b49))
* Add Copilot compiler to consolidate AI commons markdown into `copilot-instructions.md` and include a new compilation test ([9ce8389](https://github.com/kaushalrao/aifsd-commons/commit/9ce83897f55f220702d0f8f373d1161f35991ba2))
* Add repository analysis and AI scaling strategy documentation, and update compiler to export core AI personas ([e9f91e3](https://github.com/kaushalrao/aifsd-commons/commit/e9f91e39b6bec9c4fd2d2362e780a78d38dd9c03))
* Add standard-version for automated release management ([5cda960](https://github.com/kaushalrao/aifsd-commons/commit/5cda9608427fdc9e55aa8ed621add0fea45eb548))
* Expand  entries to include multiple AI configuration files ([5d94550](https://github.com/kaushalrao/aifsd-commons/commit/5d94550984f8a3c29de20145f0b27f29187732d2))
* Implement `add`/`remove` CLI commands, introduce markdown linting, and remove deprecated agent/rule definitions ([dc5d0b3](https://github.com/kaushalrao/aifsd-commons/commit/dc5d0b3334a23910e2e79f0082073e750aa7c15c))
* Implement an interactive CLI for guided editor and language setup, and add repository analysis documentation ([94eae87](https://github.com/kaushalrao/aifsd-commons/commit/94eae87259bd02a625229a71477b15e889681980))
* Implement pre-commit linting with Husky, add a  script, and update markdownlint configuration ([0459dad](https://github.com/kaushalrao/aifsd-commons/commit/0459dade0e7f65cea66852a638b8078eb82fc577))
* Implement tracking and purging of generated adapter files using a new `managedFiles` configuration ([9442e43](https://github.com/kaushalrao/aifsd-commons/commit/9442e43cf6db40957373ecc69788031634ba77fd))
* Introduce antigravity adapter with SonarQube and PR review skills, and add a comprehensive AI scaling strategy document ([35e1b32](https://github.com/kaushalrao/aifsd-commons/commit/35e1b322de99c6ae7ad19c7715742cc7fb74b43d))
* Prefix compiled rules with ecosystem names, add GitHub Actions CI for CLI compilation tests, and update the package test script ([8391c91](https://github.com/kaushalrao/aifsd-commons/commit/8391c9196853a9246b785261152d9c8e1adc9b1e))
* Rebrand project to AI Editor Presets, implement a CLI with persistent configuration for silent updates, and add test documentation ([168376d](https://github.com/kaushalrao/ai-standards/commit/168376dc2b7b76cbbf02c7295ac1163f6669ba75))

## 1.0.0 (2026-03-20)

### Features

* Add AI scaling strategy document, configure CI workflow, and update the test script in package.json ([4d351d8](https://github.com/kaushalrao/aifsd-commons/commit/4d351d8e6b5a23e60ebe0f01d2f6846d4c89d6ef))
* Add Copilot compiler to consolidate AI commons markdown into `copilot-instructions.md` and include a new compilation test ([9ce8389](https://github.com/kaushalrao/aifsd-commons/commit/9ce83897f55f220702d0f8f373d1161f35991ba2))
* Add repository analysis and AI scaling strategy documentation, and update compiler to export core AI personas ([e9f91e3](https://github.com/kaushalrao/aifsd-commons/commit/e9f91e39b6bec9c4fd2d2362e780a78d38dd9c03))
* Add standard-version for automated release management ([5cda960](https://github.com/kaushalrao/aifsd-commons/commit/5cda9608427fdc9e55aa8ed621add0fea45eb548))
* Expand  entries to include multiple AI configuration files ([5d94550](https://github.com/kaushalrao/aifsd-commons/commit/5d94550984f8a3c29de20145f0b27f29187732d2))
* Implement `add`/`remove` CLI commands, introduce markdown linting, and remove deprecated agent/rule definitions ([dc5d0b3](https://github.com/kaushalrao/aifsd-commons/commit/dc5d0b3334a23910e2e79f0082073e750aa7c15c))
* Implement an interactive CLI for guided editor and language setup, and add repository analysis documentation ([94eae87](https://github.com/kaushalrao/aifsd-commons/commit/94eae87259bd02a625229a71477b15e889681980))
* Implement pre-commit linting with Husky, add a  script, and update markdownlint configuration ([0459dad](https://github.com/kaushalrao/aifsd-commons/commit/0459dade0e7f65cea66852a638b8078eb82fc577))
* Implement tracking and purging of generated adapter files using a new `managedFiles` configuration ([9442e43](https://github.com/kaushalrao/aifsd-commons/commit/9442e43cf6db40957373ecc69788031634ba77fd))
* Introduce antigravity adapter with SonarQube and PR review skills, and add a comprehensive AI scaling strategy document ([35e1b32](https://github.com/kaushalrao/aifsd-commons/commit/35e1b322de99c6ae7ad19c7715742cc7fb74b43d))
* Prefix compiled rules with ecosystem names, add GitHub Actions CI for CLI compilation tests, and update the package test script ([8391c91](https://github.com/kaushalrao/aifsd-commons/commit/8391c9196853a9246b785261152d9c8e1adc9b1e))
* Rebrand project to Aura, implement a CLI with persistent configuration for silent updates, and add test documentation ([168376d](https://github.com/kaushalrao/aura/commit/168376dc2b7b76cbbf02c7295ac1163f6669ba75))
