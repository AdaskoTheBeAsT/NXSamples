/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { ManualChunksOption, GetManualChunk } from 'rollup';

const manualChunks: GetManualChunk = (id, meta) => {
  if (id.includes('config.ts')) {
    return 'config';
  }
};

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/ui',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/ui',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: manualChunks as ManualChunksOption,
      },
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: [
      'default',
      ['junit', { outputFile: '../../.reports/apps/ui/junit-report.xml' }],
      [
        'vitest-sonar-reporter',
        { outputFile: '../../.reports/apps/ui/sonar-report.xml' },
      ],
    ],
    coverage: {
      reportsDirectory: '../../.reports/apps/ui/coverage',
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
