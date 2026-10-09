import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const output = path.resolve(__dirname, '../../../../.vchart-statplots/input-alignment/performance');
fs.mkdirSync(output, { recursive: true });
const cases: any[] = [];
for (const n of [10000, 100000]) {
  for (const variables of [4, 16])
    for (const method of ['pearson', 'spearman', 'kendall'])
      cases.push({ type: 'correlationMatrix', n, variables, method });
  cases.push({ type: 'missingValueMatrix', n }, { type: 'residualPlot', n });
  for (const estimator of ['mean', 'median'])
    for (const resamples of [100, 1000]) cases.push({ type: 'pointIntervalPlot', n, estimator, resamples });
}
for (const sizes of [10, 100])
  for (const folds of [5, 10])
    for (const models of [1, 10]) cases.push({ type: 'learningCurve', sizes, folds, models });
for (const parameters of cases) {
  const id = Object.values(parameters).join('-');
  test(`${id}: measured compilation and lifecycle`, async ({ page }) => {
    test.setTimeout(300000);
    await page.goto('/__tests__/browser/page.html');
    const result = await page.evaluate(async p => {
      const w = window as any;
      let spec: any;
      if (p.type === 'correlationMatrix' || p.type === 'missingValueMatrix') {
        const variables = Array.from({ length: p.variables ?? 4 }, (_, i) => `v${i}`);
        // Missingness n is actual cells; correlation n is observations.
        const count = p.type === 'missingValueMatrix' ? p.n / variables.length : p.n;
        spec = {
          type: p.type,
          variables,
          ...(p.method ? { method: p.method } : {}),
          data: {
            observations: Array.from({ length: count }, (_, i) => ({
              id: String(i),
              values: Object.fromEntries(
                variables.map((v, j) => [
                  v,
                  p.type === 'missingValueMatrix' && (i + j) % 5 === 0
                    ? null
                    : Math.sin(i * (j + 1) * 0.13) + (i % 31) / 31
                ])
              )
            }))
          }
        };
      } else if (p.type === 'residualPlot') {
        spec = {
          type: p.type,
          input: 'predictions',
          data: Array.from({ length: p.n }, (_, i) => ({
            id: String(i),
            fittedValue: i / 100,
            actual: i / 100 + Math.sin(i)
          }))
        };
      } else if (p.type === 'pointIntervalPlot') {
        spec = {
          type: p.type,
          input: 'observations',
          estimator: p.estimator,
          errorBar: { kind: 'confidence', resamples: p.resamples, seed: 0 },
          data: Array.from({ length: p.n }, (_, i) => ({ category: 'A', value: (i * 37) % 1009 }))
        };
      } else {
        const data = [];
        for (let m = 0; m < p.models; m++)
          for (let i = 1; i <= p.sizes; i++)
            for (let f = 0; f < p.folds; f++)
              for (const split of ['train', 'validation'])
                data.push({
                  trainSize: i * 100,
                  fold: String(f),
                  split,
                  score: 0.5 + i / 1000 + f / 100,
                  series: `model${m}`
                });
        spec = { type: p.type, input: 'folds', metric: 'score', data };
      }
      const startCompile = performance.now();
      const compiled = w.VChartStatPlots.compileStatPlot(spec);
      const compileMs = performance.now() - startCompile;
      w.VChartStatPlots.registerStatPlots();
      const errors: string[] = [];
      const chart = new w.VChart.default(compiled, {
        dom: 'statplot-mount',
        autoFit: false,
        animation: false,
        onError: (e: any) => errors.push(String(e))
      });
      let start = performance.now();
      await chart.renderAsync();
      const renderMs = performance.now() - start;
      const graphics = chart
        .getChart()
        .getAllSeries()
        .reduce((sum: number, s: any) => sum + s.getSeriesMark().getGraphics().length, 0);
      start = performance.now();
      await chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, title: 'Updated' }));
      const updateMs = performance.now() - start;
      const before = JSON.stringify(chart.getSpec().series.map((s: any) => s.data.values));
      start = performance.now();
      await chart.resize(640, 480);
      const resizeMs = performance.now() - start;
      const unchanged = before === JSON.stringify(chart.getSpec().series.map((s: any) => s.data.values));
      start = performance.now();
      chart.release();
      const releaseMs = performance.now() - start;
      return {
        parameters: p,
        compileMs,
        renderMs,
        updateMs,
        resizeMs,
        releaseMs,
        graphics,
        unchanged,
        errors,
        canvases: document.querySelectorAll('canvas').length
      };
    }, parameters);
    expect(result.errors).toEqual([]);
    expect(result.unchanged).toBe(true);
    expect(result.canvases).toBe(0);
    if (parameters.type === 'missingValueMatrix' || parameters.type === 'residualPlot')
      expect(result.graphics).toBe(parameters.n);
    fs.writeFileSync(path.join(output, `${id}.json`), JSON.stringify(result, null, 2) + '\n');
  });
}
test('20 mixed charts render, resize and release on one page', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const specs = ['missingValueMatrix', 'correlationMatrix', 'pointIntervalPlot', 'residualPlot', 'learningCurve'].map(
    type => JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'))
  );
  const result = await page.evaluate(async specs => {
    const w = window as any;
    w.VChartStatPlots.registerStatPlots();
    const charts: any[] = [];
    const errors: string[] = [];
    let start = performance.now();
    for (let i = 0; i < 20; i++) {
      const dom = document.createElement('div');
      dom.style.width = '300px';
      dom.style.height = '220px';
      document.body.appendChild(dom);
      const chart = new w.VChart.default(w.VChartStatPlots.compileStatPlot(specs[i % specs.length]), {
        dom,
        autoFit: false,
        animation: false,
        onError: (e: any) => errors.push(String(e))
      });
      await chart.renderAsync();
      charts.push(chart);
    }
    const renderMs = performance.now() - start;
    const renderedCanvases = document.querySelectorAll('canvas').length;
    start = performance.now();
    for (const chart of charts) await chart.resize(280, 200);
    const resizeMs = performance.now() - start;
    start = performance.now();
    charts.forEach(c => c.release());
    const releaseMs = performance.now() - start;
    return {
      renderMs,
      resizeMs,
      releaseMs,
      renderedCanvases,
      canvases: document.querySelectorAll('canvas').length,
      errors
    };
  }, specs);
  expect(result.errors).toEqual([]);
  expect(result.renderedCanvases).toBe(20);
  expect(result.canvases).toBe(0);
  fs.writeFileSync(path.join(output, 'dashboard.json'), JSON.stringify(result, null, 2) + '\n');
});
