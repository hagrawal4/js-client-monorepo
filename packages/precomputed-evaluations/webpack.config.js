const { composePlugins, withNx, withWeb } = require('@nx/webpack');
const path = require('path');
const minifier = require('../../tools/scripts/webpack-minifier');

module.exports = composePlugins(withNx(), withWeb(), () =>
  // config
  {
    return {
      // Uncomment if you want to use webpack-bundle-analyzer
      // plugins: config.plugins.filter(
      //   (x) => x.constructor.name === 'StatsJsonPlugin',
      // ),
      stats: {
        assets: true,
        modules: false,
        colors: true,
      },
      entry: ['./dist/packages/precomputed-evaluations/src/index.js'],
      mode: 'production',
      target: 'web',
      resolve: {
        alias: {
          '@statsig/client-core': path.resolve(
            __dirname,
            '../../dist/packages/client-core',
          ),
        },
        extensions: ['.js'],
      },
      externals: [],
      output: {
        filename: 'precomputed-evaluations.min.js',
        library: {
          type: 'umd',
          name: {
            root: 'statsig',
            amd: 'statsig',
            commonjs: 'statsig',
          },
        },
        path: path.resolve(
          __dirname,
          '../../dist/packages/precomputed-evaluations/build',
        ),
        libraryExport: 'default',
        globalObject: 'this',
      },
      performance: {
        maxEntrypointSize: 50000,
        hints: 'error',
      },
      optimization: {
        minimize: true,
        minimizer: [minifier],
      },
    };
  },
);
