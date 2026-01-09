import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      enabled: false, // --coverage フラグで有効化
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/public/**',
        'src/page/**', // React components (テストが追加されたら除外を解除)
        'src/background.ts', // Service Worker entry (integration test が必要)
        'src/injection/**', // Content scripts (integration test が必要)
      ],
    },
  },
})
