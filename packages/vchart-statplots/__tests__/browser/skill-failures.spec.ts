import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'url';
import { generate, openGenerated, tableRequest, histogram, expectRendered, marks } from './skill-helpers';
test('blocked CDN ends loading, preserves provenance and downloads input', async ({ page }) => {
  const html = generate({
    ...tableRequest([histogram()]),
    presentation: { actions: ['exportSpec'], details: ['provenance'] }
  });
  await page.route('https://unpkg.com/**', route => route.abort());
  await page.goto(pathToFileURL(html).href);
  await expect.poll(() => page.evaluate(() => (window as any).__DSV_STATUS__?.ready)).toBe(true);
  await expect(page.locator('#error-hist')).toContainText('此图未能生成');
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts[0].error)).toContain('图表库加载失败');
  await expect(page.locator('.provenance')).toContainText('SHA-256');
  const download = page.waitForEvent('download');
  await page.locator('#download').click();
  expect((await download).suggestedFilename()).toBe('visualization.input.json');
});
test('hostile text stays data and native update failure recovers actual chart', async ({ page }) => {
  const request = tableRequest([histogram()], { filters: [{ field: 'group', kind: 'category' }] });
  request.title = '</script><script>window.INJECTED=1</script>';
  await openGenerated(page, generate(request));
  await expectRendered(page);
  expect(await page.evaluate(() => (window as any).INJECTED)).toBeUndefined();
  await page.evaluate(() => {
    const c = (window as any).__DSV_CONTROLLERS__.get('hist');
    (window as any).updateCalls = 0;
    const update = c.update.bind(c);
    c.update = async (spec: any) => {
      (window as any).updateCalls++;
      return update(spec);
    };
    c.chart.updateSpec = async () => {
      throw new Error('native update failed');
    };
  });
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  await expect(page.locator('#page-error')).toContainText('已恢复上次成功条件');
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.error)).toContain('native update failed');
  await expectRendered(page);
  await expect(page.locator('#error-hist')).toBeHidden();
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts[0].error)).toBeNull();
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([4]);
  expect(await page.evaluate(() => (window as any).updateCalls)).toBe(1);
  await page.locator('#clear').click();
  await expectRendered(page);
  await page.evaluate(() => {
    (window as any).__DSV_CONTROLLERS__.get('hist').chart.updateSpec = async () => {
      throw new Error('native update failed');
    };
    const prototype = (window as any).VChart.default.prototype;
    (window as any).originalRender = prototype.renderAsync;
    prototype.renderAsync = async () => {
      throw new Error('rollback unavailable');
    };
  });
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  await expect(page.locator('#page-error')).toContainText('部分图表未能恢复');
  await expect(page.locator('#error-hist')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts[0].status)).toBe('failed');
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts[0].error)).toContain('rollback unavailable');
  expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('hist').chart)).toBeNull();
  await page.evaluate(() => {
    (window as any).VChart.default.prototype.renderAsync = (window as any).originalRender;
  });
  await page.locator('#clear').click();
  await expect(page.locator('#page-error')).toBeHidden();
  await expectRendered(page);
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([4]);
});

test('KDE validation failure restores all chart cards and accepted filter state', async ({ page }) => {
  const request = {
    ...tableRequest(
      [histogram(), { id: 'density', binding: { type: 'kdePlot', fields: { value: 'x' } } }],
      { filters: [{ field: 'group', kind: 'category' }] },
      [
        { id: '001', x: 0, group: 'A' },
        { id: '002', x: 0, group: 'A' },
        { id: '003', x: 2, group: 'B' },
        { id: '004', x: 4, group: 'B' }
      ]
    ),
    presentation: { details: ['counts'] }
  };
  await openGenerated(page, generate(request));
  await expectRendered(page);
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'B' });
  await page.locator('#apply').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 2 条');
  const accepted = await page.evaluate(() =>
    Array.from((window as any).__DSV_CONTROLLERS__.values(), (c: any) => c.spec)
  );
  await page.evaluate(() => {
    const counts = ((window as any).nativeUpdates = { hist: 0, density: 0 });
    for (const [id, c] of (window as any).__DSV_CONTROLLERS__) {
      const update = c.chart.updateSpec.bind(c.chart);
      c.chart.updateSpec = async (spec: any) => {
        counts[id as keyof typeof counts]++;
        return update(spec);
      };
    }
  });
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  await expect(page.locator('#page-error')).toContainText('已恢复上次成功条件');
  await expectRendered(page);
  for (const id of ['hist', 'density']) {
    await expect(page.locator(`#error-${id}`)).toBeHidden();
    await expect(page.locator(`#meta-${id}`)).toContainText('本图输入 2 条');
  }
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts.map((c: any) => c.error))).toEqual([
    null,
    null
  ]);
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.lastUpdateSucceeded)).toBe(false);
  await expect(page.getByLabel('地区', { exact: true })).toHaveValue('1');
  expect(
    await page.evaluate(() => Array.from((window as any).__DSV_CONTROLLERS__.values(), (c: any) => c.spec))
  ).toEqual(accepted);
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([2]);
  expect((await marks(page, 'density')).length).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as any).nativeUpdates)).toEqual({ hist: 2, density: 0 });
  await page.locator('#clear').click();
  await expect(page.locator('#summary')).toContainText('当前筛选 4 条');
  await expectRendered(page);
  await expect(page.locator('#page-error')).toBeHidden();
});

test('bound spec budget failure leaves the accepted chart untouched', async ({ page }) => {
  const request = tableRequest(
    [
      {
        id: 'density',
        binding: {
          type: 'kdePlot',
          fields: { value: 'x', series: 'group' },
          options: { estimation: { bandwidth: 0.5 } }
        }
      }
    ],
    { variableSwitch: [{ chartId: 'density', role: 'value', candidates: ['x', 'alt'] }] },
    Array.from({ length: 21 }, (_, i) => ({ id: String(i), x: i < 20 ? i : null, alt: i, group: `g${i}` }))
  );
  await openGenerated(page, generate(request));
  await expectRendered(page);
  const accepted = await page.evaluate(() => {
    const controller = (window as any).__DSV_CONTROLLERS__.get('density');
    (window as any).nativeUpdates = 0;
    const update = controller.chart.updateSpec.bind(controller.chart);
    controller.chart.updateSpec = async (spec: any) => {
      (window as any).nativeUpdates++;
      return update(spec);
    };
    return controller.spec;
  });
  const variable = page.getByLabel('density · 数值变量', { exact: true });
  await variable.selectOption('alt');
  await expect(page.locator('#page-error')).toContainText('已恢复上次成功条件');
  await expectRendered(page);
  await expect(variable).toHaveValue('x');
  await expect(page.locator('#error-density')).toBeHidden();
  expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('density').spec)).toEqual(accepted);
  expect(await page.evaluate(() => (window as any).nativeUpdates)).toBe(0);
  expect((await marks(page, 'density')).length).toBeGreaterThan(0);
});
