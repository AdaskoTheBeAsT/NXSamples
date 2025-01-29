const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.plugins.push(
    new CompressionPlugin({
      algorithm: 'gzip',
      threshold: 1024,
      compressionOptions: { level: 9 },
    }),
  );
  config.plugins.push(
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      threshold: 1024,
      compressionOptions: { level: 11 },
    }),
  );
  // Define multiple entry points
  config.entry = {
    'env-config': path.resolve(__dirname, 'src/config.ts'), // Separate entry for config
    main: path.resolve(__dirname, 'src/main.tsx'), // Main application entry
  };

  return config;
});
