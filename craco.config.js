const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  style: {
    sass: {
      loaderOptions: {
        implementation: require('sass'),
        sassOptions: {
          fiber: false,
        },
        additionalData: `
          @use "sass:math";
          @use "sass:color";
        `,
      },
    },
  },
};
