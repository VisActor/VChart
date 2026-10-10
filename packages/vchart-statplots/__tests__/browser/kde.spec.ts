import { test, expect } from '@playwright/test';
import type { KdePlotSpec } from '../../src/types';
import {
  renderDistribution,
  readDistribution,
  updateDistribution,
  screenshotDistribution
} from './distribution-helpers';

const example: KdePlotSpec = {
  type: 'kdePlot',
  data: [0, 0, 0].map(value => ({ value })),
  estimation: { bandwidth: 1 },
  sampling: { points: 33 },
  fieldLabels: { value: '时长', density: '概率密度' }
};

test('KDE renders Gaussian tails and real density hover, bandwidth updates change geometry', async ({ page }, info) => {
  await renderDistribution(page, example);
  const before = await readDistribution(page);
  expect(before.errors).toEqual([]);
  expect(before.xDomain).toEqual([-3, 3]);
  expect(before.lines[0].curveType).toBe('linear');
  expect(before.lines[0].points).toHaveLength(33);
  expect(before.rows[16].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
  expect(before.rows[0].density).toBeGreaterThan(0);
  const peak = before.lines[0].points[16];
  await page.mouse.move(peak.globalX, peak.globalY);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('概率密度');
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(1)).toHaveText(
    String(before.rows[16].density)
  );
  await screenshotDistribution(page, 'kde-gaussian', info.repeatEachIndex);
  // 同时修改样本位置与带宽；真实峰值位置和轴域都须变化。
  await updateDistribution(page, {
    ...example,
    data: [1, 1, 2].map(value => ({ value })),
    estimation: { bandwidth: 0.5 }
  });
  const after = await readDistribution(page);
  expect(after.sameInstance).toBe(true);
  expect(after.xDomain).toEqual([-0.5, 3.5]);
  expect(after.rows[16].density).toBeCloseTo(2 * Math.exp(-0.5) * before.rows[16].density!, 12);
  expect(after.lines[0].points[0].y).not.toBe(before.lines[0].points[0].y);
  await page.mouse.move(after.lines[0].points[16].globalX, after.lines[0].points[16].globalY);
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(1)).toHaveText(
    String(after.rows[16].density)
  );
});

test('kernel and sampling updates affect real curves, resize and empty transitions preserve meaning', async ({
  page
}, info) => {
  await renderDistribution(page, example);
  const gaussian = await readDistribution(page);
  await updateDistribution(page, { ...example, estimation: { bandwidth: 1, kernel: 'epanechnikov' } });
  const compact = await readDistribution(page);
  expect(compact.xDomain).toEqual([-1, 1]);
  expect(compact.rows[16].density).toBe(0.75);
  expect(compact.rows[0].density).toBe(0);
  expect(compact.rows[32].density).toBe(0);
  expect(compact.lines[0].points[0].y).toBeGreaterThan(gaussian.lines[0].points[0].y);
  await screenshotDistribution(page, 'kde-epanechnikov', info.repeatEachIndex);
  await updateDistribution(page, { ...example, sampling: { points: 65 } });
  const fine = await readDistribution(page);
  expect(fine.lines[0].points).toHaveLength(65);
  expect(fine.rows[32].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
  await page.evaluate(async () => {
    await (window as any).chart.resize(420, 320);
  });
  expect((await readDistribution(page)).rows).toEqual(fine.rows);
  await updateDistribution(page, { ...example, data: [] });
  expect((await readDistribution(page)).rows).toEqual([]);
  await updateDistribution(page, example);
  expect((await readDistribution(page)).sameInstance).toBe(true);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('grouped density uses per-series sample size and keeps legends and colors across themes', async ({
  page
}, info) => {
  const spec: KdePlotSpec = {
    ...example,
    normalizationScope: 'series',
    colors: { categorical: ['#bb4422', '#3366aa'] },
    data: [
      { series: 'B', value: 0 },
      { series: 'A', value: 2 },
      { series: 'B', value: 0 },
      { series: 'B', value: 0 }
    ]
  };
  await renderDistribution(page, spec);
  for (const theme of ['light', 'dark'] as const) {
    await updateDistribution(page, { ...spec, theme });
    const result = await readDistribution(page);
    expect(result.legends).toEqual(['B', 'A']);
    expect(result.lines.map(line => line.stroke)).toEqual(['#bb4422', '#3366aa']);
    expect(result.rows[16].density).toBeCloseTo(result.rows[49].density!, 12);
    await screenshotDistribution(page, `kde-${theme}`, info.repeatEachIndex);
  }
  await updateDistribution(page, example);
  expect((await readDistribution(page)).legends).toEqual([]);
  expect((await readDistribution(page)).lines).toHaveLength(1);
});

test('default sample weighting and bandwidth adjustment update density and tooltip without changing instance', async ({
  page
}) => {
  const spec: KdePlotSpec = {
    ...example,
    data: [{ value: 0, series: 'A' }, ...Array.from({ length: 4 }, () => ({ value: 4, series: 'B' }))]
  };
  await renderDistribution(page, spec);
  const all = await readDistribution(page);
  expect(all.rows[16].density! / all.rows[49].density!).toBeCloseTo(0.25, 12);
  const peak = all.lines[0].points[16];
  await page.mouse.move(peak.globalX, peak.globalY);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('样本数');
  await expect(page.locator('.vchart-tooltip-element')).toContainText('实际带宽');
  await updateDistribution(page, { ...spec, normalizationScope: 'series' });
  const own = await readDistribution(page);
  expect(own.sameInstance).toBe(true);
  expect(own.rows[16].density).toBeCloseTo(own.rows[49].density!, 12);
  expect(
    await page.evaluate(
      spec => (window as any).VChartStatPlots.validateStatPlot({ ...spec, sampling: { cut: 0 } }).valid,
      spec
    )
  ).toBe(false);
  await updateDistribution(page, {
    ...spec,
    normalizationScope: 'series',
    estimation: { bandwidth: 1, bandwidthAdjust: 2 },
    sampling: { points: 33, cut: 1 }
  });
  const adjusted = await readDistribution(page);
  expect(adjusted.xDomain).toEqual([-2, 6]);
  expect(adjusted.rows[16].density).toBeCloseTo(own.rows[16].density! / 2, 12);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
