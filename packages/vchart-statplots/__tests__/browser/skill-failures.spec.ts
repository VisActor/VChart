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
    c.chart.updateSpec = async () => {
      throw new Error('native update failed');
    };
  });
  await page.getByLabel('地区', { exact: true }).selectOption({ label: 'A' });
  await page.locator('#apply').click();
  await expect(page.locator('#page-error')).toContainText('已恢复上次成功条件');
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.error)).toContain('native update failed');
  expect((await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([4]);
  await page.locator('#clear').click();
  await expectRendered(page);
});
