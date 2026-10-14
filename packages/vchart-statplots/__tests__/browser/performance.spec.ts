import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
test('records rendering, updates, resize and multi-chart release at useful scales', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const result = await page.evaluate(async () => {
    const measure = async (run: () => Promise<unknown> | void) => {
      const start = performance.now();
      await run();
      return performance.now() - start;
    };
    const data = Array.from({ length: 10000 }, (_, i) => ({ id: String(i), x: i / 100, y: Math.sin(i) }));
    const renderMs = await measure(() => (window as any).renderStatPlot({ type: 'scatterPlot', data }));
    const updateMs = await measure(() =>
      (window as any).chart.updateSpec(
        (window as any).VChartStatPlots.compileStatPlot({ type: 'scatterPlot', data, title: 'Updated' })
      )
    );
    const resizeMs = await measure(() => (window as any).chart.resize(600, 400));
    const exportMs = await measure(() => (window as any).chart.getDataURL());
    const releaseMs = await measure(() => (window as any).chart.release());
    const charts: any[] = [];
    const dashboardRenderMs = await measure(async () => {
      for (let i = 0; i < 20; i++) {
        const dom = document.createElement('div');
        dom.style.width = '300px';
        dom.style.height = '200px';
        document.body.appendChild(dom);
        const chart = new (window as any).VChart.default(
          (window as any).VChartStatPlots.compileStatPlot({ type: 'scatterPlot', data: data.slice(0, 1000) }),
          { dom, autoFit: false, animation: false }
        );
        await chart.renderAsync();
        charts.push(chart);
      }
    });
    const dashboardReleaseMs = await measure(() => charts.forEach(chart => chart.release()));
    return {
      scatterPoints: 10000,
      dashboardCharts: 20,
      dashboardPointsEach: 1000,
      renderMs,
      updateMs,
      resizeMs,
      exportMs,
      releaseMs,
      dashboardRenderMs,
      dashboardReleaseMs,
      remainingCanvases: document.querySelectorAll('canvas').length
    };
  });
  expect(result.remainingCanvases).toBe(0);
  fs.writeFileSync(
    path.resolve(__dirname, '../../../../.vchart-statplots/performance-browser.json'),
    JSON.stringify(result, null, 2) + '\n'
  );
});
