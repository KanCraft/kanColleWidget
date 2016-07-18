var webpack = require('webpack');

var plugins = [
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
];
if (process.env.NODE_ENV == 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    mangle: false
  }));
}

module.exports = {
  entry: {
    options:    './src/js/entrypoints/pages/options.js',
    popup:      './src/js/entrypoints/pages/popup.js',
    dmm:        './src/js/entrypoints/pages/dmm.js',
    'osapi.dmm':'./src/js/entrypoints/pages/osapi.dmm.js',
    background: './src/js/entrypoints/background.js'
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
  },
  plugins: plugins
}
