import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const output = path.resolve(__dirname, '../../../../.vchart-statplots/regression/performance');
fs.mkdirSync(output, { recursive: true });
const scenarios = [
  ...[10000, 100000].flatMap(n => ['linear', 'polynomial'].map(method => ({ n, method, confidence: false }))),
  ...['linear', 'polynomial'].map(method => ({ n: 10000, method, confidence: true })),
  { n: 5000, method: 'lowess', delta: 0, confidence: false },
  { n: 100000, method: 'lowess', delta: 0.1, confidence: false }
];
for (const params of scenarios) {
  const id = `${params.method}-${params.n}-${'delta' in params ? params.delta : params.confidence ? 'ci' : 'no-ci'}`;
  test(`${id}: full input compilation and chart lifecycle`, async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/__tests__/browser/page.html');
    const session = await page.context().newCDPSession(page);
    const heapBefore = await session.send('Runtime.getHeapUsage');
    const result = await page.evaluate(async p => {
      const w = window as any,
        data = Array.from({ length: p.n }, (_, i) => ({ x: (i / p.n) * 10, y: 2 + i / p.n + Math.sin(i * 1.7) / 3 }));
      const fit = {
        input: 'observations',
        method: p.method,
        ...(p.method === 'polynomial' ? { degree: 2 } : {}),
        ...(p.method === 'lowess' ? { delta: (p as any).delta } : p.confidence ? {} : { confidence: false })
      };
      const spec = { type: 'scatterPlot', data, fit };
      let start = performance.now();
      const compiled = w.VChartStatPlots.compileStatPlot(spec),
        compileMs = performance.now() - start;
      const snapshot = JSON.stringify(compiled.series.map((s: any) => s.data.values));
      // 若交互错误地访问原始样本，立即失败；渲染使用已生成的私有数据。
      data.forEach(row => {
        Object.defineProperty(row, 'x', {
          get() {
            throw new Error('raw observations accessed by renderer');
          }
        });
      });
      start = performance.now();
      w.VChartStatPlots.registerStatPlots();
      w.chart = new w.VChart.default(compiled, { dom: 'statplot-mount', animation: false, autoFit: false });
      await w.chart.renderAsync();
      const renderMs = performance.now() - start;
      start = performance.now();
      await w.chart.resize(640, 480);
      const resizeMs = performance.now() - start;
      const observationCount = w.chart
        .getChart()
        .getAllSeries()
        .find((s: any) => s.userId === 'observations')
        .getSeriesMark()
        .getGraphics().length;
      const after = JSON.stringify(w.chart.getSpec().series.map((s: any) => s.data.values));
      const bounds = w.chart
        .getChart()
        .getAllSeries()
        .find((s: any) => s.userId === 'observations')
        .getMarkInName('point')
        .getGraphics()[0].globalAABBBounds;
      const hoverTarget = { x: (bounds.x1 + bounds.x2) / 2, y: (bounds.y1 + bounds.y2) / 2 };
      // 重新提交原始数据是独立计算事务，修改数据应改变拟合。
      const changed = Array.from({ length: p.n }, (_, i) => ({
        x: (i / p.n) * 10,
        y: 3 + i / p.n + Math.sin(i * 1.7) / 3
      }));
      start = performance.now();
      const updated = w.VChartStatPlots.compileStatPlot({ ...spec, data: changed });
      const updateCompileMs = performance.now() - start;
      return {
        compileMs,
        renderMs,
        resizeMs,
        hoverTarget,
        updateCompileMs,
        observationCount,
        unchanged: snapshot === after,
        nodes: compiled.series.find((s: any) => s.id === 'fit').data.values.length,
        deltaEstimate:
          updated.series.find((s: any) => s.id === 'fit').data.values[0].estimate -
          compiled.series.find((s: any) => s.id === 'fit').data.values[0].estimate
      };
    }, params);
    const hoverStarted = Date.now();
    await page.mouse.move(result.hoverTarget.x, result.hoverTarget.y);
    await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
    const hoverMs = Date.now() - hoverStarted;
    const heapRendered = await session.send('Runtime.getHeapUsage');
    const releaseMs = await page.evaluate(() => {
      const started = performance.now();
      (window as any).chart.release();
      return performance.now() - started;
    });
    await page.requestGC();
    const heapReleased = await session.send('Runtime.getHeapUsage');
    await session.detach();
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(result.observationCount).toBe(params.n);
    expect(result.nodes).toBe(params.method === 'lowess' ? params.n : 100);
    expect(result.unchanged).toBe(true);
    expect(result.deltaEstimate).toBeCloseTo(1, 8);
    expect(result.compileMs).toBeLessThan(15000);
    expect(result.resizeMs).toBeLessThan(15000);
    fs.writeFileSync(
      path.join(output, `${id}.json`),
      JSON.stringify({ params, ...result, hoverMs, releaseMs, heapBefore, heapRendered, heapReleased }, null, 2)
    );
  });
}

test('multiple raw residual charts retain private statistics through update and release', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('/__tests__/browser/page.html');
  const result = await page.evaluate(async () => {
    const w = window as any,
      charts: any[] = [],
      stats: any[] = [],
      started = performance.now();
    w.VChartStatPlots.registerStatPlots();
    for (let i = 0; i < 4; i++) {
      const data = Array.from({ length: 10000 }, (_, j) => ({ x: j / 1000, y: j / 1000 + Math.sin(j * 1.7) }));
      const spec = {
        type: 'residualPlot',
        input: 'observations',
        data,
        regression: { method: i % 2 ? 'polynomial' : 'linear', ...(i % 2 ? { degree: 2 } : {}) }
      };
      const host = document.createElement('div');
      host.id = `regression-${i}`;
      host.style.cssText = 'width:400px;height:300px';
      document.body.appendChild(host);
      const start = performance.now(),
        compiled = w.VChartStatPlots.compileStatPlot(spec);
      const compileMs = performance.now() - start;
      data.forEach(row => {
        Object.defineProperty(row, 'y', {
          get() {
            throw new Error('lifecycle recomputed residual');
          }
        });
      });
      const chart = new w.VChart.default(compiled, { dom: host.id, animation: false, autoFit: false });
      await chart.renderAsync();
      charts.push(chart);
      await chart.resize(320, 240);
      await chart.updateSpec({ ...compiled, title: { visible: true, text: '只改显示' } });
      stats.push({ compileMs, points: chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics().length });
    }
    charts.forEach(chart => chart.release());
    return { stats, elapsed: performance.now() - started, canvases: document.querySelectorAll('canvas').length };
  });
  expect(result.stats.map((s: any) => s.points)).toEqual([10000, 10000, 10000, 10000]);
  expect(result.canvases).toBe(0);
  fs.writeFileSync(path.join(output, 'multiple-residuals.json'), JSON.stringify(result, null, 2));
});
