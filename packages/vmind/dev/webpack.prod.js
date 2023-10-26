const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { BASE_PROT } = require('./utils/constants');
const portfinder = require('portfinder');
const path = require('path');

portfinder.basePort = BASE_PROT;

const devConfig = {
  mode: 'production'
};

module.exports = merge(devConfig, baseConfig);