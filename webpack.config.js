const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    matt: "./scripts/matt.js",
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js",
    path: __dirname + "/webpack-dist",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['webpack-dist'])
  ]
};
