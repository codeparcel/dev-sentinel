import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
  
    coverage: {
      provider: 'v8', // atau 'c8' kalau kamu pakai c8
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/examples/**',
        '**/types/**',
        '**/vitest.config.ts'
      ],
    },
  },
})
