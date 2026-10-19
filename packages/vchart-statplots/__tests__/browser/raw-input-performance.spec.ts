import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const output = path.resolve(__dirname, '../../../../.vchart-statplots/raw-input');
fs.mkdirSync(output, { recursive: true });
for (const type of [
  'countPlot',
  'confusionMatrix',
  'rocCurve',
  'precisionRecallCurve',
  'calibrationCurve',
  'qqPlot',
  'autocorrelationPlot'
]) {
  for (const n of [10000, 100000])
    test(`${type} ${n} raw observations lifecycle performance`, async ({ page }) => {
      test.setTimeout(60000);
      await page.goto('/__tests__/browser/page.html');
      const result = await page.evaluate(
        async ({ type, n }) => {
          const w = window as any;
          const data = Array.from({ length: n }, (_, i) =>
            type === 'countPlot'
              ? { category: String(i % 7) }
              : type === 'confusionMatrix'
              ? { actual: String(i % 5), predicted: String((i * 7 + 1) % 5) }
              : type === 'rocCurve' || type === 'precisionRecallCurve'
              ? { actual: i % 3 === 0, score: ((i * 7919) % n) / n }
              : type === 'calibrationCurve'
              ? { actual: i % 3 === 0, probability: ((i * 7919) % n) / n }
              : { value: Math.sin(i * 0.7) + (i % 31) / 31 }
          );
          const spec = { type, data };
          let start = performance.now();
          const compiled = w.VChartStatPlots.compileStatPlot(spec);
          const compileMs = performance.now() - start;
          w.VChartStatPlots.registerStatPlots();
          const errors: string[] = [];
          const chart = new w.VChart.default(compiled, {
            dom: 'statplot-mount',
            autoFit: false,
            animation: false,
            onError: (e: any) => errors.push(String(e))
          });
          start = performance.now();
          await chart.renderAsync();
          const renderMs = performance.now() - start;
          data.push({ ...data[0] });
          start = performance.now();
          await chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
          const updateMs = performance.now() - start;
          const rows = chart.getSpec().series.flatMap((s: any) => s.data.values);
          const before = JSON.stringify(rows);
          start = performance.now();
          await chart.resize(480, 360);
          const resizeMs = performance.now() - start;
          const unchanged = JSON.stringify(chart.getSpec().series.flatMap((s: any) => s.data.values)) === before;
          const sampleCount =
            type === 'countPlot' || type === 'calibrationCurve' || type === 'confusionMatrix'
              ? rows.reduce((n: number, r: any) => n + r.count, 0)
              : type === 'qqPlot'
              ? rows.length
              : rows[0].sampleCount;
          start = performance.now();
          chart.release();
          const releaseMs = performance.now() - start;
          return {
            type,
            inputRows: n,
            compileMs,
            renderMs,
            updateMs,
            resizeMs,
            releaseMs,
            sampleCount,
            unchanged,
            errors,
            canvases: document.querySelectorAll('canvas').length
          };
        },
        { type, n }
      );
      expect(result.errors).toEqual([]);
      expect(result.sampleCount).toBe(n + 1);
      expect(result.unchanged).toBe(true);
      expect(result.canvases).toBe(0);
      fs.writeFileSync(path.join(output, `${type}-${n}-lifecycle.json`), JSON.stringify(result, null, 2) + '\n');
    });
}
test('20 charts share a page and release every raw-input chart', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const result = await page.evaluate(async () => {
    const w = window as any;
    w.VChartStatPlots.registerStatPlots();
    const charts: any[] = [];
    const errors: string[] = [];
    const types = [
      'countPlot',
      'confusionMatrix',
      'rocCurve',
      'precisionRecallCurve',
      'calibrationCurve',
      'qqPlot',
      'autocorrelationPlot'
    ];
    let start = performance.now();
    for (let i = 0; i < 20; i++) {
      const type = types[i % types.length];
      const data = Array.from({ length: 1000 }, (_, j) =>
        type === 'countPlot'
          ? { category: String(j % 5) }
          : type === 'confusionMatrix'
          ? { actual: String(j % 2), predicted: String(j % 3) }
          : type === 'rocCurve' || type === 'precisionRecallCurve'
          ? { actual: j % 3 === 0, score: j / 1000 }
          : type === 'calibrationCurve'
          ? { actual: j % 3 === 0, probability: j / 1000 }
          : { value: Math.sin(j) }
      );
      const dom = document.createElement('div');
      dom.style.width = '300px';
      dom.style.height = '200px';
      document.body.appendChild(dom);
      const chart = new w.VChart.default(w.VChartStatPlots.compileStatPlot({ type, data }), {
        dom,
        autoFit: false,
        animation: false,
        onError: (e: any) => errors.push(String(e))
      });
      await chart.renderAsync();
      charts.push(chart);
    }
    const renderMs = performance.now() - start;
    start = performance.now();
    charts.forEach(c => c.release());
    return {
      charts: 20,
      inputRowsEach: 1000,
      renderMs,
      releaseMs: performance.now() - start,
      errors,
      canvases: document.querySelectorAll('canvas').length
    };
  });
  expect(result.errors).toEqual([]);
  expect(result.canvases).toBe(0);
  fs.writeFileSync(path.join(output, 'dashboard-lifecycle.json'), JSON.stringify(result, null, 2) + '\n');
});
