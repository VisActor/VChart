import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const resultsDirectory = path.resolve(__dirname, '../../../../.vchart-statplots/pair-diagonal');
fs.mkdirSync(resultsDirectory, { recursive: true });
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
          const spec = { type: 'pairPlot', variables: names, data: { observations: rows } };
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
          const histogramCounts = () =>
            chart
              .getChart()
              .getAllSeries()
              .filter((s: any) => s.userId.startsWith('diagonal'))
              .map((s: any) =>
                s
                  .getSeriesMark()
                  .getGraphics()
                  .map((g: any) => ({
                    binStart: g.context.data[0].binStart,
                    binEnd: g.context.data[0].binEnd,
                    count: g.context.data[0].count
                  }))
              );
          const before = histogramCounts();
          const scatterPoints = chart
            .getChart()
            .getAllSeries()
            .filter((s: any) => s.userId.startsWith('scatter'))
            .reduce((sum: number, s: any) => sum + s.getSeriesMark().getGraphics().length, 0);
          const oldValue = rows[501].values.v1;
          const nextRows = rows.map((row, i) => (i === 501 ? { ...row, values: { ...row.values, v1: 0.1 } } : row));
          start = performance.now();
          await chart.updateSpec(
            (window as any).VChartStatPlots.compileStatPlot({
              ...spec,
              data: { observations: nextRows }
            })
          );
          const updateMs = performance.now() - start;
          const after = histogramCounts();
          start = performance.now();
          await chart.resize(1100, 950);
          const resizeMs = performance.now() - start;
          const resized = histogramCounts();
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
            resizeMs,
            before,
            after,
            resized,
            oldValue,
            scatterPoints,
            target: { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 }
          };
        },
        { variables, observations }
      );
      expect(timing.scatterPoints).toBe(variables * (variables - 1) * observations);
      for (const bins of timing.before)
        expect(bins.reduce((sum: number, b: any) => sum + b.count, 0)).toBe(observations);
      expect(timing.after.slice(1)).toEqual(timing.before.slice(1));
      const expected = timing.before[0].map((bin: any, i: number, bins: any[]) => {
        const contains = (value: number) =>
          value >= bin.binStart && (value < bin.binEnd || (i === bins.length - 1 && value === bin.binEnd));
        return { ...bin, count: bin.count - Number(contains(timing.oldValue)) + Number(contains(0.1)) };
      });
      expect(timing.after[0]).toEqual(expected);
      expect(timing.after[0]).not.toEqual(timing.before[0]);
      expect(timing.resized).toEqual(timing.after);
      const start = Date.now();
      await page.mouse.move(timing.target.x - 5, timing.target.y - 5);
      await page.mouse.down();
      await page.mouse.move(timing.target.x + 5, timing.target.y + 5, { steps: 3 });
      await page.mouse.up();
      await page.waitForFunction(() => (window as any).brushDone, undefined, { timeout: 5000 });
      const brushRoundTripMs = Date.now() - start;
      const selected = await page.evaluate(() =>
        (window as any).chart
          .getChart()
          .getAllSeries()
          .filter((s: any) => ['scatter-0-1', 'scatter-1-0'].includes(s.userId))
          .map((s: any) =>
            s
              .getSeriesMark()
              .getGraphics()
              .filter((g: any) => g.hasState('inBrush'))
              .map((g: any) => g.context.data[0].id)
              .sort()
          )
      );
      expect(selected[0]).toContain('500');
      expect(selected[1]).toEqual(selected[0]);
      const releaseMs = await page.evaluate(() => {
        const start = performance.now();
        (window as any).chart.release();
        return performance.now() - start;
      });
      await expect(page.locator('canvas')).toHaveCount(0);
      fs.writeFileSync(
        path.join(resultsDirectory, `performance-${variables}-${observations}.json`),
        JSON.stringify(
          {
            variables,
            observations,
            panels: timing.panels,
            points: timing.points,
            compileMs: timing.compileMs,
            renderMs: timing.renderMs,
            updateMs: timing.updateMs,
            resizeMs: timing.resizeMs,
            releaseMs,
            brushRoundTripMs,
            binsPerVariable: timing.after.map((bins: unknown[]) => bins.length),
            countConservation: true,
            updateCounts: true,
            resizePreservesBins: true,
            brushLinksIds: true
          },
          null,
          2
        ) + '\n'
      );
    });
  }
}
