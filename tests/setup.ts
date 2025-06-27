import { restoreConsole } from '../src/core'

beforeEach(() => {
  process.env.NODE_ENV = 'test'
  restoreConsole() // bersihin semua side-effect antar test
})
