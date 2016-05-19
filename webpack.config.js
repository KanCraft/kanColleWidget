module.exports = {
  entry: {
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
