const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  optimization: {
    minimize: false
  },
  entry: {
    main: path.resolve(__dirname, '../src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js'
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@packages': path.resolve(__dirname, '../src/packages')
    },
    mainFiles: ['index', 'main'],
    extensions: ['.ts', '.tsx', '.scss', '.json', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              keepQuery: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.ts$/,//规则生效的文件
        use: {
          loader: "ts-loader"   //要使用的loader
        },
        exclude: /node_modules/  //编译排除的文件
      }
    ],
  },
  plugins: [
    //new MiniCssExtractPlugin({
    //  filename: 'assets/[name].css',
    //}),
    // 生成html名称为index.html
    // 生成使用的模板为public/index.html
    //new htmlWebpackPlugin({
    //  filename: 'index.html',
    //  template: path.resolve(__dirname, '../public/index.html'),
    //}),
  ]
};
