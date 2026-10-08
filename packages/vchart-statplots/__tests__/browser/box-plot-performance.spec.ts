import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('boxPlot 10k / 100k 单组、多组、大量异常点和 20 图表生命周期', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('/__tests__/browser/page.html');
  const timings = [];
  for (const count of [10000, 100000]) {
    for (const mode of ['single', 'grouped', 'outliers']) {
      const result = await page.evaluate(
        async ({ count, mode }) => {
          const w = window as any;
          const data = Array.from({ length: count }, (_, i) => ({
            category: mode === 'grouped' ? String(i % 10) : 'A',
            value: mode === 'outliers' ? (i % 5 === 4 ? 100 : 0) : (i * 37) % 1009
          }));
          const spec = { type: 'boxPlot', data };
          w.VChartStatPlots.compileStatPlot(spec);
          const samples = [];
          for (let i = 0; i < 9; i++) {
            const start = performance.now();
            w.VChartStatPlots.compileStatPlot(spec);
            samples.push(performance.now() - start);
          }
          samples.sort((a, b) => a - b);
          let start = performance.now();
          await w.renderStatPlot(spec);
          const renderMs = performance.now() - start;
          const original = w.chart;
          const series = w.chart.getChart().getAllSeries()[0];
          const boxCount = series.getMarkInName('boxPlot').getGraphics().length;
          const outlierCount = series.getMarkInName('outlier').getGraphics().length;
          start = performance.now();
          await w.chart.updateSpec(
            w.VChartStatPlots.compileStatPlot({ ...spec, data: [...data, { category: 'A', value: 0 }] })
          );
          const updateMs = performance.now() - start;
          const before = JSON.stringify(w.chart.getSpec().series[0].data.values);
          start = performance.now();
          await w.chart.resize(420, 320);
          const resizeMs = performance.now() - start;
          const preserved = JSON.stringify(w.chart.getSpec().series[0].data.values) === before;
          const sameInstance = w.chart === original;
          start = performance.now();
          w.chart.release();
          const releaseMs = performance.now() - start;
          return {
            count,
            mode,
            boxCount,
            outlierCount,
            compileMedianMs: samples[4],
            compileMaxMs: samples[8],
            renderMs,
            updateMs,
            resizeMs,
            releaseMs,
            preserved,
            sameInstance,
            errors: w.chartErrors
          };
        },
        { count, mode }
      );
      expect(result.errors).toEqual([]);
      expect(result.preserved).toBe(true);
      expect(result.sameInstance).toBe(true);
      expect(result.boxCount).toBe(mode === 'grouped' ? 10 : 1);
      expect(result.outlierCount).toBe(mode === 'outliers' ? count / 5 : 0);
      await expect(page.locator('canvas')).toHaveCount(0);
      timings.push(result);
    }
  }
  const dashboard = await page.evaluate(async () => {
    const w = window as any;
    const charts = [];
    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const mount = document.createElement('div');
      mount.id = `box-${i}`;
      mount.style.cssText = 'width:300px;height:200px';
      document.body.appendChild(mount);
      const spec = {
        type: 'boxPlot',
        data: Array.from({ length: 1000 }, (_, j) => ({ category: 'A', value: (j * 37) % 1009 }))
      };
      const chart = new w.VChart.default(w.VChartStatPlots.compileStatPlot(spec), {
        dom: mount.id,
        animation: false,
        autoFit: false
      });
      await chart.renderAsync();
      charts.push(chart);
    }
    const renderMs = performance.now() - start;
    const canvasCount = document.querySelectorAll('canvas').length;
    const releaseStart = performance.now();
    charts.forEach(chart => chart.release());
    return { chartCount: charts.length, canvasCount, renderMs, releaseMs: performance.now() - releaseStart };
  });
  expect(dashboard.canvasCount).toBe(20);
  await expect(page.locator('canvas')).toHaveCount(0);
  const output = path.resolve(__dirname, '../../../../.vchart-statplots/box-plot');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'timings.json'), JSON.stringify({ timings, dashboard }, null, 2));
});
