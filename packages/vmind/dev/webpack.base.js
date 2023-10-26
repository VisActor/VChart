const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/index.ts')
  },
  //output: {
  //  path: path.resolve(__dirname, '../dist'),
  //  filename: 'index.js'
  //},
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@packages': path.resolve(__dirname, '../src/packages')
    },
    mainFiles: ['index', 'main'],
    extensions: ['.ts', '.tsx', '.scss', '.json', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx$/,
        use: [
          {
            loader: require.resolve('esbuild-loader'),
            options: {
              loader: 'tsx',
              target: 'es2015'
            }
          }
        ],
        include: [path.resolve('./src')]
      },
      {
        test: /\.(t|j)s$/,
        use: [
          {
            loader: require.resolve('esbuild-loader'),
            options: {
              loader: 'ts',
              target: 'es2015'
            }
          }
        ],
        include: [path.resolve('../vchart/src')]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              keepQuery: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css'
    }),
    //生成html名称为index.html
    // 生成使用的模板为public / index.html
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html')
    })
  ]
};
