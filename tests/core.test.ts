import {
  getEnv,
  silenceConsole,
  silenceSpecificConsoleLevel,
  wrapConsoleMethod,
  restoreConsole,
  wrappedConsoles,
  getSilencedConsoleMethodsFromEnv,
  runIfDev,
  runIfProd,
  devOnly,
  prodOnly
} from '../src/core'
import { vi } from 'vitest'

describe('Dev Sentinel Core', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test'
    delete process.env.DEV_SENTINEL_LOG
    delete process.env.DEV_SENTINEL_WARN
    restoreConsole()
  })

  /**
   * @test getEnv() harus mengembalikan salah satu dari 'development' | 'production' | 'test'
   * @desc Menguji apakah nilai NODE_ENV dikembalikan dengan benar melalui getEnv()
   * @example getEnv() => 'production'
   */
  it('should return a valid env string', () => {
    process.env.NODE_ENV = 'production'
    const env = getEnv()
    expect(['development', 'production', 'test']).toContain(env)
  })

  /**
   * @test isDevEnv() harus mengembalikan true jika NODE_ENV = 'development'
   * @desc Memastikan deteksi env development bekerja sesuai harapan
   */
  it('should detect dev mode if NODE_ENV is development', async () => {
    const modulePath = '../src/core'
    await vi.resetModules()
    process.env.NODE_ENV = 'development'
    const imported = await import(modulePath)
    expect(imported.isDevEnv()).toBe(true)
  })

  /**
   * @test silenceConsole() harus membuat console.log tidak aktif di non-dev
   * @desc console.log seharusnya tidak mengeksekusi apapun ketika disilent
   */
  it('should silence and restore console.log', () => {
    const original = console.log
    let called = false
    console.log = () => { called = true }

    silenceConsole(['log'])
    console.log('should not call')
    expect(called).toBe(false)

    restoreConsole()
    console.log = original
    expect(typeof console.log).toBe('function')
  })

  /**
   * @test wrapConsoleMethod() harus mengganti perilaku console.log
   * @desc Memastikan fungsi console.log dibungkus dan bisa dimodifikasi
   */
  it('should wrap console.log with custom logic', () => {
    const mockFn = vi.fn()
    wrapConsoleMethod('log', (original) => (...args) => {
      mockFn()
      original(...args)
    })

    console.log('wrapped?')
    expect(mockFn).toHaveBeenCalled()

    restoreConsole()
  })

  /**
   * @test silenceSpecificConsoleLevel() harus menyenyapkan level console tertentu
   * @desc console.warn tidak boleh dijalankan setelah disenyapkan
   */
  it('should silence specific console method', () => {
    let called = false
    console.warn = () => { called = true }
    silenceSpecificConsoleLevel('warn')
    console.warn('This should not trigger')
    expect(called).toBe(false)
    restoreConsole()
  })

  /**
   * @test getSilencedConsoleMethodsFromEnv() mengembalikan daftar yang sesuai dengan ENV
   * @desc Berdasarkan DEV_SENTINEL_* di environment, tentukan method yang disilent
   */
  it('should return silenced methods from env config', () => {
    process.env.DEV_SENTINEL_LOG = 'false'
    process.env.DEV_SENTINEL_WARN = 'true'
    const silenced = getSilencedConsoleMethodsFromEnv()
    expect(silenced).toContain('log')
    expect(silenced).not.toContain('warn')
  })

  /**
   * @test getSilencedConsoleMethodsFromEnv() fallback ke default jika semua TRUE
   * @desc Jika semua DEV_SENTINEL_* diset true, maka harus fallback ke default
   */
  it('should return default if all console env are true', () => {
    process.env.DEV_SENTINEL_LOG = 'true'
    process.env.DEV_SENTINEL_WARN = 'true'
    process.env.DEV_SENTINEL_INFO = 'true'
    process.env.DEV_SENTINEL_DEBUG = 'true'
    const result = getSilencedConsoleMethodsFromEnv(['log', 'info'])
    expect(result).toEqual(['log', 'info']) // fallback ke default
  })

  /**
   * @test runIfDev() hanya berjalan saat env = development
   * @desc Fungsi hanya dieksekusi jika berada di mode development
   */
  it('runIfDev should only run in development', async () => {
    const modulePath = '../src/core'
    await vi.resetModules()
    process.env.NODE_ENV = 'development'
    const { runIfDev } = await import(modulePath)
    let flag = false
    runIfDev(() => { flag = true })
    expect(flag).toBe(true)
  })

  /**
   * @test runIfProd() hanya berjalan saat env = production
   * @desc Fungsi hanya dieksekusi jika berada di mode produksi
   */
  it('runIfProd should only run in production', async () => {
    const modulePath = '../src/core'
    await vi.resetModules()
    process.env.NODE_ENV = 'production'
    const { runIfProd } = await import(modulePath)
    let flag = false
    runIfProd(() => { flag = true })
    expect(flag).toBe(true)
  })

  /**
   * @test devOnly() harus mengembalikan nilai hanya di dev
   * @desc Return value hanya dikembalikan jika di mode development
   */
  it('devOnly should return value only in dev', async () => {
    const modulePath = '../src/core'
    await vi.resetModules()
    process.env.NODE_ENV = 'development'
    const { devOnly } = await import(modulePath)
    expect(devOnly('abc')).toBe('abc')
  })

  /**
   * @test prodOnly() harus mengembalikan nilai hanya di production
   * @desc Return value hanya dikembalikan jika di mode produksi
   */
  it('prodOnly should return value only in prod', async () => {
    const modulePath = '../src/core'
    await vi.resetModules()
    process.env.NODE_ENV = 'production'
    const { prodOnly } = await import(modulePath)
    expect(prodOnly('xyz')).toBe('xyz')
  })
})
