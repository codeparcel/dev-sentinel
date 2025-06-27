## [1.1.15] - 2025-06-28

### Added
- Runtime environment validation via `validateEnv()` to ensure `import.meta.env.MODE` is one of `'development'`, `'production'`, or `'test'`
- Auto-validation triggered when importing core module

### Fixed
- Removed conflicting TypeScript override of `ImportMetaEnv.MODE` to fix Vite compatibility (`TS2430`, `TS2687`)
- Prevented build failure caused by mismatched `MODE` type declaration between user types and Vite's native types

---

## [1.1.13] - 2025-06-28

### Added
- Runtime `validateEnv()` to ensure `import.meta.env.MODE` is one of `'development'`, `'production'`, or `'test'`
- Auto validation triggered at the top of `core.ts`

### Fixed
- Removed conflicting TypeScript declaration of `MODE` in `ImportMetaEnv` to ensure compatibility with Vite's typings

- Remove MODE override and add runtime validation for Vite env compatibility

- Deleted TYPE override of `ImportMetaEnv.MODE` to fix Vite compatibility issue (TS2430/TS2687)
- Introduced `validateEnv()` to check runtime `MODE` validity
- Auto-trigger `validateEnv()` at package load

Thanks
