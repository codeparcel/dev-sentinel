# 🚀 Publish Report — @codeparcel/dev-sentinel

## 🧾 Versi
Versi saat ini: `v1.1.0` _(atau tulis versi terbaru kalau ada update)_

## 🗂 Perubahan

### 🟢 Minor / Internal
- [x] Refactor kecil di file `core.ts`
- [x] Tambah dokumentasi penggunaan `restoreConsole()`
- [x] Perbaikan compatibility di Windows (rimraf)
- [x] Tambah fallback `import.meta?.env?.MODE` di contoh usage
- [x] Tambah `README.md` dengan badge & showcase yang lebih lengkap

### 🟡 Perubahan Publik
- [ ] Penambahan fungsi baru: `silenceSpecificConsoleLevel`
- [ ] API `wrapConsoleMethod` sekarang support return `void` handler

### 🔴 Breaking Change _(jika ada)_
- [ ] (tidak ada)

## 📦 Rencana Publish

- [ ] `git add . && git commit -m "docs: update readme, minor refactor"`
- [ ] `npm version patch` _(atau `minor`/`major` sesuai perubahan)_
- [ ] `npm publish --access public`
- [ ] `git push && git push --tags`

---

## 🧠 Catatan
> Tips: Jika hanya update dokumentasi atau internal code:
> Gunakan `npm version patch` atau skip update versi dan hanya commit biasa.

