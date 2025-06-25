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
* 🧠 Wrapper devOnly/prodOnly yang fleksibel
* 📆 Ringan, tanpa dependencies
* 💡 Cocok untuk project berbasis TypeScript / Vite / Node / Frontend frameworks

## 📆 Instalasi

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

Kebalikan dari `runIfDev`, ini jalan hanya saat **production**:

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

## 🧲 Lingkungan Terdeteksi

`dev-sentinel` otomatis mendeteksi mode `development` dengan:

* `import.meta.env.MODE === 'development'` (Vite / ESM / browser env)
* `process.env.NODE_ENV === 'development'` (Node.js / bundlers lain)

---

## 🔧 Contoh Lengkap

```ts
import {
  silenceConsole,
  runIfDev,
  runIfProd,
  devOnly,
  prodOnly,
  getEnv
} from '@codeparcel/dev-sentinel'

// Matikan console.* saat production
silenceConsole()

runIfDev(() => {
  console.debug('Only in dev')
})

runIfProd(() => {
  sendAnalytics()
})

const config = devOnly({ debug: true }) || prodOnly({ debug: false })

console.log('Current ENV:', getEnv())
```

---

## ❓ FAQ & Common Issues

### ❌ `'NODE_ENV' is not recognized as an internal or external command`

**Masalah**:
Command `NODE_ENV=development` tidak bisa jalan di Windows (karena sintaks ini hanya untuk macOS/Linux).

**Solusi**:
Gunakan [`cross-env`](https://www.npmjs.com/package/cross-env) agar skrip bisa dijalankan di semua platform.

✅ Install:

```bash
npm install --save-dev cross-env
```

✅ Contoh script di `package.json`:

```json
"scripts": {
  "example": "cross-env NODE_ENV=development tsx examples/index.ts"
}
```

---

### ❌ `'tsx' is not recognized as an internal or external command`

**Masalah**:
Perintah `tsx` tidak ditemukan karena belum terinstall.

**Solusi**:
Install [`tsx`](https://www.npmjs.com/package/tsx), runtime cepat untuk menjalankan file `.ts` tanpa build manual.

✅ Install:

```bash
npm install --save-dev tsx
```

✅ Contoh penggunaan:

```bash
npx tsx examples/index.ts
```

---

### 🧲 Tips Tambahan (untuk Windows dan lintas platform)

* Gunakan `cross-env` untuk setting environment variable.

* Gunakan `tsx` untuk menjalankan file TypeScript langsung dari CLI.

* Untuk pengecekan mode, pastikan gunakan fallback seperti:

  ```ts
  const isDev =
    process.env.NODE_ENV === 'development' ||
    import.meta?.env?.MODE === 'development'
  ```

* Tambahkan pengecekan manual jika diperlukan:

  ```ts
  if (!process.env.NODE_ENV) {
    console.warn('⚠️ NODE_ENV is not set. Defaulting to production mode.')
  }
  ```

---

## 🗾️ Dibuat oleh

🧠 [CodeParcel](https://github.com/codeparcel) — untuk dev yang suka rapi, clean, dan tangguh.

## 📄 Lisensi

[MIT](./LICENSE)
