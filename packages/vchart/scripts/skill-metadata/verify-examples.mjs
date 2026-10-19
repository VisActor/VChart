import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const require = createRequire(path.join(root, 'packages/vchart/package.json'));
const csv = 'day,value\n周一,12\n周二,25\n';

/** M07 使用真实本地 URL；服务器不访问外部业务系统。 */
export async function serveCSV() {
  const requests = [];
  const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (request.url === '/data.csv') {
      requests.push({ path: request.url, method: request.method });
      response.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8' });
      response.end(csv);
    } else {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, requests, url: `http://127.0.0.1:${server.address().port}/data.csv` };
}

/** 使用原始 Agent spec，不重写配置；验证数据、实际图元和可见范围。 */
export async function verifySpecs(artifacts, extensionBundle, selectedCase) {
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch();
  const output = [];
  try {
    for (const [name, filename] of [
      ['before-m01', 'spec.json'],
      ['before-m02', 'spec.json'],
      ['m01', 'spec.json'],
      ['m02', 'spec.json'],
      ['m02', 'disabled-spec.json'],
      ['m04', 'spec.json'],
      ['m05', 'spec.json'],
      ['m10', 'spec.json'],
      ['m11', 'spec.json']
    ]) {
      if (selectedCase && name !== selectedCase) continue;
      const directory = path.join(artifacts, name);
      const file = path.join(directory, filename);
      if (!fs.existsSync(file)) {
        output.push({ task: `${name}/${filename}`, status: 'not_run', reason: '没有该实际产物' });
        continue;
      }
      const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (name === 'm11' && !extensionBundle) {
        output.push({
          task: `${name}/${filename}`,
          status: 'not_run',
          reason: '需要真实共享依赖的扩展 bundle；不能用核心 2D 环境替代'
        });
        continue;
      }
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setContent('<div id="chart" style="width:800px;height:500px"></div>');
      await page.addScriptTag({
        path: name === 'm11' ? extensionBundle : path.join(root, 'packages/vchart/build/index.js')
      });
      const state = await page.evaluate(
        async ({ spec, extension }) => {
          if (extension) VChartExtension.registerBar3dChart();
          const chart = new VChart.default(spec, { dom: 'chart' });
          await chart.renderAsync();
          await new Promise(resolve => setTimeout(resolve, 1200));
          const series = chart.getChart().getAllSeries()[0];
          window.__metadataChart = chart;
          return {
            version: VChart.version,
            type: series.type,
            data: series
              .getRawData()
              .latestData.map(d => Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith('__')))),
            marks: series.getMarks().map(mark => ({
              name: mark.name,
              graphics: mark.getGraphics().map(g => ({
                type: g.type,
                datum: g.context?.data?.[0],
                points: g.attribute.points,
                bounds: {
                  x1: g.globalAABBBounds.x1,
                  y1: g.globalAABBBounds.y1,
                  x2: g.globalAABBBounds.x2,
                  y2: g.globalAABBBounds.y2
                }
              }))
            })),
            texts: chart
              .getStage()
              .findAll(g => g.type === 'text', true)
              .map(g => g.attribute.text)
          };
        },
        { spec, extension: name === 'm11' }
      );
      const values = Array.isArray(spec.data) ? spec.data[0].values : spec.data.values;
      if (JSON.stringify(state.data) !== JSON.stringify(values)) throw new Error(`${name}: 原数据变化`);
      const graphics = state.marks.flatMap(m => m.graphics).filter(g => Object.values(g.bounds).every(Number.isFinite));
      if (!graphics.length || errors.length) throw new Error(`${name}: 没有有效图元或存在错误 ${errors.join(',')}`);
      if (spec.type === 'bar') {
        const bars = state.marks.find(m => m.name === 'bar')?.graphics || [];
        if (bars.length !== values.length || bars.some(g => g.bounds.x2 <= g.bounds.x1 || g.bounds.y2 <= g.bounds.y1))
          throw new Error(`${name}: 柱图几何错误`);
        if (spec.direction === 'horizontal' && !bars.every(g => g.bounds.x2 - g.bounds.x1 > g.bounds.y2 - g.bounds.y1))
          throw new Error(`${name}: 未形成水平柱`);
      }
      if (spec.type === 'rangeArea') {
        const points = state.marks.find(m => m.name === 'area')?.graphics?.[0]?.points;
        if (
          !points ||
          points.length !== values.length ||
          points.some(p => ![p.x, p.y, p.y1].every(Number.isFinite) || p.y === p.y1)
        )
          throw new Error(`${name}: 区间面积端点无效`);
      }
      if (spec.type === 'radar' && state.marks.find(m => m.name === 'point')?.graphics.length !== values.length)
        throw new Error(`${name}: 雷达点数量错误`);
      if (spec.type === 'bar3d') {
        const bars = state.marks.find(m => m.name === 'bar3d')?.graphics || [];
        if (
          bars.length !== values.length ||
          bars.some(
            g =>
              g.type !== 'rect3d' ||
              !Object.values(g.bounds).every(Number.isFinite) ||
              g.bounds.x2 <= g.bounds.x1 ||
              g.bounds.y2 <= g.bounds.y1
          )
        )
          throw new Error(`${name}: 实际 3D 图元无效`);
      }
      await page.screenshot({ path: path.join(directory, filename.replace('.json', '-parent.png')) });
      const report = { status: 'passed', ...state, errors };
      fs.writeFileSync(
        path.join(directory, filename.replace('.json', '-parent-validation.json')),
        JSON.stringify(report, null, 2) + '\n'
      );
      output.push({ task: `${name}/${filename}`, status: 'passed', type: state.type, version: state.version });
      await page.evaluate(() => window.__metadataChart.release());
      await page.close();
    }
  } finally {
    await browser.close();
  }
  return output;
}

/** 执行文档里的原始 CSV 代码，兼查 URL 不自动加载的反例及应用 fetch 正例。 */
async function verifyCSVExample(output) {
  const document = fs.readFileSync(
    path.join(root, 'skills/vchart-development-assistant/references/type-details/IData-Type-Definition.md'),
    'utf8'
  );
  const example = document.match(/### CSV Data with Parser\s*```typescript\s*([\s\S]*?)```/)?.[1];
  if (!example) throw new Error('没有找到实际 CSV 文档示例');
  const ts = require('typescript');
  const code = ts.transpileModule(example, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
  const data = new Function(code + '\nreturn data;')();
  const fixture = await serveCSV();
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent('<div id="chart" style="width:700px;height:400px"></div>');
    await page.addScriptTag({ path: path.join(root, 'packages/vchart/build/index.js') });
    const states = await page.evaluate(
      async ({ data, url }) => {
        const output = [];
        for (const [name, actual] of [
          ['url-as-values', { values: url, parser: { type: 'csv' } }],
          ['actual-document-example', data],
          [
            'application-fetch',
            {
              values: await fetch(url).then(r => {
                if (!r.ok) throw new Error('CSV fetch failed');
                return r.text();
              }),
              parser: { type: 'csv' }
            }
          ]
        ]) {
          const chart = new VChart.default(
            { type: 'bar', animation: false, data: actual, xField: 'day', yField: 'value' },
            { dom: 'chart' }
          );
          await chart.renderAsync();
          const series = chart.getChart().getAllSeries()[0];
          output.push({
            name,
            version: VChart.version,
            data: series.getRawData().latestData.map(d => ({ day: d.day, value: d.value })),
            validBars: series
              .getSeriesMark()
              .getGraphics()
              .filter(g => Number.isFinite(g.attribute.y) && Math.abs(g.attribute.y - g.attribute.y1) > 0).length
          });
          chart.release();
        }
        return output;
      },
      { data, url: fixture.url }
    );
    if (states[0].validBars !== 0 || fixture.requests.length !== 1) throw new Error('URL 反例或应用加载请求数错误');
    for (const state of states.slice(1))
      if (state.validBars !== 2 || state.data.map(d => `${d.day}:${Number(d.value)}`).join(',') !== '周一:12,周二:25')
        throw new Error('实际文档/加载数据错误');
    fs.writeFileSync(output, JSON.stringify({ states, requests: fixture.requests, status: 'passed' }, null, 2) + '\n');
  } finally {
    await browser.close();
    await new Promise(resolve => fixture.server.close(resolve));
  }
}

/** 复用标准 Rollup 工具，将核心与扩展的 CJS 入口绑定为同一模块，避免双 Factory/渲染器。 */
async function buildExtensionRuntime(output) {
  const bundler = createRequire(path.join(root, 'tools/bundler/package.json'));
  const { rollup } = bundler('rollup');
  const commonjs = bundler('@rollup/plugin-commonjs');
  const { nodeResolve } = bundler('@rollup/plugin-node-resolve');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-3d-'));
  const entry = path.join(directory, 'entry.mjs');
  const core = path.join(root, 'packages/vchart/cjs/index.js');
  fs.writeFileSync(
    entry,
    `import * as Core from ${JSON.stringify(core)};\nimport { registerBar3dChart } from ${JSON.stringify(
      path.join(root, 'packages/vchart-extension/cjs/charts/bar-3d/index.js')
    )};\nwindow.VChart=Core;window.VChartExtension={registerBar3dChart};\n`
  );
  let bundle;
  try {
    bundle = await rollup({
      input: entry,
      plugins: [
        {
          name: 'same-core-runtime',
          resolveId(id) {
            if (id === '@visactor/vchart') return core;
            if (id.startsWith('@visactor/vchart/esm/')) {
              const candidate = path.join(root, 'packages/vchart/cjs', id.slice('@visactor/vchart/esm/'.length));
              return [candidate + '.js', path.join(candidate, 'index.js')].find(fs.existsSync);
            }
          }
        },
        nodeResolve({ browser: true, preferBuiltins: false }),
        commonjs()
      ],
      onwarn(warning) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') console.error(warning.message);
      }
    });
    await bundle.write({ file: output, format: 'iife' });
  } finally {
    await bundle?.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

const { values } = parseArgs({
  options: {
    'serve-csv': { type: 'boolean' },
    artifacts: { type: 'string' },
    case: { type: 'string' },
    'extension-bundle': { type: 'string' },
    'build-extension': { type: 'string' },
    'csv-example': { type: 'string' }
  }
});
if (values['serve-csv']) {
  const fixture = await serveCSV();
  console.log(JSON.stringify({ url: fixture.url, values: csv }));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => fixture.server.close());
} else if (values['build-extension']) {
  await buildExtensionRuntime(path.resolve(values['build-extension']));
  console.log(JSON.stringify({ extensionBundle: values['build-extension'] }));
} else if (values['csv-example']) {
  await verifyCSVExample(path.resolve(values['csv-example']));
  console.log(JSON.stringify({ csvExample: 'passed' }));
} else if (values.artifacts) {
  try {
    console.log(
      JSON.stringify(
        await verifySpecs(
          path.resolve(values.artifacts),
          values['extension-bundle'] && path.resolve(values['extension-bundle']),
          values.case
        )
      )
    );
  } catch (error) {
    console.error(error.stack);
    process.exitCode = 1;
  }
} else {
  console.error('需要 --serve-csv 或 --artifacts DIR');
  process.exitCode = 1;
}
