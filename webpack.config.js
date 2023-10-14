const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  target: 'node',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader',{
            loader: '@nestjs/webpack',
            options: {
                keep_classnames: true
            }
        }],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: 'development',
        },
      },
    }),
  ],
};
