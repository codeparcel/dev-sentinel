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

---

## ❓ Mengapa Dev Sentinel?

🔹 Kadang kita butuh log tambahan, mock data, atau tool hanya saat development.

🔹 Tapi repot kalau harus hapus kode-kode itu sebelum deploy ke production.

🔹 Nah, `@codeparcel/dev-sentinel` bantu kamu bikin semua itu otomatis & bersih.

🔹 Saat project membesar, log yang tidak terkontrol bisa:

* Mengganggu debugging
* Memenuhi console saat production
* Menyebabkan kebocoran informasi tidak sengaja

**Dev Sentinel** membantu kamu menjaga **kebersihan log dan keamanan runtime**, hanya dengan 1-2 baris kode.

---

## 📸 Demo Singkat

```ts
import { silenceConsole, runIfDev } from '@codeparcel/dev-sentinel'

silenceConsole(['log'])
console.log('Ini tidak akan tampil di production')

runIfDev(() => {
  console.debug('Ini hanya muncul di development')
})
```

---

## 📂 Contoh Langsung

📄 [Contoh Langsung (examples/index.ts)](./examples/index.ts)

---

## ✅ Kompatibilitas

* ✅ Node.js (v14+)
* ✅ TypeScript (v4+)
* ✅ Browser via bundler (Vite, Rollup, Webpack)
* ✅ Framework: React, Vue, Svelte, dsb

---

## 🧩 Konfigurasi Tambahan (Optional)

### 🔧 TypeScript (`tsconfig.json`)

Tambahkan agar `import.meta.env` tidak error:

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

Dan untuk memastikan file `.env` dikenali oleh tools seperti Vite atau tsx:

```env
NODE_ENV=development
DEV_SENTINEL_LOG=false
```

---

## 📊 Diagram Alur

```text
[deteksi environment]
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
| silenceConsole() dll.  |
+------------------------+
```

---

## ✨ Fitur

* 🔇 Nonaktifkan `console.log` (atau jenis console lainnya) saat production
* ♻️ Jalankan kode hanya saat development (misal logging, dev tools, dsb)
* 🧠 Wrapper devOnly/prodOnly yang fleksibel
* 📦 Ringan, tanpa dependencies
* 💡 Bisa dikontrol juga via `.env`
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

### `getSilencedConsoleMethodsFromEnv()`

Ambil list method yang ingin disilent berdasarkan `.env`, contoh:

```env
DEV_SENTINEL_LOG=true
DEV_SENTINEL_INFO=false
DEV_SENTINEL_DEBUG=false
DEV_SENTINEL_WARN=true
```

```ts
import { silenceConsole, getSilencedConsoleMethodsFromEnv } from '@codeparcel/dev-sentinel'

silenceConsole(getSilencedConsoleMethodsFromEnv())
```

Jika environment variable tidak diset sama sekali, fallback ke default: `['log', 'info', 'debug', 'warn']`

---

### `silenceSpecificConsoleLevel(method: ConsoleMethod)`

Nonaktifkan satu jenis console secara spesifik (tanpa lihat environment):

```ts
import { silenceSpecificConsoleLevel } from '@codeparcel/dev-sentinel'

silenceSpecificConsoleLevel('warn')
```

---

### `wrapConsoleMethod(method: ConsoleMethod, wrapperFn)`

Ubah perilaku bawaan `console` dengan pembungkus:

```ts
import { wrapConsoleMethod } from '@codeparcel/dev-sentinel'

wrapConsoleMethod('log', (originalLog) => {
  return (...args) => {
    originalLog('[PREFIX]', ...args)
  }
})
```

---

### `restoreConsole()`

Kembalikan semua console method ke bentuk awal:

```ts
import { restoreConsole } from '@codeparcel/dev-sentinel'

restoreConsole()
```

---

### `wrappedConsoles: Set<ConsoleMethod>`

Berisi daftar console method yang telah dimodifikasi:

```ts
import { wrappedConsoles } from '@codeparcel/dev-sentinel'

console.log([...wrappedConsoles])
```

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

### `runIfProd(fn: () => void)`

Jalankan fungsi hanya saat mode production:

```ts
import { runIfProd } from '@codeparcel/dev-sentinel'

runIfProd(() => {
  sendTrackingData()
})
```

---

### `devOnly<T>(value: T): T | undefined`

Kembalikan nilai hanya di development:

```ts
const mockData = devOnly(generateMock())
```

---

### `prodOnly<T>(value: T): T | undefined`

Kembalikan nilai hanya di production:

```ts
const realAPI = prodOnly(fetch('/api/real'))
```

---

### `getEnv(): string`

Ambil current environment string: `development`, `production`, `test`, atau lainnya.

```ts
const env = getEnv() // e.g. 'development'
```

### `isDevEnv(): boolean`

Cek apakah sekarang mode development:

```ts
if (isDevEnv()) {
  console.log('Dev mode active')
}
```

## 🧪 Lingkungan Terdeteksi

`dev-sentinel` otomatis mendeteksi mode `development` dengan:

* `import.meta.env.MODE === 'development'` (Vite / ESM / browser env)
* `process.env.NODE_ENV === 'development'` (Node.js / bundlers lain)

---

## 🔧 Contoh Lengkap

```ts
import {
  silenceConsole,
  getSilencedConsoleMethodsFromEnv,
  runIfDev,
  runIfProd,
  devOnly,
  prodOnly,
  getEnv,
  silenceSpecificConsoleLevel,
  wrapConsoleMethod,
  restoreConsole,
  wrappedConsoles
} from '@codeparcel/dev-sentinel'

// Matikan console.* sesuai setting dari env
silenceConsole(getSilencedConsoleMethodsFromEnv())

runIfDev(() => {
  console.debug('Only in dev')
})

runIfProd(() => {
  sendAnalytics()
})

const config = devOnly({ debug: true }) || prodOnly({ debug: false })

wrapConsoleMethod('log', (orig) => (...args) => orig('[DEV]', ...args))

console.log('ENV:', getEnv())
console.log([...wrappedConsoles])

restoreConsole()
```

---

## ❓ FAQ & Common Issues

### ❌ `'NODE_ENV' is not recognized as an internal or external command`

Gunakan [`cross-env`](https://www.npmjs.com/package/cross-env) agar environment variable bekerja di semua OS (Windows/Linux/macOS).

```bash
npm install --save-dev cross-env
```

```json
"scripts": {
  "example": "cross-env NODE_ENV=development tsx examples/index.ts"
}
```

---

### ❌ `'tsx' is not recognized as an internal or external command`

Install [`tsx`](https://www.npmjs.com/package/tsx) secara lokal agar dapat menjalankan file `.ts` langsung.

```bash
npm install --save-dev tsx
```

```bash
npx tsx examples/index.ts
```

---

### ⚙️ Tips Tambahan

* Gunakan fallback mode check:

```ts
const isDev = process.env.NODE_ENV === 'development' || import.meta?.env?.MODE === 'development'
```

* Tambahkan fallback ketika NODE\_ENV tidak tersedia:

```ts
if (!process.env.NODE_ENV) {
  console.warn('⚠️ NODE_ENV is not set. Defaulting to production mode.')
}
```

---

## 🧠 Dibuat oleh

<img src="https://avatars.githubusercontent.com/u/217093625?s=400&u=58f87fd3009e11d1f98b7eda61547cee101109ee&v=4" alt="CodeParcel Logo" width="120" />

[CodeParcel](https://github.com/codeparcel) — untuk dev yang suka rapi, clean, dan tangguh.

## 📄 Lisensi

[MIT](./LICENSE)
