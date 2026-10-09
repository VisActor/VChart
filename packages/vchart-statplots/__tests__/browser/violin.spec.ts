import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { ViolinPlotSpec } from '../../src/types';
import fs from 'fs';
import path from 'path';

const output = path.resolve(__dirname, '../../../../.vchart-statplots/violin');
fs.mkdirSync(output, { recursive: true });
const example: ViolinPlotSpec = {
  type: 'violinPlot',
  data: [0, 0, 0].map(value => ({ category: 'A', value })),
  estimation: { bandwidth: 1 },
  sampling: { points: 33 },
  fieldLabels: { category: '实验组', value: '时长', density: '估计密度' }
};
async function render(page: Page, spec: ViolinPlotSpec) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    const w = window as any;
    await w.renderStatPlot(spec);
    w.originalViolinChart = w.chart;
  }, spec);
}
async function update(page: Page, spec: ViolinPlotSpec) {
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, spec);
}
async function read(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    const series = w.chart.getChart().getAllSeries()[0];
    return {
      rows: w.chart.getSpec().series[0].data.values,
      areas: series
        .getSeriesMark()
        .getGraphics()
        .map((g: any) => {
          const points = g.attribute.points;
          const peak = points.reduce((best: any, p: any) => (p.x1 - p.x > best.x1 - best.x ? p : best), points[0]);
          const x = (peak.x + peak.x1) / 2,
            y = peak.y;
          const m = g.globalTransMatrix;
          return {
            category: g.context.data[0].category,
            series: g.context.data[0].series,
            points,
            width: peak.x1 - peak.x,
            center: x,
            fill: g.attribute.fill,
            hover: { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }
          };
        }),
      yDomain: series.getYAxisHelper().getScale(0).domain(),
      labels: w.chart.getSpec().axes.map((axis: any) => axis.title.text),
      legends: w.chart
        .getStage()
        .findAll((g: any) => g.name === 'legendItemLabel', true)
        .map((g: any) => g.attribute.text),
      emptyTextVisible: w.chart
        .getStage()
        .findAll((g: any) => g.type === 'text', true)
        .some((g: any) => String(g.attribute.text).includes('暂无可绘制数据') && g.AABBBounds.width() > 0),
      sameInstance: w.originalViolinChart === w.chart,
      errors: w.chartErrors
    };
  });
}
async function screenshot(page: Page, name: string, round: number) {
  await page.mouse.move(0, 0);
  await page.evaluate(() => (window as any).chart.hideTooltip());
  await expect(page.locator('.vchart-tooltip-element')).not.toBeVisible();
  await page.screenshot({ path: path.join(output, `round-${round}-${name}.png`) });
}

test('原始常数组生成真实轮廓和摘要 hover，参数更新改变统计与图元', async ({ page }, info) => {
  await render(page, example);
  const result = await read(page);
  expect(result.errors).toEqual([]);
  expect(result.areas).toHaveLength(1);
  expect(result.areas[0].points).toHaveLength(33);
  expect(result.yDomain).toEqual([-3, 3]);
  expect(result.labels).toEqual(['实验组', '时长']);
  expect(result.rows[16].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
  const peak = result.areas[0].points[16];
  expect(peak.x1 - peak.x).toBeGreaterThan(100);
  expect((result.areas[0].points[0].x1 - result.areas[0].points[0].x) / (peak.x1 - peak.x)).toBeCloseTo(
    Math.exp(-4.5),
    10
  );
  await page.mouse.move(result.areas[0].hover.x, result.areas[0].hover.y);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('时长（原始最小值）');
  await expect(page.locator('.vchart-tooltip-element')).toContainText('估计密度（峰值）');
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value')).toHaveText([
    '3',
    '0',
    '0',
    '1',
    String(result.rows[16].density)
  ]);
  await screenshot(page, 'constant', info.repeatEachIndex);
  await update(page, {
    ...example,
    data: [0, 0, 1].map(value => ({ category: 'A', value })),
    estimation: { bandwidth: 0.5 }
  });
  const changed = await read(page);
  expect(changed.sameInstance).toBe(true);
  expect(changed.yDomain).toEqual([-1.5, 2.5]);
  expect(changed.rows[16].density).toBeCloseTo((2 * Math.exp(-0.5)) / Math.sqrt(2 * Math.PI), 12);
  expect(changed.areas[0].points[8].x1 - changed.areas[0].points[8].x).not.toBe(
    result.areas[0].points[8].x1 - result.areas[0].points[8].x
  );
  await page.mouse.move(changed.areas[0].hover.x, changed.areas[0].hover.y);
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(2)).toHaveText('1');
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(3)).toHaveText('0.5');
  await update(page, { ...example, estimation: { bandwidth: 1, kernel: 'epanechnikov' }, sampling: { points: 65 } });
  const compact = await read(page);
  expect(compact.yDomain).toEqual([-1, 1]);
  expect(compact.areas[0].points).toHaveLength(65);
  expect(compact.rows[32].density).toBe(0.75);
  expect(compact.areas[0].points[0].x1).toBe(compact.areas[0].points[0].x);
  await screenshot(page, 'epanechnikov', info.repeatEachIndex);
});

test('等宽和等面积更新真实改变轮廓，分类/系列位置颜色与图例一致', async ({ page }, info) => {
  const spec: ViolinPlotSpec = {
    type: 'violinPlot',
    sampling: { points: 65 },
    colors: { categorical: ['#bb4422', '#3366aa'] },
    data: [
      ...[-1, 0, 1].map(value => ({ category: 'A', series: 'X', value })),
      ...[-2, 0, 2].map(value => ({ category: 'A', series: 'Y', value })),
      ...[-1, 0, 1].map(value => ({ category: 'B', series: 'X', value }))
    ]
  };
  await render(page, spec);
  const width = await read(page);
  expect(width.areas).toHaveLength(3);
  expect(width.legends).toEqual(['X', 'Y']);
  expect(width.areas.map((area: any) => area.fill)).toEqual(['#bb4422', '#3366aa', '#bb4422']);
  expect(width.areas[0].center).toBeLessThan(width.areas[1].center);
  expect(width.areas[1].center).toBeLessThan(width.areas[2].center);
  expect(width.areas[1].width / width.areas[0].width).toBeCloseTo(1, 12);
  await screenshot(page, 'width', info.repeatEachIndex);
  await update(page, { ...spec, densityNormalization: 'area' });
  const area = await read(page);
  expect(area.areas[1].width / area.areas[0].width).toBeCloseTo(0.5, 12);
  expect(area.rows.map((row: any) => row.density)).toEqual(width.rows.map((row: any) => row.density));
  await screenshot(page, 'area', info.repeatEachIndex);
  await update(page, { ...spec, densityNormalization: 'area', theme: 'dark' });
  expect((await read(page)).rows).toEqual(area.rows);
  await screenshot(page, 'area-dark', info.repeatEachIndex);
  const legend = await page.evaluate(() => {
    const item = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true);
    const b = item.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.click(legend.x, legend.y);
  await expect.poll(async () => (await read(page)).areas.map((a: any) => a.series)).toEqual(['Y']);
});

test('同实例分类增删、空表往返、resize 和 release 保持统计和状态正确', async ({ page }) => {
  await render(page, example);
  const before = await read(page);
  await page.evaluate(async () => (window as any).chart.resize(420, 320));
  const resized = await read(page);
  expect(resized.rows).toEqual(before.rows);
  expect(resized.areas[0].width).not.toBe(before.areas[0].width);
  await update(page, { ...example, data: [] });
  const empty = await read(page);
  expect(empty.areas).toHaveLength(0);
  expect(empty.rows).toEqual([]);
  expect(empty.emptyTextVisible).toBe(true);
  await update(page, { ...example, data: [{ category: 'C', series: '新组', value: 5 }] });
  const restored = await read(page);
  expect(restored.sameInstance).toBe(true);
  expect(restored.emptyTextVisible).toBe(false);
  expect(restored.legends).toEqual(['新组']);
  expect(restored.areas).toHaveLength(1);
  expect(restored.areas[0].category).toBe('C');
  expect(restored.yDomain).toEqual([2, 8]);
  expect(restored.errors).toEqual([]);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
