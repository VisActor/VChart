import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
for (const type of [
  'countPlot',
  'missingValueMatrix',
  'stripPlot',
  'pairedComparisonPlot',
  'scatterPlot',
  'confusionMatrix',
  'precisionRecallCurve',
  'calibrationCurve',
  'timeSeriesPlot',
  'seasonalPlot',
  'autocorrelationPlot',
  'screePlot',
  'embeddingPlot',
  'residualPlot',
  'qqPlot',
  'learningCurve',
  'featureImportancePlot',
  'hexbinPlot',
  'shapBeeswarmPlot',
  'pairPlot'
]) {
  test(`${type} renders, updates and releases`, async ({ page }, testInfo) => {
    const spec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/__tests__/browser/page.html');
    await page.evaluate(async spec => {
      await (window as any).renderStatPlot(spec);
    }, spec);
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
    const graphics = await page.evaluate(() =>
      (window as any).chart
        .getChart()
        .getAllSeries()
        .flatMap((s: any) =>
          s.getMarks().flatMap((m: any) =>
            m.getGraphics().map((g: any) => ({
              name: m.name,
              width: g.AABBBounds.width(),
              height: g.AABBBounds.height(),
              x: g.attribute.x,
              y: g.attribute.y
            }))
          )
        )
    );
    expect(
      graphics.some((g: any) => Number.isFinite(g.width) && g.width > 0 && Number.isFinite(g.height) && g.height > 0)
    ).toBe(true);
    if (type === 'stripPlot') {
      const points = graphics.filter((g: any) => g.name === 'point');
      expect(points).toHaveLength(spec.data.length);
      expect(new Set(points.map((g: any) => g.x)).size).toBeGreaterThan(4);
    }
    await testInfo.attach(type, {
      body: await page.screenshot({
        path: path.resolve(__dirname, '../../../../.vchart-statplots/screenshots', `${type}.png`)
      }),
      contentType: 'image/png'
    });
    await page.evaluate(async spec => {
      await (window as any).chart.updateSpec(
        (window as any).VChartStatPlots.compileStatPlot({ ...spec, theme: 'dark' })
      );
      await (window as any).chart.resize(480, 360);
    }, spec);
    await page.screenshot({
      path: path.resolve(__dirname, '../../../../.vchart-statplots/screenshots', `${type}-dark-compact.png`)
    });
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
    await page.evaluate(() => (window as any).chart.release());
    await expect(page.locator('canvas')).toHaveCount(0);
  });
}
