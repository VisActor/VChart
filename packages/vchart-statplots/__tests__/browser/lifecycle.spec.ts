import { test, expect } from '@playwright/test';
import violin from '../../examples/specs/violinPlot.json';

test('50 updates keep custom geometry, tooltip and one event subscription; release removes the canvas', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    const w = window as any;
    await w.renderStatPlot(spec);
    w.clicks = 0;
    w.chart.on('click', () => w.clicks++);
    for (let i = 0; i < 50; i++) {
      await w.chart.updateSpec(
        w.VChartStatPlots.compileStatPlot({
          ...spec,
          title: `Update ${i}`,
          data: spec.data.map(row => ({ ...row, value: row.value * (1 + i / 100) }))
        })
      );
    }
    await w.chart.resize(420, 320);
  }, violin);
  const target = await page.evaluate(() => {
    const graphics = (window as any).chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
    const b = graphics[0].globalAABBBounds;
    return { count: graphics.length, x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  expect(target.count).toBe(4);
  await page.mouse.click(target.x, target.y);
  await expect.poll(() => page.evaluate(() => (window as any).clicks)).toBe(1);
  await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.mouse.click(target.x, target.y);
  expect(await page.evaluate(() => (window as any).clicks)).toBe(1);
});
