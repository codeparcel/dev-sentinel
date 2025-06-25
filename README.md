# @codeparcel/dev-sentinel

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
