# Dev Sentinel @codeparcel

[![GitHub Repo stars](https://img.shields.io/github/stars/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/stargazers)
[![GitHub last commit](https://img.shields.io/github/last-commit/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/commits)
[![GitHub issues](https://img.shields.io/github/issues/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/issues)
[![GitHub forks](https://img.shields.io/github/forks/codeparcel/dev-sentinel)](https://github.com/codeparcel/dev-sentinel/network/members)
[![npm version](https://img.shields.io/npm/v/@codeparcel/dev-sentinel.svg)](https://www.npmjs.com/package/@codeparcel/dev-sentinel)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@codeparcel/dev-sentinel)](https://bundlephobia.com/package/@codeparcel/dev-sentinel)
[![build](https://img.shields.io/github/actions/workflow/status/codeparcel/dev-sentinel/publish.yml)](https://github.com/codeparcel/dev-sentinel/actions)
[![license](https://img.shields.io/npm/l/@codeparcel/dev-sentinel)](./LICENSE)
[![downloads](https://img.shields.io/npm/dm/@codeparcel/dev-sentinel.svg)](https://www.npmjs.com/package/@codeparcel/dev-sentinel)
[![types](https://img.shields.io/npm/types/@codeparcel/dev-sentinel.svg)](https://www.npmjs.com/package/@codeparcel/dev-sentinel)
[![node](https://img.shields.io/node/v/@codeparcel/dev-sentinel.svg)](https://nodejs.org)
> 🛡️ Utility kecil tapi berguna buat mengatur perilaku antara `development` dan `production`, khususnya untuk logging dan conditional execution.

## ✨ Fitur

* 🔇 Nonaktifkan `console.log` (atau jenis console lainnya) saat production
* ♻️ Jalankan kode hanya saat development (misal logging, dev tools, dsb)
* 💡 Cocok untuk project berbasis TypeScript / Vite / Node / Frontend frameworks

## 📦 Instalasi

```bash
npm install @codeparcel/dev-sentinel
# atau
yarn add @codeparcel/dev-sentinel
```

## 🧹 API

### `silenceConsole(methods?: ConsoleMethod[])`

Matikan beberapa method `console.*` ketika **bukan di development** (default: `'log'`, `'info'`, `'debug'`, `'warn'`).

```ts
import { silenceConsole } from '@codeparcel/dev-sentinel'

// Nonaktifkan console.log dan console.info di production
silenceConsole(['log', 'info'])
```

> ⚠️ Aman untuk dipanggil di `main.tsx`, `App.tsx`, atau entry point lain.

---

### `runIfDev(fn: () => void)`

Jalankan fungsi hanya saat mode development:

```ts
import { runIfDev } from '@codeparcel/dev-sentinel'

runIfDev(() => {
  console.log('This will only run in development')
})
```

---

## 🧪 Lingkungan Terdeteksi

`dev-sentinel` otomatis mendeteksi mode `development` dengan:

* `import.meta.env.MODE === 'development'` (Vite / ESM / browser env)
* `process.env.NODE_ENV === 'development'` (Node.js / bundlers lain)

---

## 🔧 Contoh Lengkap

```ts
import { silenceConsole, runIfDev } from '@codeparcel/dev-sentinel'

// Disable log saat production
silenceConsole()

// Logging hanya saat dev
runIfDev(() => {
  console.debug('DEBUG INFO')
})
```

---

## 🗪️ Dibuat oleh

🧠 [CodeParcel](https://github.com/codeparcel) — untuk dev yang suka rapi, clean, dan tangguh.

## 📄 Lisensi

[MIT](./LICENSE)
