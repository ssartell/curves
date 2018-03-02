const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
  entry: './src/curves/index.js',
  devtool: "source-map", 
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/curves')
  },
  plugins: [
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin({
      template: './src/curves/index.html'
    })
  ]
},
{
  entry: './src/ray-tracing/index.js',
  devtool: "source-map", 
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/ray-tracing')
  },
  plugins: [
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin({
      template: './src/ray-tracing/index.html'
    })
  ]
},
{
  entry: './src/contour-art/index.js',
  devtool: "source-map", 
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/contour-art')
  },
  plugins: [
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin({
      template: './src/contour-art/index.html'
    })
  ]
},
{
  entry: './src/aoc-day-14/index.js',
  devtool: "source-map", 
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/aoc-day-14')
  },
  plugins: [
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin({
      template: './src/aoc-day-14/index.html'
    })
  ]
}];