import { validateEnv } from './utils/validateEnv'

validateEnv()

type ConsoleMethod = 'log' | 'info' | 'debug' | 'warn'

const allowedMethods: ConsoleMethod[] = ['log', 'info', 'debug', 'warn']

// Backup console methods untuk restore
const originalConsole: Partial<Record<ConsoleMethod, (...args: any[]) => void>> = {}
export const wrappedConsoles: Set<ConsoleMethod> = new Set()

/**
 * @name getEnv
 * @description Menentukan mode environment saat ini ('development' | 'production' | 'test')
 * @returns {string} - Nilai dari process.env.NODE_ENV atau import.meta.env.MODE atau 'production' sebagai default
 * @example
 * getEnv() // 'development'
 * Note: `import.meta.env.MODE` hanya terpakai di bundler ESM seperti Vite. Tidak bisa dites di Node.js.
 */
export function getEnv(): 'development' | 'production' | 'test' | string {
  if (process.env.NODE_ENV) return process.env.NODE_ENV
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE) return import.meta.env.MODE
  return 'production'
}

/**
 * @name isDevEnv
 * @description Mengecek apakah mode environment adalah development
 * @returns {boolean}
 * @example
 * if (isDevEnv()) console.log('Development mode')
 */
export function isDevEnv(): boolean {
  return getEnv() === 'development'
}

/**
 * @name getSilencedConsoleMethodsFromEnv
 * @description Mengambil daftar metode console yang perlu disilent berdasarkan variabel lingkungan (ENV)
 * @param {ConsoleMethod[]} defaults - Fallback methods jika tidak ada yang diatur ENV
 * @returns {ConsoleMethod[]}
 * @example
 * process.env.DEV_SENTINEL_LOG = 'false'
 * getSilencedConsoleMethodsFromEnv() // ['log']
 */
export function getSilencedConsoleMethodsFromEnv(defaults: ConsoleMethod[] = allowedMethods): ConsoleMethod[] {
  const selected = allowedMethods.filter((method) => {
    const envVar = process.env[`DEV_SENTINEL_${method.toUpperCase()}`]
    return envVar?.toLowerCase() !== 'true'
  })
  return selected.length > 0 ? selected : defaults
}

/**
 * @name silenceConsole
 * @description Menonaktifkan output console tertentu di environment non-development
 * @param {ConsoleMethod[]} methods - Daftar method console yang ingin disilent
 * @example
 * silenceConsole(['log', 'warn'])
 */
export function silenceConsole(methods: ConsoleMethod[] = allowedMethods) {
  if (!isDevEnv()) {
    methods.forEach((method) => {
      if (!originalConsole[method]) {
        originalConsole[method] = console[method]
      }
      console[method] = () => {}
      wrappedConsoles.add(method)
    })
  }
}

/**
 * @name silenceSpecificConsoleLevel
 * @description Menonaktifkan satu level method console (misal hanya 'warn')
 * @param {ConsoleMethod} method - Method console yang akan disilent
 * @example
 * silenceSpecificConsoleLevel('warn')
 */
export function silenceSpecificConsoleLevel(method: ConsoleMethod) {
  if (!originalConsole[method]) {
    originalConsole[method] = console[method]
  }
  console[method] = () => {}
  wrappedConsoles.add(method)
}

/**
 * @name restoreConsole
 * @description Mengembalikan semua method console yang telah diubah ke kondisi semula
 * @example
 * restoreConsole()
 */
export function restoreConsole() {
  wrappedConsoles.forEach((method) => {
    if (originalConsole[method]) {
      console[method] = originalConsole[method]!
    }
  })
  wrappedConsoles.clear()
}

/**
 * @name wrapConsoleMethod
 * @description Membungkus console method dengan fungsi custom
 * @param {ConsoleMethod} method - Method console yang ingin di-wrap
 * @param {(original: Function) => Function} wrapper - Fungsi pembungkus custom
 * @example
 * wrapConsoleMethod('log', (orig) => (...args) => orig('[LOG]', ...args))
 */
export function wrapConsoleMethod(
  method: ConsoleMethod,
  wrapper: (original: (...args: any[]) => void) => (...args: any[]) => void
) {
  if (!originalConsole[method]) {
    originalConsole[method] = console[method]
  }
  console[method] = wrapper(console[method])
  wrappedConsoles.add(method)
}

/**
 * @name runIfDev
 * @description Menjalankan fungsi hanya saat di environment development
 * @param {() => void} fn - Fungsi yang akan dijalankan
 * @example
 * runIfDev(() => console.log('Dev only'))
 */
export function runIfDev(fn: () => void) {
  if (isDevEnv()) fn()
}

/**
 * @name runIfProd
 * @description Menjalankan fungsi hanya saat bukan di environment development (biasanya production)
 * @param {() => void} fn - Fungsi yang akan dijalankan
 * @example
 * runIfProd(() => console.log('Prod only'))
 */
export function runIfProd(fn: () => void) {
  if (!isDevEnv()) fn()
}

/**
 * @name devOnly
 * @description Mengembalikan nilai hanya jika di development mode, jika tidak akan `undefined`
 * @param {T} value - Nilai yang dikondisikan
 * @returns {T | undefined}
 * @example
 * const debugTools = devOnly(['logger'])
 */
export function devOnly<T>(value: T): T | undefined {
  return isDevEnv() ? value : undefined
}

/**
 * @name prodOnly
 * @description Mengembalikan nilai hanya jika di production mode, jika tidak akan `undefined`
 * @param {T} value - Nilai yang dikondisikan
 * @returns {T | undefined}
 * @example
 * const prodConfig = prodOnly(config)
 */
export function prodOnly<T>(value: T): T | undefined {
  return !isDevEnv() ? value : undefined
}

export async function redirectConsoleToFile(filePath: string, methods: ConsoleMethod[] = allowedMethods) {
  if (!isDevEnv()) {
    const fs = await import('fs')
    const stream = fs.createWriteStream(filePath, { flags: 'a' })
    methods.forEach(method => {
      if (!originalConsole[method]) {
        originalConsole[method] = console[method]
      }
      console[method] = (...args: any[]) => {
        stream.write(`[${method.toUpperCase()}] ${args.join(' ')}\n`)
      }
    })
  }
}


export function isTestEnv(): boolean {
  return getEnv() === 'test'
}

export function envSwitch<T>(cases: Partial<Record<'development' | 'production' | 'test' | string, T>>, fallback?: T): T | undefined {
  return cases[getEnv()] ?? fallback
}
