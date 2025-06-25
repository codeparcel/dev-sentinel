interface ImportMetaEnv {
  readonly MODE: 'development' | 'production' | 'test'
  // tambahkan var lainnya jika perlu
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
