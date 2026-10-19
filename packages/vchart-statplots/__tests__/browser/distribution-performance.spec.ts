import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { distributionOutput } from './distribution-helpers';

for (const type of ['kdePlot', 'ecdfPlot'] as const) {
  test(`${type} 10k and 100k lifecycle and 20 chart release`, async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/__tests__/browser/page.html');
    const timings = [];
    for (const count of [10000, 100000]) {
      for (const unique of type === 'ecdfPlot' ? [false, true] : [false]) {
        const result = await page.evaluate(
          async ({ type, count, unique }) => {
            const w = window as any;
            const modulus = unique ? count : 997;
            const data = Array.from({ length: count }, (_, i) => ({ value: ((i * 73) % modulus) / modulus }));
            const spec = { type, data };
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
            start = performance.now();
            await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, data: [...data, { value: 0 }] }));
            const updateMs = performance.now() - start;
            const rows = w.chart.getSpec().series[0].data.values;
            const zeroProbability =
              type === 'ecdfPlot' ? rows.find((row: any) => row.value === 0).cumulativeProbability : undefined;
            const rawZeroCount = data.filter(row => row.value === 0).length;
            const expectedZeroProbability = (rawZeroCount + 1) / (count + 1);
            const before = JSON.stringify(rows);
            start = performance.now();
            await w.chart.resize(420, 320);
            const resizeMs = performance.now() - start;
            const preserved = JSON.stringify(w.chart.getSpec().series[0].data.values) === before;
            const sameInstance = w.chart === original;
            const pointCount = rows.length;
            const finite = rows.every(
              (row: any) =>
                Number.isFinite(row.value) &&
                Number.isFinite(type === 'ecdfPlot' ? row.cumulativeProbability : row.density)
            );
            start = performance.now();
            w.chart.release();
            const releaseMs = performance.now() - start;
            return {
              count,
              unique,
              pointCount,
              compileMedianMs: samples[4],
              compileMaxMs: samples[8],
              renderMs,
              updateMs,
              resizeMs,
              releaseMs,
              zeroProbability,
              expectedZeroProbability,
              preserved,
              sameInstance,
              finite,
              errors: w.chartErrors
            };
          },
          { type, count, unique }
        );
        expect(result.errors).toEqual([]);
        expect(result.finite).toBe(true);
        expect(result.preserved).toBe(true);
        expect(result.sameInstance).toBe(true);
        expect(result.pointCount).toBe(type === 'kdePlot' ? 256 : (unique ? count : 997) + 2);
        if (type === 'ecdfPlot') expect(result.zeroProbability).toBe(result.expectedZeroProbability);
        await expect(page.locator('canvas')).toHaveCount(0);
        timings.push({
          count,
          unique,
          pointCount: result.pointCount,
          compileMedianMs: result.compileMedianMs,
          compileMaxMs: result.compileMaxMs,
          renderMs: result.renderMs,
          updateMs: result.updateMs,
          resizeMs: result.resizeMs,
          releaseMs: result.releaseMs
        });
      }
    }
    const dashboard = await page.evaluate(async type => {
      const w = window as any;
      const charts = [];
      const start = performance.now();
      for (let i = 0; i < 20; i++) {
        const mount = document.createElement('div');
        mount.id = `distribution-${i}`;
        mount.style.cssText = 'width:300px;height:200px';
        document.body.appendChild(mount);
        const spec = { type, data: Array.from({ length: 1000 }, (_, j) => ({ value: ((j * 73) % 997) / 997 })) };
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
    }, type);
    expect(dashboard.canvasCount).toBe(20);
    await expect(page.locator('canvas')).toHaveCount(0);
    fs.writeFileSync(
      path.join(distributionOutput, `${type}-timings.json`),
      JSON.stringify({ timings, dashboard }, null, 2)
    );
  });
}
