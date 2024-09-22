const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('path');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  // config.optimization = {
  //   ...config.optimization,
  //   splitChunks: {
  //     // Define cache groups for manual chunking
  //     cacheGroups: {
  //       // Create a separate chunk for config.ts
  //       config: {
  //         // Match the path to config.ts
  //         test: /[\\/]src[\\/]config\.ts$/,
  //         name: 'config',
  //         chunks: 'all',
  //         enforce: true,
  //       },
  //       // Optionally, you can define other cache groups here
  //       // For example, vendor libraries
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //         priority: -10,
  //       },
  //     },
  //   },
  // };

  // // Optionally, set the output filename pattern
  // config.output = {
  //   ...config.output,
  //   filename: '[name].[contenthash].js',
  //   chunkFilename: '[name].[contenthash].js',
  // };

  // Define multiple entry points
  config.entry = {
    config: path.resolve(__dirname, 'src/config.ts'), // Separate entry for config
    main: path.resolve(__dirname, 'src/main.tsx'), // Main application entry
  };

  // Adjust output filenames to include entry point names
  config.output = {
    ...config.output,
    filename: '[name].[contenthash].js', // e.g., config.abc123.js, main.def456.js
    chunkFilename: '[name].[contenthash].js', // For any additional chunks
    path: path.resolve(__dirname, '../../dist/apps/ui'), // Adjust if necessary
    publicPath: '/', // Base path for all assets
  };

  // Find the existing HtmlRspackPlugin instance
  const htmlPlugin = config.plugins.find(
    (plugin) => plugin.name === 'HtmlRspackPlugin'
  );

  if (htmlPlugin) {
    // Modify the plugin to include both 'config' and 'main' chunks
    htmlPlugin.options = htmlPlugin.options || {};
    htmlPlugin.options.chunks = ['config', 'main'];

    // Define a custom chunksSortMode to ensure 'config' is loaded before 'main'
    htmlPlugin.options.chunksSortMode = (chunk1, chunk2) => {
      const order = ['config', 'main'];

      const chunk1Name = chunk1.names && chunk1.names[0] ? chunk1.names[0] : '';
      const chunk2Name = chunk2.names && chunk2.names[0] ? chunk2.names[0] : '';

      const chunk1Index = order.indexOf(chunk1Name);
      const chunk2Index = order.indexOf(chunk2Name);

      if (chunk1Index === -1 && chunk2Index === -1) {
        return 0;
      }
      if (chunk1Index === -1) {
        return 1;
      }
      if (chunk2Index === -1) {
        return -1;
      }

      return chunk1Index - chunk2Index;
    };
  }

  // Optional: Log the number of HtmlRspackPlugin instances for debugging
  const htmlPluginCount = config.plugins.filter(
    (plugin) => plugin.name === 'HtmlRspackPlugin'
  ).length;
  console.log(`HtmlRspackPlugin instances: ${htmlPluginCount}`);

  return config;
});
