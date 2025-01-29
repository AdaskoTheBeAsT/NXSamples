const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('path');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Define multiple entry points
  config.entry = {
    config: path.resolve(__dirname, 'src/config.ts'), // Separate entry for config
    main: path.resolve(__dirname, 'src/main.tsx'), // Main application entry
  };

  return config;
});
