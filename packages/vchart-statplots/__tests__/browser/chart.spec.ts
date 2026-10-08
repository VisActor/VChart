import { test, expect } from '@playwright/test';
import path from 'path';
import roc from '../../examples/specs/rocCurve.json';

test('roc renders curves, responds to updates and resizes', async ({ page }, testInfo) => {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    await (window as any).renderStatPlot(spec);
  }, roc);
  expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
  const lines = await page.evaluate(() => {
    const chart = (window as any).chart;
    return chart
      .getChart()
      .getAllSeries()[0]
      .getMarkInName('line')
      .getGraphics()
      .map((graphic: any) => ({
        points: graphic.attribute.points.map((p: any) => ({ x: p.x, y: p.y })),
        width: graphic.AABBBounds.width(),
        height: graphic.AABBBounds.height()
      }));
  });
  expect(lines).toHaveLength(2);
  for (const line of lines) {
    expect(line.points).toHaveLength(4);
    expect(line.width).toBeGreaterThan(100);
    expect(line.height).toBeGreaterThan(100);
  }
  await testInfo.attach('rocCurve', {
    body: await page.screenshot({ path: path.resolve(__dirname, '../../../../.vchart-statplots/screenshots/roc.png') }),
    contentType: 'image/png'
  });
  await page.evaluate(async () => {
    const w = window as any;
    await w.chart.updateSpec(
      w.VChartStatPlots.compileStatPlot({
        type: 'rocCurve',
        data: [
          { fpr: 0, tpr: 0 },
          { fpr: 1, tpr: 1 }
        ]
      })
    );
    await w.chart.resize(420, 320);
  });
  expect(
    await page.evaluate(
      () => (window as any).chart.getChart().getAllSeries()[0].getMarkInName('line').getGraphics().length
    )
  ).toBe(1);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
