module.exports = {
  mode: 'production',
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  entry: './src/index.js', 
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};