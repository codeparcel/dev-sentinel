const isDev =
  process.env.NODE_ENV === 'development' ||
  import.meta?.env?.MODE === 'development'

// Dynamic import: ambil dari `src` kalau dev, `dist` kalau production
const run = async () => {
  const module = isDev
    ? await import('../src/index.ts')
    : await import('../dist/index.js') as typeof import('../src/index.ts')

  const {
    
    silenceConsole,
    runIfDev,
    silenceSpecificConsoleLevel,
    restoreConsole,
    wrapConsoleMethod,
    wrappedConsoles,
    devOnly,
    prodOnly
  } = module

  console.log('\n===== BEFORE silenceConsole =====')
  console.log('Log ini muncul')
  console.warn('Warning ini juga muncul')
  console.error('Error tetap muncul')

  silenceConsole(['log', 'warn'])

  console.log('\n===== AFTER silenceConsole(["log", "warn"]) =====')
  console.log('Ini tidak akan muncul')
  console.warn('Ini juga tidak akan muncul')
  console.error('Error tetap muncul')

  restoreConsole?.()
  console.log('\n===== AFTER restoreConsole() =====')
  console.log('Log muncul lagi')
  console.warn('Warning muncul lagi')

  silenceSpecificConsoleLevel?.('warn')
  console.log('\n===== AFTER silenceSpecificConsoleLevel("warn") =====')
  console.log('Log muncul')
  console.warn('Warning ini tidak muncul')
  console.error('Error tetap muncul')

  restoreConsole?.()

  wrapConsoleMethod?.('log', (originalLog) => {
    return (...args: any[]) => {
      originalLog('[WRAPPED LOG]:', ...args)
    }
  })

  console.log('\n===== AFTER wrapConsoleMethod for "log" =====')
  console.log('Ini harusnya ada prefix')

  restoreConsole?.()

  runIfDev?.(() => {
    console.info('\n===== runIfDev() triggered =====')
    console.info('Ini hanya muncul di development')
  })

  console.log('\n===== devOnly / prodOnly TEST =====')
  console.log('devOnly:', devOnly?.('Hanya muncul di development'))
  console.log('prodOnly:', prodOnly?.('Hanya muncul di production'))

  console.log('\n===== ENV FLAGS =====')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('DEV_SENTINEL_LOG:', process.env.DEV_SENTINEL_LOG)
  console.log('DEV_SENTINEL_WARN:', process.env.DEV_SENTINEL_WARN)

  console.log('\n===== Wrapped Consoles Info =====')
  console.dir(wrappedConsoles ?? 'Tidak tersedia')

  const env = typeof import.meta?.env !== 'undefined' ? import.meta.env : { MODE: process.env.NODE_ENV || 'production' }
  console.log('\n===== ENV MODE DETECTED =====')
  console.log(env.MODE)

  console.log('\n===== DONE =====')
}

run().catch(console.error)
