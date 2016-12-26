var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './lib/game.js'],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '',
    filename: 'game.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        include: path.join(__dirname, 'lib'),
        loader: 'babel-loader',
        query: {
          presets: ["latest"],
        }
      }
    ]
  },
  debug: true
};
