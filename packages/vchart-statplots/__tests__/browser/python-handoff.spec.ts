import { test, expect } from '@playwright/test';
import { execFileSync } from 'child_process';
import path from 'path';

test('Python raw observations and browser data update the same chart', async ({ page }) => {
  const spec = JSON.parse(
    execFileSync('python3', [path.resolve(__dirname, '../../examples/python/histogram.py')], { encoding: 'utf8' })
  );
  expect(spec.data.map((row: any) => row.value)).toEqual([0, 1, 2, 3, 4]);
  await page.goto('/__tests__/browser/page.html');
  const before = await page.evaluate(async spec => {
    const w = window as any;
    await w.renderStatPlot(spec);
    w.originalChart = w.chart;
    return w.chart
      .getChart()
      .getAllSeries()[0]
      .getSeriesMark()
      .getGraphics()
      .map((g: any) => Math.abs(g.attribute.y1 - g.attribute.y));
  }, spec);
  expect(before[0] / before[1]).toBeCloseTo(2 / 3, 5);
  const after = await page.evaluate(async spec => {
    const w = window as any;
    // 浏览器提交原始观测；相同实例内重新计算两箱密度 0.25。
    const next = {
      ...spec,
      data: [0, 1, 2, 4].map(value => ({ value }))
    };
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(next));
    return {
      sameInstance: w.chart === w.originalChart,
      heights: w.chart
        .getChart()
        .getAllSeries()[0]
        .getSeriesMark()
        .getGraphics()
        .map((g: any) => Math.abs(g.attribute.y1 - g.attribute.y))
    };
  }, spec);
  expect(after.sameInstance).toBe(true);
  expect(after.heights[0]).toBeCloseTo(after.heights[1], 5);
});
