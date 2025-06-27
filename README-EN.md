# Dev Sentinel @codeparcel

[![GitHub Repo stars](https://img.shields.io/github/stars/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/stargazers)
[![GitHub last commit](https://img.shields.io/github/last-commit/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/commits)
[![GitHub issues](https://img.shields.io/github/issues/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/issues)
[![GitHub forks](https://img.shields.io/github/forks/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/network/members)
[![npm version](https://img.shields.io/npm/v/@codeparcel/dev-sentinel.svg)](https://www.npmjs.com/package/@codeparcel/dev-sentinel)
[![Coverage Status](https://img.shields.io/badge/coverage-92.5%25-brightgreen)](#)
[![Test Status](https://img.shields.io/badge/tests-passing-brightgreen?logo=vitest)](#)
[![Example](https://img.shields.io/badge/example-%F0%9F%93%9D%20Run%20Demo-blue)](https://github.com/codeparcel/dev-sentinel/blob/main/examples/index.ts)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@codeparcel/dev-sentinel)](https://bundlephobia.com/package/@codeparcel/dev-sentinel)
[![build](https://img.shields.io/github/actions/workflow/status/codeparcel/dev-sentinel/publish.yml)](https://github.com/codeparcel/dev-sentinel/actions)
[![license](https://img.shields.io/npm/l/@codeparcel/dev-sentinel)](./LICENSE)
[![downloads](https://img.shields.io/npm/dm/@codeparcel/dev-sentinel.svg)](https://www.npmjs.com/package/@codeparcel/dev-sentinel)
[![types](https://img.shields.io/npm/types/@codeparcel/dev-sentinel.svg)](https://www.npmjs.com/package/@codeparcel/dev-sentinel)
[![node](https://img.shields.io/node/v/@codeparcel/dev-sentinel.svg)](https://nodejs.org)
[![Open in GitHub Codespaces](https://img.shields.io/badge/dev-Codespaces-blue?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&repo=codeparcel%2Fdev-sentinel)

> 🛡️ A small yet useful utility for managing behavior between `development` and `production`, especially for logging and conditional execution.

---

## ❓ Why Dev Sentinel?

🔹 Sometimes we need extra logs, mock data, or tools in development only.

🔹 But it's a hassle to remove those manually before deploying to production.

🔹 `@codeparcel/dev-sentinel` helps you automate and keep things clean.

🔹 As your project grows, uncontrolled logs can:

* Interfere with debugging
* Pollute your console in production
* Accidentally leak information

**Dev Sentinel** helps maintain **runtime cleanliness and security** — in just 1-2 lines of code.

---

## 📸 Quick Demo

```ts
import { silenceConsole, runIfDev } from '@codeparcel/dev-sentinel'

silenceConsole(['log'])
console.log('This will not show in production')

runIfDev(() => {
  console.debug('Only shows in development')
})
```

---

## 📂 Live Example

📄 [Live Example (examples/index.ts)](./examples/index.ts)

---

## ✅ Compatibility

* ✅ Node.js (v14+)
* ✅ TypeScript (v4+)
* ✅ Browser via bundlers (Vite, Rollup, Webpack)
* ✅ Frameworks: React, Vue, Svelte, etc.

---

## 🧩 Optional Configuration

### 🔧 TypeScript (`tsconfig.json`)

To ensure `import.meta.env` works:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["vite/client"]
  }
}
```

Also ensure your `.env` file is recognized:

```env
NODE_ENV=development
DEV_SENTINEL_LOG=false
```

---

## 📊 Flow Diagram

```text
[environment detection]
        │
        ▼
+------------------------+
|  getEnv()              |
+------------------------+
        │
        ▼
+------------------------+
|  isDevEnv()            |
+------------------------+
        │         │
   true ▼         ▼ false
+-----------+   +-----------+
| runIfDev  |   | runIfProd |
+-----------+   +-----------+
        │
        ▼
+------------------------+
| silenceConsole(), etc. |
+------------------------+
```

---

## ✨ Features

* 🔇 Disable `console.log` (or others) in production
* ♻️ Execute code only in development
* 🧠 Flexible wrappers: `devOnly`, `prodOnly`
* 📦 Lightweight, no dependencies
* 💡 Controlled via `.env`
* 💡 Great for TypeScript / Vite / Node / frontend apps

## 📦 Installation

```bash
npm install @codeparcel/dev-sentinel
# or
yarn add @codeparcel/dev-sentinel
```

## 🧹 API

*(See original document for full API list)*

---

## ✅ Coverage & Testing

This package is fully tested using [`vitest`](https://vitest.dev) with >90% coverage:

| Metric     | Status |
| ---------- | ------ |
| Statements | 93.93% |
| Branches   | 73.91% |
| Functions  | 100%   |
| Lines      | 93.93% |

### 🧪 Run tests:

```bash
npm run test
```

### 📊 Run coverage:

```bash
npm run coverage
```

---

## 🧠 Created by

<img src="https://avatars.githubusercontent.com/u/217093625?s=400&u=58f87fd3009e11d1f98b7eda61547cee101109ee&v=4" alt="CodeParcel Logo" width="120" />

[CodeParcel](https://github.com/codeparcel) — for devs who love clean, strong, maintainable code.

## 📄 License

[MIT](./LICENSE)
