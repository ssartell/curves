const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: "source-map", 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};