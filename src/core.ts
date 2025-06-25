type ConsoleMethod = 'log' | 'info' | 'debug' | 'warn'

const allowedMethods: ConsoleMethod[] = ['log', 'info', 'debug', 'warn']

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
export function silenceConsole(methods: ConsoleMethod[] = ['log', 'info', 'debug', 'warn']) {
  if (!isDevEnv()) {
    methods.forEach((method) => {
      (console as any)[method] = () => {}
    })
  }
}

/**
 * Run function only in development mode
 *
 * @param fn - Function to run
 */
export function runIfDev(fn: () => void) {
  if (isDevEnv()) fn()
}

/**
 * Run function only in production mode
 *
 * @param fn - Function to run
 */
export function runIfProd(fn: () => void) {
  if (!isDevEnv()) fn()
}

/**
 * Wrapper to conditionally return a value only in development mode
 *
 * @param value - Any value you want to return only in dev
 * @returns The value or undefined
 */
export function devOnly<T>(value: T): T | undefined {
  return isDevEnv() ? value : undefined
}

/**
 * Wrapper to conditionally return a value only in production mode
 *
 * @param value - Any value you want to return only in production
 * @returns The value or undefined
 */
export function prodOnly<T>(value: T): T | undefined {
  return !isDevEnv() ? value : undefined
}
