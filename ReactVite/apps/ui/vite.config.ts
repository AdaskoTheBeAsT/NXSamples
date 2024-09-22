/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { ManualChunksOption, GetManualChunk } from 'rollup';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

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

  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

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
});
