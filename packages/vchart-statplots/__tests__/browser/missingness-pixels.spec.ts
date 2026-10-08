import { test, expect } from '@playwright/test';
import path from 'path';

const outputDir = path.resolve(__dirname, '../../../../.vchart-statplots/missingness-pixels');
const data = Array.from({ length: 12 }, (_, r) =>
  Array.from({ length: 4 }, (_, c) => ({
    observationId: String(r + 1),
    variable: `变量${c + 1}`,
    isMissing: false
  }))
).flat();

for (const dpr of [1, 1.25, 1.5, 2, 3]) {
  test.describe(`missing-value matrix device pixel ratio ${dpr}`, () => {
    test.use({ deviceScaleFactor: dpr });
    test('uniform rows remain a solid color across non-integer band sizes and theme updates', async ({ page }) => {
      await page.goto('/__tests__/browser/page.html');
      await page.evaluate(async spec => (window as any).renderStatPlot(spec), {
        type: 'missingValueMatrix',
        colors: { categorical: ['#1264a3'] },
        data
      });
      for (const theme of ['light', 'dark']) {
        // 更新使用同一份确定性数据，避免以读取编译输出替代原始 Spec。
        await page.evaluate(
          async spec => {
            const w = window as any;
            await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
          },
          { type: 'missingValueMatrix', colors: { categorical: ['#1264a3'] }, data, theme }
        );
        for (const size of [
          [800, 601],
          [823, 599],
          [823.5, 599.25],
          [421, 359]
        ]) {
          await page.evaluate(async size => {
            await (window as any).chart.resize(size[0], size[1]);
          }, size);
          const pixels = await page.evaluate(() => {
            const w = window as any;
            const graphics = w.chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
            const column = graphics.filter((g: any) => g.context.data[0].variable === '变量1');
            const canvas = document.querySelector('canvas')!;
            const context = canvas.getContext('2d')!;
            const factor = w.chart.getStage().window.dpr;
            const first = column[0].globalAABBBounds;
            const x = Math.floor(((first.x1 + first.x2) / 2) * factor);
            const start = Math.ceil(Math.min(...column.map((g: any) => g.globalAABBBounds.y1)) * factor);
            const end = Math.floor(Math.max(...column.map((g: any) => g.globalAABBBounds.y2)) * factor);
            const rgba = context.getImageData(x, start, 1, end - start).data;
            let badRows = 0;
            let maxDelta = 0;
            for (let y = 0; y < end - start; y++) {
              const expected = [18, 100, 163, 255];
              const delta = Math.max(...expected.map((channel, i) => Math.abs(rgba[y * 4 + i] - channel)));
              if (delta > 1) {
                badRows++;
              }
              maxDelta = Math.max(maxDelta, delta);
            }
            return { badRows, maxDelta, height: end - start, factor, cells: graphics.length, errors: w.chartErrors };
          });
          expect(pixels.errors).toEqual([]);
          expect(pixels.cells).toBe(48);
          expect(pixels.height).toBeGreaterThan(100);
          expect(pixels.badRows, JSON.stringify({ theme, size, dpr, ...pixels })).toBe(0);
          await page.screenshot({
            path: path.join(outputDir, `${theme}-${dpr}-${size[0]}.png`),
            clip: { x: 0, y: 0, width: size[0], height: size[1] }
          });
        }
      }
    });
    test('dense observed and missing runs keep their exact colors across row boundaries', async ({ page }) => {
      await page.goto('/__tests__/browser/page.html');
      const dense = Array.from({ length: 300 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => ({
          observationId: String(r + 1),
          variable: `变量${c + 1}`,
          isMissing: r % 5 < 2
        }))
      ).flat();
      for (const theme of ['light', 'dark']) {
        await page.evaluate(async spec => (window as any).renderStatPlot(spec), {
          type: 'missingValueMatrix',
          data: dense,
          theme
        });
        await page.evaluate(async () => {
          await (window as any).chart.resize(823, 599);
        });
        const pixels = await page.evaluate(() => {
          const w = window as any;
          const graphics = w.chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
          const column = graphics.filter((g: any) => g.context.data[0].variable === '变量1');
          const canvas = document.querySelector('canvas')!;
          const context = canvas.getContext('2d')!;
          const factor = w.chart.getStage().window.dpr;
          const first = column[0].globalAABBBounds;
          const x = Math.floor(((first.x1 + first.x2) / 2) * factor);
          let badRows = 0;
          let paintedPixels = 0;
          for (const g of column) {
            const b = g.globalAABBBounds;
            const top = Math.round(b.y1 * factor);
            const bottom = Math.round(b.y2 * factor);
            if (bottom === top) {
              continue;
            }
            const expected = [1, 3, 5].map(i => parseInt(g.attribute.fill.slice(i, i + 2), 16));
            const rgba = context.getImageData(x, top, 1, bottom - top).data;
            for (let y = 0; y < bottom - top; y++) {
              const delta = Math.max(...expected.map((channel, i) => Math.abs(rgba[y * 4 + i] - channel)));
              if (delta > 1 || rgba[y * 4 + 3] !== 255) {
                badRows++;
              }
              paintedPixels++;
            }
          }
          return { badRows, paintedPixels, cells: graphics.length, errors: w.chartErrors };
        });
        expect(pixels.errors).toEqual([]);
        expect(pixels.cells).toBe(1200);
        expect(pixels.paintedPixels).toBeGreaterThan(400);
        expect(pixels.badRows, JSON.stringify({ theme, dpr, ...pixels })).toBe(0);
        await page.screenshot({
          path: path.join(outputDir, `dense-${theme}-${dpr}.png`),
          clip: { x: 0, y: 0, width: 823, height: 599 }
        });
      }
    });
  });
}
