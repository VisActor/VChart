import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

for (const type of [
  'histogram',
  'kdePlot',
  'ecdfPlot',
  'boxPlot',
  'pointIntervalPlot',
  'correlationMatrix',
  'violinPlot'
]) {
  test(`${type} renders semantic geometry and resizes`, async ({ page }, testInfo) => {
    const spec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
    await page.goto('/__tests__/browser/page.html');
    await page.evaluate(async spec => {
      await (window as any).renderStatPlot(spec);
    }, spec);
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
    const geometry = await page.evaluate(() =>
      (window as any).chart
        .getChart()
        .getAllSeries()
        .flatMap((series: any) =>
          series.getMarks().flatMap((mark: any) =>
            mark.getGraphics().map((g: any) => ({
              name: mark.name,
              type: g.type,
              points: g.attribute.points,
              x: g.attribute.x,
              y: g.attribute.y,
              width: g.AABBBounds.width(),
              height: g.AABBBounds.height(),
              barHeight: Math.abs(g.attribute.y1 - g.attribute.y),
              fill: g.attribute.fill
            }))
          )
        )
    );
    expect(geometry.some((g: any) => Number.isFinite(g.width) && g.width > 10 && g.height > 10)).toBe(true);
    if (type === 'histogram') {
      const bars = geometry.filter((g: any) => g.name === 'bar');
      expect(bars).toHaveLength(2);
      expect(bars[1].width / bars[0].width).toBeCloseTo(1, 5);
      expect(bars[0].barHeight / bars[1].barHeight).toBeCloseTo(2 / 3, 5);
    }
    if (type === 'violinPlot') {
      const areas = geometry.filter((g: any) => g.name === 'area');
      expect(areas).toHaveLength(4);
      for (const area of areas) {
        expect(area.points).toHaveLength(spec.sampling?.points ?? 256);
        const center = (area.points[0].x + area.points[0].x1) / 2;
        for (const point of area.points) {
          expect((point.x + point.x1) / 2).toBeCloseTo(center, 5);
          expect(point.y).toBeCloseTo(point.y1, 5);
        }
      }
    }
    if (type === 'correlationMatrix') {
      const cells = geometry.filter((g: any) => g.name === 'cell');
      expect(cells).toHaveLength(6);
      const missingColor = await page.evaluate(() => {
        const { ThemeManager, queryColorFromColorScheme } = (window as any).VChart;
        return queryColorFromColorScheme(ThemeManager.getTheme('light').colorScheme, {
          type: 'palette',
          key: 'disableFontColor'
        });
      });
      expect(cells.filter((g: any) => g.fill === missingColor)).toHaveLength(3);
    }
    await testInfo.attach(type, {
      body: await page.screenshot({
        path: path.resolve(__dirname, '../../../../.vchart-statplots/screenshots', `${type}.png`)
      }),
      contentType: 'image/png'
    });
    await page.evaluate(async () => {
      await (window as any).chart.resize(420, 320);
    });
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
    await testInfo.attach(`${type}-compact`, {
      body: await page.screenshot({
        path: path.resolve(__dirname, '../../../../.vchart-statplots/screenshots', `${type}-compact.png`)
      }),
      contentType: 'image/png'
    });
    await page.evaluate(() => (window as any).chart.release());
    await expect(page.locator('canvas')).toHaveCount(0);
  });
}
