import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { generate, openGenerated, tableRequest, histogram, expectRendered, marks, artifacts } from './skill-helpers';

test('generated HTML filters real counts, retains instance, hovers and exports current data', async ({ page }) => {
  const html = generate(tableRequest([histogram()], { filters: [{ field: 'group', kind: 'category' }] }));
  await openGenerated(page, html);
  await expectRendered(page);
  await page.evaluate(() => {
    (window as any).original = (window as any).__DSV_CONTROLLERS__.get('hist').chart;
  });
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([4]);
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.getByRole('button', { name: '应用筛选' }).click();
  await expect(page.locator('#summary')).toContainText('当前筛选 2 条');
  await expectRendered(page);
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([2]);
  const target = (await marks(page, 'hist'))[0];
  await page.mouse.move(target.x, target.y);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('数量');
  expect((await page.locator('.vchart-tooltip-element').innerText()).trim()).toMatch(/2$/);
  expect(
    await page.evaluate(() => (window as any).original === (window as any).__DSV_CONTROLLERS__.get('hist').chart)
  ).toBe(true);
  const jsonDownload = page.waitForEvent('download');
  await page.locator('#download').click();
  const downloaded = await jsonDownload;
  const specs = JSON.parse(fs.readFileSync((await downloaded.path())!, 'utf8'));
  expect(specs[0].data.map((r: any) => r.value)).toEqual([0, 1]);
  await page.getByRole('button', { name: '切换主题' }).click();
  await expect(page.locator('body')).toHaveClass('dark');
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([2]);
  const png = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 PNG' }).click();
  expect((await png).suggestedFilename()).toMatch(/\.png$/);
  await page.getByRole('button', { name: '清空筛选' }).click();
  await expect(page.locator('#summary')).toContainText('当前筛选 4 条');
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([4]);
});

test('range, variables and parameters rebuild data, labels and statistics', async ({ page }) => {
  const request = tableRequest([histogram()], {
    filters: [{ field: 'x', kind: 'range' }],
    variableSwitch: [{ chartId: 'hist', role: 'value', candidates: ['x', 'alt'] }],
    parameters: [{ chartId: 'hist', path: 'binning.binCount', values: [1, 2] }]
  });
  await openGenerated(page, generate(request));
  await page.getByLabel('年龄 下界').fill('0');
  await page.getByLabel('年龄 上界').fill('1');
  await page.locator('#apply').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 2 条');
  await page.getByLabel('指标分布 · 数值变量', { exact: true }).selectOption('alt');
  await expect
    .poll(() => page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('hist').spec.data.map((r: any) => r.value)))
    .toEqual([10, 20]);
  expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('hist').spec.fieldLabels.value)).toBe(
    '消费（元）'
  );
  await page.getByLabel('指标分布 · 分箱数', { exact: true }).selectOption('2');
  await expect.poll(async () => (await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([1, 1]);
  await page.getByLabel('年龄 下界').fill('100');
  await page.getByLabel('年龄 上界').fill('200');
  await page.locator('#apply').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 0 条');
  await expect(page.locator('#meta-hist')).toContainText('输入 0 条');
  await page.locator('#clear').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 4 条');
});

test('pairPlot brush links actual stable ids without compiling on hover or resize', async ({ page }) => {
  await openGenerated(
    page,
    generate(tableRequest([{ id: 'pair', binding: { type: 'pairPlot', fields: { variables: ['x', 'y'] } } }]))
  );
  await page.evaluate(() => {
    const p = (window as any).VChartStatPlots;
    const original = p.compileStatPlot;
    (window as any).compileCalls = 0;
    p.compileStatPlot = (spec: any) => {
      (window as any).compileCalls++;
      return original(spec);
    };
  });
  await page.locator('#dsv-pair canvas').scrollIntoViewIfNeeded();
  const target = await page.evaluate(() => {
    const s = (window as any).__DSV_CONTROLLERS__
      .get('pair')
      .chart.getChart()
      .getAllSeries()
      .find((s: any) => s.userId === 'scatter-0-1');
    const g = s
      .getSeriesMark()
      .getGraphics()
      .find((g: any) => g.context.data[0].id === '002');
    const b = g.globalAABBBounds;
    const canvas = document.querySelector('#dsv-pair canvas')!.getBoundingClientRect();
    return { x: canvas.x + (b.x1 + b.x2) / 2, y: canvas.y + (b.y1 + b.y2) / 2 };
  });
  await page.mouse.move(target.x - 5, target.y - 5);
  await page.mouse.down();
  await page.mouse.move(target.x + 5, target.y + 5, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(async () =>
      (await marks(page, 'pair')).filter((g: any) => g.states?.includes('inBrush')).map((g: any) => g.datum.id)
    )
    .toEqual(['002', '002']);
  await page.setViewportSize({ width: 720, height: 700 });
  await page.mouse.move(5, 5);
  expect(await page.evaluate(() => (window as any).compileCalls)).toBe(0);
  await expect(page.locator('.caption')).toContainText('图例为颜色说明');
});

test('compile failure rolls back an already updated chart and restores filter controls', async ({ page }) => {
  const violin = { id: 'violin', binding: { type: 'violinPlot', fields: { category: 'group', value: 'x' } } };
  await openGenerated(
    page,
    generate(tableRequest([histogram(), violin], { filters: [{ field: 'x', kind: 'range' }] }))
  );
  await expectRendered(page);
  await page.getByLabel('年龄 上界').fill('0');
  await page.locator('#apply').click();
  await expect(page.locator('#page-error')).toContainText('已恢复上次成功条件');
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([4]);
  await expect(page.getByLabel('年龄 上界')).toHaveValue('');
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.filteredN)).toBe(4);
  await page.locator('#clear').click();
  await expectRendered(page);
  await expect(page.locator('#page-error')).toBeEmpty();
});

test('filtering recomputes correlation coefficient and pairwise denominator', async ({ page }) => {
  const correlation = { id: 'cor', binding: { type: 'correlationMatrix', fields: { variables: ['x', 'y'] } } };
  await openGenerated(page, generate(tableRequest([correlation], { filters: [{ field: 'group', kind: 'category' }] })));
  const before = (await marks(page, 'cor')).find((g: any) => g.datum.row === 'x' && g.datum.column === 'y')!.datum;
  expect(before.sampleCount).toBe(4);
  expect(before.correlation).toBeCloseTo(19 / 35, 12);
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 2 条');
  const after = (await marks(page, 'cor')).find((g: any) => g.datum.row === 'x' && g.datum.column === 'y')!.datum;
  expect(after.sampleCount).toBe(2);
  expect(after.correlation).toBeCloseTo(1, 12);
});

test('external results keep their independent scope and mobile layout confines tooltip', async ({ page }) => {
  const ext = {
    id: 'external',
    source: { label: '已计算的结果' },
    spec: {
      type: 'embeddingPlot',
      method: 'umap',
      dimensions: { x: { name: 'UMAP 1' }, y: { name: 'UMAP 2' } },
      data: [
        { id: 'a', x: 0, y: 0 },
        { id: 'b', x: 1, y: 1 }
      ]
    }
  };
  await page.setViewportSize({ width: 420, height: 800 });
  await openGenerated(
    page,
    generate(tableRequest([histogram(), ext], { filters: [{ field: 'group', kind: 'category' }] }))
  );
  await expectRendered(page);
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('external').spec.data.length)).toBe(2);
  await expect(page.locator('[data-chart="external"] .scope')).toContainText('不随表格筛选');
  const target = (await marks(page, 'hist'))[0];
  await page.mouse.move(target.x, target.y);
  await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
  const box = await page.locator('.vchart-tooltip-element').boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(421);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  fs.mkdirSync(path.join(artifacts, 'screenshots'), { recursive: true });
  await page.screenshot({ path: path.join(artifacts, 'screenshots/mobile.png'), fullPage: true });
});
