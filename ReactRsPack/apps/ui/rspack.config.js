const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('path');
const zlib = require('node:zlib');
const CompressionPlugin = require('compression-webpack-plugin');

const skipRuntimeConfig = /env-config(.*)\.js$/;

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.plugins.push(
    new CompressionPlugin({
      algorithm: 'gzip',
      exclude: skipRuntimeConfig,
      threshold: 1024,
      compressionOptions: { level: 9 },
    }),
  );
  config.plugins.push(
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      exclude: skipRuntimeConfig,
      threshold: 1024,
      compressionOptions: {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
      },
    }),
  );
  if (typeof zlib.zstdCompress === 'function') {
    config.plugins.push(
      new CompressionPlugin({
        filename: '[path][base].zst',
        algorithm(input, options, callback) {
          zlib.zstdCompress(
            input,
            {
              params: {
                [zlib.constants.ZSTD_c_compressionLevel]: options.level ?? 19,
              },
            },
            callback,
          );
        },
        exclude: skipRuntimeConfig,
        threshold: 1024,
        compressionOptions: { level: 19 },
      }),
    );
  }
  // Define multiple entry points
  config.entry = {
    'env-config': path.resolve(__dirname, 'src/config.ts'), // Separate entry for config
    main: path.resolve(__dirname, 'src/main.tsx'), // Main application entry
  };

  return config;
});
