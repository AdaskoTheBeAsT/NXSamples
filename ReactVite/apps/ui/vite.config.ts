/// <reference types='vitest' />
import { defineConfig } from 'vite';
import type { ManualChunks } from './types/vite-chunking';
import react from '@vitejs/plugin-react';
import { compression, defineAlgorithm } from 'vite-plugin-compression2';
import zlib from 'node:zlib';
//import { viteStaticCopy } from 'vite-plugin-static-copy';

const manualChunks: ManualChunks = (id) => {
  if (id.includes('node_modules')) {
    return 'vendor';
  }
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
    react(),
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
    rolldownOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
