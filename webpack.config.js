module.exports = {
  entry: {
    options: './src/js/pages/options.js',
    popup: './src/js/pages/popup.js',
    dmm: './src/js/pages/dmm.js',
    background: './src/js/background.js'
  },
  output: {filename:'./dest/js/[name].js'},
  module: {
    loaders: [
      {test: /.jsx?$/, loader: 'babel-loader'},
      {test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,loader: 'url'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
