type ValidMode = 'development' | 'production' | 'test'

function isValidMode(mode: string): mode is ValidMode {
  return ['development', 'production', 'test'].includes(mode)
}

export function validateEnv(): ValidMode | void {
  const isTesting = process.env.NODE_ENV === 'test'
  if (isTesting) return

  const mode =
    typeof import.meta !== 'undefined' && import.meta.env?.MODE
      ? import.meta.env.MODE
      : process.env.NODE_ENV || 'production'

  if (!isValidMode(mode)) {
    throw new Error(
      `[dev-sentinel] Invalid MODE: "${mode}". Expected one of: development, production, test`
    )
  }

  return mode
}
