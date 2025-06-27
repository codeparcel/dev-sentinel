import chalk from 'chalk'
import logSymbols from 'log-symbols'

const isDev =
  process.env.NODE_ENV === 'development' ||
  import.meta?.env?.MODE === 'development'

const run = async () => {
  const module = isDev
    ? await import('../src/index.ts')
    : await import('../dist/index.js') as typeof import('../src/index.ts')

  const {
    silenceConsole,
    runIfDev,
    runIfProd,
    silenceSpecificConsoleLevel,
    restoreConsole,
    wrapConsoleMethod,
    wrappedConsoles,
    devOnly,
    prodOnly,
    getEnv,
    isDevEnv,
    isTestEnv,
    getSilencedConsoleMethodsFromEnv,
    redirectConsoleToFile,
    envSwitch
  } = module

  const log = console.log
  const info = (...args: any[]) => log(chalk.blue(`${logSymbols.info}`), ...args)
  const success = (...args: any[]) => log(chalk.green(`${logSymbols.success}`), ...args)
  const warn = (...args: any[]) => console.warn(chalk.yellow(`${logSymbols.warning}`), ...args)
  const error = (...args: any[]) => console.error(chalk.red(`${logSymbols.error}`), ...args)
  const divider = () => log(chalk.gray('\n' + '-'.repeat(50)))

  console.clear()
  info('Dev Sentinel Console Behavior Demo Started')
  divider()

  success('BEFORE silenceConsole')
  log('Log ini muncul')
  warn('Warning ini juga muncul')
  error('Error tetap muncul')

  silenceConsole(['log', 'warn'])

  divider()
  warn('AFTER silenceConsole(["log", "warn"])')
  log('Ini tidak akan muncul')
  warn('Ini juga tidak akan muncul')
  error('Error tetap muncul')

  restoreConsole()
  divider()
  success('AFTER restoreConsole()')
  log('Log muncul lagi')
  warn('Warning muncul lagi')

  silenceSpecificConsoleLevel('warn')
  divider()
  success('AFTER silenceSpecificConsoleLevel("warn")')
  log('Log muncul')
  warn('Warning ini tidak muncul')
  error('Error tetap muncul')

  restoreConsole()
  divider()
  success('AFTER wrapConsoleMethod("log")')
  wrapConsoleMethod('log', (originalLog) => (...args) => {
    originalLog(chalk.magentaBright('[WRAPPED LOG]:'), ...args)
  })
  log('Ini harusnya ada prefix')

  restoreConsole()
  divider()

  runIfDev(() => {
    info('runIfDev() triggered')
  })

  runIfProd(() => {
    info('runIfProd() triggered')
  })

  divider()
  success('devOnly / prodOnly TEST')
  log('devOnly:', devOnly('Hanya muncul di development'))
  log('prodOnly:', prodOnly('Hanya muncul di production'))

  divider()
  success('ENV HELPERS')
  log('getEnv():', getEnv())
  log('isDevEnv():', isDevEnv())
  log('isTestEnv():', isTestEnv())

  divider()
  success('getSilencedConsoleMethodsFromEnv()')
  process.env.DEV_SENTINEL_LOG = 'false'
  process.env.DEV_SENTINEL_WARN = 'true'
  const silenced = getSilencedConsoleMethodsFromEnv()
  log('Silenced Methods:', silenced)

  divider()
  success('redirectConsoleToFile() [ONLY on non-dev]')
  await redirectConsoleToFile('./logs.txt')
  log('Log ini akan ditulis ke file jika di production')
  warn('Warning ini juga ke file')
  error('Error tetap ke stdout')

  restoreConsole()
  divider()
  success('envSwitch() TEST')
  const config = envSwitch({
    development: 'Ini config untuk dev',
    production: 'Ini config untuk prod',
    test: 'Ini config untuk test'
  }, 'Fallback config')
  log('envSwitch():', config)

  divider()
  success('ENV FLAGS')
  log('NODE_ENV:', process.env.NODE_ENV)
  log('DEV_SENTINEL_LOG:', process.env.DEV_SENTINEL_LOG)
  log('DEV_SENTINEL_WARN:', process.env.DEV_SENTINEL_WARN)

  divider()
  success('Wrapped Consoles Info')
  console.dir(wrappedConsoles ?? 'Tidak tersedia')

  divider()
  success('ENV MODE DETECTED')
  const env = typeof import.meta?.env !== 'undefined' ? import.meta.env : { MODE: process.env.NODE_ENV || 'production' }
  log(env.MODE)

  divider()
  success('Dev Sentinel Demo Selesai')
}

run().catch(console.error)
