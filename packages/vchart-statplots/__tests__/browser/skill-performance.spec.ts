import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { generate, openGenerated, tableRequest, histogram, expectRendered, artifacts } from './skill-helpers';

function records() {
  return Array.from({ length: 10000 }, (_, i) => ({
    id: String(i),
    x: i % 101,
    y: (i * 37) % 509,
    alt: (i * 13) % 701,
    group: i % 2 ? 'B' : 'A'
  }));
}
test('10k rows and four charts reuse instances and do not recompile on resize', async ({ page }) => {
  test.setTimeout(120000);
  const request = tableRequest(
    [
      histogram(),
      { id: 'scatter', binding: { type: 'scatterPlot', fields: { x: 'x', y: 'y' } } },
      { id: 'hex', binding: { type: 'hexbinPlot', fields: { x: 'x', y: 'y' } } },
      { id: 'correlation', binding: { type: 'correlationMatrix', fields: { variables: ['x', 'y', 'alt'] } } }
    ],
    { filters: [{ field: 'group', kind: 'category' }] },
    records()
  );
  const html = generate(request);
  const timings: any = {};
  let start = Date.now();
  await openGenerated(page, html);
  await expectRendered(page);
  timings.firstRenderMs = Date.now() - start;
  await page.evaluate(() => {
    (window as any).initialCharts = Array.from((window as any).__DSV_CONTROLLERS__.values(), (c: any) => c.chart);
    const plots = (window as any).VChartStatPlots;
    const compile = plots.compileStatPlot;
    (window as any).compileCalls = 0;
    plots.compileStatPlot = (spec: any) => {
      (window as any).compileCalls++;
      return compile(spec);
    };
  });
  start = Date.now();
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 5000 条');
  await expectRendered(page);
  timings.filterMs = Date.now() - start;
  start = Date.now();
  await page.locator('#theme').click();
  await expect(page.locator('body')).toHaveClass('dark');
  timings.themeMs = Date.now() - start;
  expect(
    await page.evaluate(() =>
      (window as any).initialCharts.every(
        (chart: unknown, i: number) =>
          chart ===
          Array.from(
            (window as any).__DSV_CONTROLLERS__.values(),
            (controller: { chart: unknown }) => controller.chart
          )[i]
      )
    )
  ).toBe(true);
  const calls = await page.evaluate(() => (window as any).compileCalls);
  expect(calls).toBe(8);
  start = Date.now();
  await page.setViewportSize({ width: 720, height: 800 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  timings.resizeMs = Date.now() - start;
  await page.mouse.move(5, 5);
  expect(await page.evaluate(() => (window as any).compileCalls)).toBe(calls);
  start = Date.now();
  await page.evaluate(async () => {
    await Promise.all(Array.from((window as any).__DSV_CONTROLLERS__.values(), (c: any) => c.release()));
  });
  timings.releaseMs = Date.now() - start;
  await expect(page.locator('canvas')).toHaveCount(0);
  timings.memory = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize ?? null);
  fs.writeFileSync(path.join(artifacts, 'four-chart-performance.json'), JSON.stringify(timings, null, 2));
});

test('4-variable pairPlot displays 10k rows at the declared point budget', async ({ page }) => {
  test.setTimeout(120000);
  const rows = records().map(row => ({ ...row, z: row.x + row.y }));
  const request = tableRequest(
    [{ id: 'pair', binding: { type: 'pairPlot', fields: { variables: ['x', 'y', 'alt', 'z'] } } }],
    {},
    rows
  );
  request.dataset.columns.push({ name: 'z', type: 'number' } as any);
  const start = Date.now();
  await openGenerated(page, generate(request));
  await expectRendered(page);
  const result = await page.evaluate(() => {
    const c = (window as any).__DSV_CONTROLLERS__.get('pair').chart;
    return {
      inputN: (window as any).__DSV_STATUS__.charts[0].inputN,
      pointCount: c
        .getChart()
        .getAllSeries()
        .filter((s: any) => s.userId.startsWith('scatter-'))
        .reduce((n: number, s: any) => n + s.getSeriesMark().getGraphics().length, 0)
    };
  });
  expect(result.inputN).toBe(10000);
  expect(result.pointCount).toBe(120000);
  fs.writeFileSync(
    path.join(artifacts, 'pair-performance.json'),
    JSON.stringify({ ...result, firstRenderMs: Date.now() - start }, null, 2)
  );
});
