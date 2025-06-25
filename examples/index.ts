const isDev =
  process.env.NODE_ENV === 'development' ||
  import.meta?.env?.MODE === 'development'

// Dynamic import: ambil dari `src` kalau dev, `dist` kalau production
const run = async () => {
  const {
    silenceConsole,
    runIfDev,
    silenceSpecificConsoleLevel,
    restoreConsole,
    wrapConsoleMethod,
    wrappedConsoles,
  } = isDev
    ? await import('../src/index.ts')
    : await import('../dist/index.js')

  console.log('\n===== BEFORE silenceConsole =====')
  console.log('Log ini muncul')
  console.warn('Warning ini juga muncul')
  console.error('Error tetap muncul')

  silenceConsole(['log', 'warn']) // nonaktifin log & warn

  console.log('\n===== AFTER silenceConsole(["log", "warn"]) =====')
  console.log('Ini tidak akan muncul')
  console.warn('Ini juga tidak akan muncul')
  console.error('Error tetap muncul')

  // restore console (jika fungsi disediakan)
  restoreConsole?.()
  console.log('\n===== AFTER restoreConsole() =====')
  console.log('Log muncul lagi')
  console.warn('Warning muncul lagi')

  // silence hanya warning
  silenceSpecificConsoleLevel?.('warn')
  console.log('\n===== AFTER silenceSpecificConsoleLevel("warn") =====')
  console.log('Log muncul')
  console.warn('Warning ini tidak muncul')
  console.error('Error tetap muncul')

  restoreConsole?.()

  // Test wrapConsoleMethod (misal prefix)
  wrapConsoleMethod?.('log', (originalLog) => {
    return (...args: any[]) => {
      originalLog('[WRAPPED LOG]:', ...args)
    }
  })

  console.log('\n===== AFTER wrapConsoleMethod for "log" =====')
  console.log('Ini harusnya ada prefix')

  restoreConsole?.()

  // Coba runIfDev
  runIfDev?.(() => {
    console.info('\n===== runIfDev() triggered =====')
    console.info('Ini hanya muncul di development')
  })

  // Optional: lihat isi wrappedConsoles
  console.log('\n===== Wrapped Consoles Info =====')
  console.dir(wrappedConsoles ?? 'Tidak tersedia')

  console.log('\n===== DONE =====')
}

run().catch(console.error)
