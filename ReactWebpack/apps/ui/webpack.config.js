const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('node:path');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('node:zlib');
const sharp = require('sharp'); // Import sharp for image processing

// env-config*.js is rewritten by env.sh at container startup, so it must stay uncompressed.
const skipRuntimeConfig = /env-config(.*)\.js$/;

// Zstandard through Node's zlib (Node.js 22.15+ / 24+), no zstd CLI required.
const zstdPlugins =
  typeof zlib.zstdCompress === 'function'
    ? [
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
          deleteOriginalAssets: false,
          exclude: skipRuntimeConfig,
          test: /\.(js|css|html|svg|ttf)$/,
          threshold: 1024,
          minRatio: 0.8,
          compressionOptions: {
            level: 19, // Zstandard compression level (1-22)
          },
        }),
      ]
    : [];

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/ui'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: [],
      scripts: [
        {
          input: 'apps/ui/src/config.js',
          bundleName: 'env-config',
          inject: true,
        },
      ],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      deleteOriginalAssets: false,
      exclude: skipRuntimeConfig,
      test: /\.(js|css|html|svg|ttf)$/,
      threshold: 1024,
      minRatio: 0.8,
      compressionOptions: {
        level: 9,
      },
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      deleteOriginalAssets: false,
      exclude: skipRuntimeConfig,
      test: /\.(js|css|html|svg|ttf)$/,
      threshold: 1024,
      minRatio: 0.8,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
    }),
    ...zstdPlugins,
    // AVIF Image Compression
    new CompressionPlugin({
      //'[path][name].avif',
      filename: '[path][name].avif',
      algorithm(input, options, callback) {
        sharp(input)
          .avif({ quality: 50 }) // Adjust quality as needed (0-100)
          .toBuffer((err, outputBuffer) => {
            if (err) {
              return callback(err);
            }
            callback(null, outputBuffer);
          });
      },
      deleteOriginalAssets: false,
      test: /\.[^.]+\.(png|jpg|jpeg)$/, // Apply only to image files
      threshold: 1024,
      minRatio: 0.8,
    }),
    // WebP Image Compression
    new CompressionPlugin({
      //'[path][name].webp',
      filename: '[path][name].webp',
      algorithm(input, options, callback) {
        sharp(input)
          .webp({ quality: 75 }) // Adjust quality as needed (0-100)
          .toBuffer((err, outputBuffer) => {
            if (err) {
              return callback(err);
            }
            callback(null, outputBuffer);
          });
      },
      deleteOriginalAssets: false,
      test: /\.[^.]+\.(png|jpg|jpeg)$/, // Apply only to image files
      threshold: 1024,
      minRatio: 0.8,
    }),
  ],
};
