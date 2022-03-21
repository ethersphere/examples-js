const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // Using resolve.fallback for `process` module was not working.
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    symlinks: false,
    // This is important! We need polyfill stream package!
    // The `stream-browserify` uses buffer and process so we need to polyfill those too!
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      // process: require.resolve('process/browser'), // This did not worked for me so had to use the ProvidePlugin
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
