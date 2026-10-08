import { test, expect } from '@playwright/test';
test('ESM consumer registers against its own VChart engine', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/__tests__/browser/esm.html');
  await page.waitForFunction(() => (window as any).esmReady);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        (window as any).esmChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics()[0].attribute.points.length
    )
  ).toBe(3);
  await page.evaluate(() => (window as any).esmChart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
