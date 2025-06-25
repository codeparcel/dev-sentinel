type ConsoleMethod = keyof Console

function isDevEnv() {
  return process.env.NODE_ENV === 'development'
}

export function silenceConsole(methods: ConsoleMethod[] = ['log', 'info', 'debug', 'warn']) {
  if (!isDevEnv()) {
    methods.forEach((method) => {
      ;(console as any)[method] = () => {}
    })
  }
}

export function runIfDev(fn: () => void) {
  if (isDevEnv()) fn()
}
