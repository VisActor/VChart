const assert = require('node:assert/strict');
const path = require('node:path');

// 逐种 UMD 在独立页面验证实际图元，防止已加载的 Extension 掩盖 React 的隐式依赖。
async function verifyReleaseBrowser(readEntry, version) {
  const root = path.resolve(__dirname, '../..');
  const { chromium } = require('../../packages/vchart/node_modules/@playwright/test');
  const { build } = require('../../tools/bundler/node_modules/esbuild');
  const vendor = await build({
    stdin: {
      contents: [
        "import * as React from 'react';",
        "import * as ReactDOM from 'react-dom';",
        "import * as VUtils from '@visactor/vutils';",
        "import * as VDataset from '@visactor/vdataset';",
        "import * as VRender from '@visactor/vrender-core';",
        'Object.assign(globalThis, { React, ReactDOM, VUtils, VDataset, VRender });'
      ].join('\n'),
      resolveDir: path.join(root, 'packages/vchart-extension')
    },
    bundle: true,
    platform: 'browser',
    write: false,
    define: { 'process.env.NODE_ENV': '"production"' }
  });

  const browser = await chromium.launch();
  try {
    for (const variant of ['index.js', 'index.min.js']) {
      const entry = 'build/' + variant;
      const core = readEntry('@visactor/vchart', entry);
      for (const name of ['@visactor/vchart-extension', '@visactor/react-vchart']) {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
          await page.setContent('<div id="plot" style="width:400px;height:300px"></div>');
          await page.addScriptTag({ content: core });
          await page.addScriptTag({ content: vendor.outputFiles[0].text });
          await page.addScriptTag({ content: readEntry(name, entry) });
          assert.deepEqual(errors, [], `${name} ${variant} failed to load`);
          const react = name === '@visactor/react-vchart';
          const result = await page.evaluate(async react => {
            const spec = {
              type: 'bar3d',
              data: [{ id: 'data', values: [{ x: 'a', y: 2 }, { x: 'b', y: 4 }] }],
              xField: 'x',
              yField: 'y',
              axes: [{ orient: 'bottom', type: 'band', mode: '3d' }, { orient: 'left', type: 'linear', mode: '3d' }],
              animation: false
            };
            const dom = document.getElementById('plot');
            // 两个入口用同一份 spec，断言系列类型与实际渲染的图元数量。
            const inspect = chart => {
              const series = chart.getChart().getAllSeries()[0];
              return [series.type, series.getSeriesMark().getGraphics().length];
            };
            if (react) {
              try {
                const marks = await new Promise((resolve, reject) => {
                  const timer = setTimeout(() => reject(new Error('React 3D chart did not render')), 5000);
                  ReactDOM.render(React.createElement(ReactVChart.Bar3dChart, {
                    ...spec,
                    options: { options3d: { enable: true } },
                    onReady: chart => {
                      clearTimeout(timer);
                      try { resolve(inspect(chart)); } catch (error) { reject(error); }
                    }
                  }), dom);
                });
                return [ReactVChart.version, ...marks];
              } finally {
                ReactDOM.unmountComponentAtNode(dom);
              }
            }
            VChartExtension.register3DPlugin();
            VChartExtension.registerBar3dChart();
            const chart = new VChart.default(spec, { dom, options3d: { enable: true } });
            try {
              chart.renderSync();
              const registered = VChart.Factory.getChartPlugins().some(plugin => plugin.type === 'VChart3dPlugin');
              return [VChart.version, ...inspect(chart), registered];
            } finally {
              chart.release();
            }
          }, react);
          assert.deepEqual(errors, [], `${name} ${variant} failed to render`);
          assert.deepEqual(result, react ? [version, 'bar3d', 2] : [version, 'bar3d', 2, true]);
          console.log(`Verified ${name} ${variant} browser 3D rendering.`);
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

module.exports = { verifyReleaseBrowser };
