type ConsoleMethod = 'log' | 'info' | 'debug' | 'warn'

const allowedMethods: ConsoleMethod[] = ['log', 'info', 'debug', 'warn']

// Backup console methods untuk restore
const originalConsole: Partial<Record<ConsoleMethod, (...args: any[]) => void>> = {}
export const wrappedConsoles: Set<ConsoleMethod> = new Set()

/**
 * Determine current environment mode
 * Supports both Node.js and modern ESM environments
 */
export function getEnv(): 'development' | 'production' | 'test' | string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE) {
    return import.meta.env.MODE
  }
  return process.env.NODE_ENV || 'production'
}

/**
 * Returns true if current environment is development
 */
export function isDevEnv(): boolean {
  return getEnv() === 'development'
}

/**
 * Generate array of console methods to silence, based on env flags
 * e.g. DEV_SENTINEL_LOG=false -> will be silenced
 */
export function getSilencedConsoleMethodsFromEnv(defaults: ConsoleMethod[] = allowedMethods): ConsoleMethod[] {
  const selected = allowedMethods.filter((method) => {
    const envVar = process.env[`DEV_SENTINEL_${method.toUpperCase()}`]
    return envVar?.toLowerCase() !== 'true'
  })

  return selected.length > 0 ? selected : defaults
}

/**
 * Silence specific console methods in non-development environments
 *
 * @param methods - Array of console method names to silence (e.g. log, info, warn)
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
 * Silence a specific console level (e.g. only 'warn')
 */
export function silenceSpecificConsoleLevel(method: ConsoleMethod) {
  if (!originalConsole[method]) {
    originalConsole[method] = console[method]
  }
  console[method] = () => {}
  wrappedConsoles.add(method)
}

/**
 * Restore any previously silenced or wrapped console methods
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
 * Wrap a console method with custom behavior
 *
 * @param method - Console method to wrap (e.g. 'log')
 * @param wrapper - Function that receives original console method and returns a new one
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
 * Run function only in development mode
 */
export function runIfDev(fn: () => void) {
  if (isDevEnv()) fn()
}

/**
 * Run function only in production mode
 */
export function runIfProd(fn: () => void) {
  if (!isDevEnv()) fn()
}

/**
 * Wrapper to conditionally return a value only in development mode
 */
export function devOnly<T>(value: T): T | undefined {
  return isDevEnv() ? value : undefined
}

/**
 * Wrapper to conditionally return a value only in production mode
 */
export function prodOnly<T>(value: T): T | undefined {
  return !isDevEnv() ? value : undefined
}
