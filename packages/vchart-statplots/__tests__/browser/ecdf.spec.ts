import { test, expect } from '@playwright/test';
import type { EcdfPlotSpec } from '../../src/types';
import {
  renderDistribution,
  readDistribution,
  updateDistribution,
  screenshotDistribution
} from './distribution-helpers';

const example: EcdfPlotSpec = {
  type: 'ecdfPlot',
  data: [4, 1, 0, 1].map(value => ({ value })),
  fieldLabels: { value: '时长', cumulativeProbability: '完成比例' }
};

test('exact ECDF jumps and tails render as a right-continuous step with real hover', async ({ page }, info) => {
  await renderDistribution(page, example);
  const result = await readDistribution(page);
  expect(result.errors).toEqual([]);
  expect(result.xDomain).toEqual([-0.2, 4.2]);
  expect(result.yDomain).toEqual([0, 1]);
  expect(result.labels).toEqual(['时长', '完成比例']);
  expect(result.rows.map(row => [row.value, row.cumulativeProbability])).toEqual([
    [-0.2, 0],
    [0, 0.25],
    [1, 0.75],
    [4, 1],
    [4.2, 1]
  ]);
  const line = result.lines[0];
  expect(line.curveType).toBe('stepAfter');
  expect(line.points).toHaveLength(5);
  expect((line.points[2].x - line.points[1].x) / (line.points[3].x - line.points[1].x)).toBeCloseTo(0.25, 8);
  expect(line.points[1].y - line.points[2].y).toBeCloseTo((line.points[0].y - line.points[3].y) * 0.5, 8);
  expect(line.points[3].y).toBe(line.points[4].y);
  await page.mouse.move(line.points[2].globalX, line.points[2].globalY);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('完成比例');
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(1)).toHaveText('0.75');
  await screenshotDistribution(page, 'ecdf-jumps', info.repeatEachIndex);
});

test('same-instance updates change real jump height and preserve constant and empty meanings', async ({
  page
}, info) => {
  await renderDistribution(page, example);
  const before = await readDistribution(page);
  await updateDistribution(page, { ...example, data: [0, 1, 4, 4].map(value => ({ value })) });
  const after = await readDistribution(page);
  expect(after.sameInstance).toBe(true);
  expect(after.rows[2].cumulativeProbability).toBe(0.5);
  expect(after.lines[0].points[2].y).toBeGreaterThan(before.lines[0].points[2].y);
  await page.mouse.move(after.lines[0].points[2].globalX, after.lines[0].points[2].globalY);
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(1)).toHaveText('0.5');
  await updateDistribution(page, { ...example, data: [2, 2, 2].map(value => ({ value })) });
  const constant = await readDistribution(page);
  expect(constant.rows.map(row => [row.value, row.cumulativeProbability])).toEqual([
    [1.5, 0],
    [2, 1],
    [2.5, 1]
  ]);
  expect(constant.lines[0].points[0].y).toBeGreaterThan(constant.lines[0].points[1].y);
  await screenshotDistribution(page, 'ecdf-constant', info.repeatEachIndex);
  await updateDistribution(page, { ...example, data: [] });
  expect((await readDistribution(page)).rows).toEqual([]);
  await updateDistribution(page, example);
  expect((await readDistribution(page)).sameInstance).toBe(true);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('grouped ECDFs normalize independently and retain their series through theme and resize', async ({
  page
}, info) => {
  const spec: EcdfPlotSpec = {
    ...example,
    colors: { categorical: ['#bb4422', '#3366aa'] },
    data: [
      { series: 'B', value: 4 },
      { series: 'A', value: 1 },
      { series: 'B', value: 0 },
      { series: 'A', value: 1 },
      { series: 'A', value: 2 }
    ]
  };
  await renderDistribution(page, spec);
  for (const theme of ['light', 'dark'] as const) {
    await updateDistribution(page, { ...spec, theme });
    const before = await readDistribution(page);
    expect(before.legends).toEqual(['B', 'A']);
    expect(before.lines.map(line => line.stroke)).toEqual(['#bb4422', '#3366aa']);
    expect(before.rows.filter(row => row.series === 'A').map(row => row.cumulativeProbability)).toEqual([
      0,
      2 / 3,
      1,
      1
    ]);
    await page.evaluate(async () => {
      await (window as any).chart.resize(420, 320);
    });
    expect((await readDistribution(page)).rows).toEqual(before.rows);
    await screenshotDistribution(page, `ecdf-${theme}`, info.repeatEachIndex);
  }
  await updateDistribution(page, example);
  expect((await readDistribution(page)).legends).toEqual([]);
  expect((await readDistribution(page)).lines).toHaveLength(1);
});
