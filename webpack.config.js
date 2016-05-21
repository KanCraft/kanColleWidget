module.exports = {
  entry: {
    dmm: './src/js/dmm.js',
    background: './src/js/background.js'
  },
  output: {filename:'./dest/js/[name].js'},
  module: {
    loaders: [
      {test: /.jsx?$/, loader: 'babel-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
