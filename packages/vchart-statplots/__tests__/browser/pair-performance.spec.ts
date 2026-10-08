import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
for (const variables of [4, 8]) {
  for (const observations of [1000, 10000]) {
    test(`pairPlot performance ${variables} variables ${observations} observations`, async ({ page }) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width: 1280, height: 1080 });
      await page.goto('/__tests__/browser/page.html');
      await page.locator('#statplot-mount').evaluate((element: HTMLElement) => {
        element.style.width = '1200px';
        element.style.height = '1000px';
      });
      const timing = await page.evaluate(
        async ({ variables, observations }) => {
          const names = Array.from({ length: variables }, (_, i) => `v${i + 1}`);
          const rows = Array.from({ length: observations }, (_, i) => ({
            id: String(i),
            values: Object.fromEntries(names.map((name, j) => [name, ((i * (j * 2 + 1)) % 997) / 997]))
          }));
          const diagonal = names.map(variable => ({
            variable,
            bins: [
              { binStart: 0, binEnd: 0.5, count: rows.filter(row => row.values[variable] < 0.5).length },
              { binStart: 0.5, binEnd: 1, count: rows.filter(row => row.values[variable] >= 0.5).length }
            ]
          }));
          const spec = { type: 'pairPlot', variables: names, data: { observations: rows, diagonal } };
          let start = performance.now();
          const compiled = (window as any).VChartStatPlots.compileStatPlot(spec);
          const compileMs = performance.now() - start;
          (window as any).VChartStatPlots.registerStatPlots();
          const chart = new (window as any).VChart.default(compiled, {
            dom: 'statplot-mount',
            width: 1200,
            height: 1000,
            autoFit: false,
            animation: false
          });
          (window as any).chart = chart;
          start = performance.now();
          await chart.renderAsync();
          const renderMs = performance.now() - start;
          start = performance.now();
          await chart.updateSpec(
            (window as any).VChartStatPlots.compileStatPlot({
              ...spec,
              data: { ...spec.data, observations: rows.slice().reverse() }
            })
          );
          const updateMs = performance.now() - start;
          // 等待更新后的组件完成绘制与事件绑定，再开始真实指针交互。
          // 否则尚未完成的帧可能在拖拽中途重新绑定 brush 事件。
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          const series = chart
            .getChart()
            .getAllSeries()
            .find((s: any) => s.userId === 'scatter-0-1');
          const point = series
            .getSeriesMark()
            .getGraphics()
            .find((g: any) => g.context.data[0].id === '500');
          const b = point.globalAABBBounds;
          (window as any).brushDone = false;
          chart.on('brushEnd', () => {
            (window as any).brushDone = true;
          });
          return {
            variables,
            observations,
            panels: variables * variables,
            points: variables * (variables - 1) * observations,
            compileMs,
            renderMs,
            updateMs,
            target: { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 }
          };
        },
        { variables, observations }
      );
      const start = Date.now();
      await page.mouse.move(timing.target.x - 5, timing.target.y - 5);
      await page.mouse.down();
      await page.mouse.move(timing.target.x + 5, timing.target.y + 5, { steps: 3 });
      await page.mouse.up();
      await page.waitForFunction(() => (window as any).brushDone, undefined, { timeout: 5000 });
      const brushRoundTripMs = Date.now() - start;
      await page.evaluate(() => (window as any).chart.release());
      await expect(page.locator('canvas')).toHaveCount(0);
      fs.writeFileSync(
        path.resolve(__dirname, `../../../../.vchart-statplots/pair-performance-${variables}-${observations}.json`),
        JSON.stringify({ ...timing, brushRoundTripMs }, null, 2) + '\n'
      );
    });
  }
}
