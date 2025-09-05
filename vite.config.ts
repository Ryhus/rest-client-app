import { defineConfig } from 'vitest/config';
import { reactRouter } from '@react-router/dev/vite';
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [!process.env.VITEST && reactRouter()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/root.tsx',
        'src/routes.ts',
        'src/setupTests.{js,ts}',
        'src/**/*.d.ts',
        'src/**/types.ts',
        'src/**/index.ts',
        'src/layouts/*',
        'src/entry.client.tsx',
        'src/utils/navLinksConfig.ts',
      ],
      thresholds: {
        statements: 1,
        branches: 1,
        functions: 1,
        lines: 1,
      },
    },
  },
});
