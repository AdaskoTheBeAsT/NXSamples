/// <reference types='vitest/config' />
import { defineConfig } from 'vite';
import type { ManualChunks } from './types/vite-chunking';
import vue from '@vitejs/plugin-vue';
import { compression, defineAlgorithm } from 'vite-plugin-compression2';
import zlib from 'node:zlib';
//import { viteStaticCopy } from 'vite-plugin-static-copy';

const manualChunks: ManualChunks = (id: string) => {
  if (id.includes('config.ts')) {
    return 'env-config';
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

  plugins: [
    vue(),
    // viteStaticCopy({
    //   targets: [{ src: '*.md', dest: '.' }],
    // }),
    compression({
      threshold: 1025,
      exclude: [/env-config.*\.js$/],
      algorithms: [
        defineAlgorithm('gzip', { level: 9 }),
        defineAlgorithm('brotliCompress', {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        }),
        defineAlgorithm('zstd', {
          params: {
            [zlib.constants.ZSTD_c_compressionLevel]: 19,
          },
        }),
      ],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },

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
    rolldownOptions: {
      output: {
        manualChunks,
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
      include: ['src/**/*.{ts,tsx,js,jsx,vue}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    },
  },
});
