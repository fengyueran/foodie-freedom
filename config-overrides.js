const path = require('path');
const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  useBabelRc,
  useEslintRc
} = require('customize-cra');

const CircularDependencyPlugin = require('circular-dependency-plugin');

const addMyPlugin = () => config => {
  const plugin = new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // set the current working directory for displaying module paths
    cwd: process.cwd()
  });
  config.plugins.push(plugin);
  return config;
};

const overrideOutput = () => config => {
  config.output.filename = 'static/js/bundle.js';
  delete config.optimization.splitChunks;
  config.optimization.runtimeChunk = false;
  return config;
};

module.exports = {
  webpack: override(
    useEslintRc(),
    useBabelRc(),
    addDecoratorsLegacy(),
    addWebpackAlias({ src: path.join(__dirname, 'src') }),
    addMyPlugin()
    // overrideOutput()
  ),
  jest(config) {
    config.testMatch = ['**/__tests__/*.js?(x)'];
    return config;
  }
};
