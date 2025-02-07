import { defineConfig } from 'rollup';

import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

let options = defineConfig([
  {
    input: './miniprogram/src/index.js',
    output: [
      {
        format: 'umd',
        file: 'index.js'
      }
    ],
    plugins: [
      resolve(),
      commonjs({
        include: './miniprogram/src/vchart/index.js'
      }),
      babel({
        // presets: [['@babel/preset-env']],
        babelHelpers: 'bundled',
        compact: false
      }),
      terser(),
      copy({
        targets: [
          {
            src: ['./miniprogram/src/index.json', './miniprogram/src/index.wxml', './miniprogram/src/index.wxss'],
            dest: './'
          }
        ]
      })
    ]
  }
]);

export default options;
