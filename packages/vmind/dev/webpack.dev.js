const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { BASE_PROT } = require('./utils/constants');
const portfinder = require('portfinder');
const path = require('path');
const Dotenv = require('dotenv-webpack');

portfinder.basePort = BASE_PROT;

const devConfig = {
  mode: 'development',
  entry: {
    entry: './src/site/index.tsx'
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../node_modules/@visactor/vchart/src/index.ts')
      // ...localConf.resolve?.alias
    }
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    proxy: {
      '/v2': {
        target: 'https://search.bytedance.net/gpt/openapi/offline/v2',
        changeOrigin: true,
        pathRewrite: path => path.replace(/^\/v2/, '')
      }
    },
    // static允许我们在DevServer下访问该目录的静态资源
    // 简单理解来说 当我们启动DevServer时相当于启动了一个本地服务器
    // 这个服务器会同时以static-directory目录作为跟路径启动
    // 这样的话就可以访问到static/directory下的资源了
    static: {
      directory: path.join(__dirname, '../public')
    },
    // 默认为true
    hot: true,
    // 是否开启代码压缩
    compress: true,
    // 启动的端口
    port: 9000
  },
  plugins: [
    new Dotenv({
      path: path.join(__dirname, '../.env.local')
    })
  ]
};

module.exports = async function () {
  try {
    // 端口被占用时候 portfinder.getPortPromise 返回一个新的端口(往上叠加)
    const port = await portfinder.getPortPromise();
    devConfig.devServer.port = port;
    return merge(devConfig, baseConfig);
  } catch (e) {
    throw new Error(e);
  }
};
