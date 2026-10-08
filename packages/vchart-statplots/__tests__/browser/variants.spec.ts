import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const directory = path.resolve(__dirname, '../../examples/specs');
const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'index.json'), 'utf8'));
for (const item of manifest.valid) {
  test(`${item.type} ${item.variant} variant`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const spec = JSON.parse(fs.readFileSync(path.join(directory, item.file), 'utf8'));
    await page.goto('/__tests__/browser/page.html');
    await page.evaluate(async spec => {
      await (window as any).renderStatPlot(spec);
    }, spec);
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
    expect(
      await page.evaluate(() =>
        (window as any).chart
          .getChart()
          .getAllSeries()
          .some((s: any) => s.getSeriesMark().getGraphics().length > 0)
      )
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('all types render an explicit empty state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/__tests__/browser/page.html');
  for (const item of manifest.valid.filter((r: any) => r.variant === 'minimal')) {
    const spec = JSON.parse(fs.readFileSync(path.join(directory, item.file), 'utf8'));
    spec.data = spec.type === 'pairPlot' ? { observations: [] } : [];
    delete spec.metrics;
    delete spec.variableOrder;
    if (spec.fit) spec.fit.data = [];
    await page.evaluate(async spec => {
      await (window as any).renderStatPlot(spec);
    }, spec);
    expect(await page.evaluate(() => (window as any).chartErrors), item.type).toEqual([]);
    expect(
      await page.evaluate(() => {
        const nodes = (window as any).chart.getStage().findAll((g: any) => g.type === 'text', true);
        return nodes.some((g: any) => String(g.attribute.text).includes('暂无可绘制数据') && g.AABBBounds.width() > 0);
      }),
      item.type
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
