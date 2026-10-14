import { test, expect } from '@playwright/test';
import type { BoxPlotSpec } from '../../src/types';
import type { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const output = path.resolve(__dirname, '../../../../.vchart-statplots/box-plot');
fs.mkdirSync(output, { recursive: true });
const example: BoxPlotSpec = {
  type: 'boxPlot',
  data: [100, 0, 1, 2, 3, 4, 5, 6, 7].map(value => ({ category: 'A', value })),
  fieldLabels: { category: '实验组', value: '时长' }
};
async function render(page: Page, spec: BoxPlotSpec) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    const w = window as any;
    await w.renderStatPlot(spec);
    w.originalBoxChart = w.chart;
  }, spec);
}
async function update(page: Page, spec: BoxPlotSpec) {
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, spec);
}
async function read(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    const series = w.chart.getChart().getAllSeries()[0];
    const position = (g: any, x: number, y: number) => {
      const m = g.globalTransMatrix;
      return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
    };
    return {
      rows: w.chart.getSpec().series[0].data.values,
      boxes: series
        .getMarkInName('boxPlot')
        .getGraphics()
        .map((g: any) => ({
          category: g.context.data[0].category,
          series: g.context.data[0].series,
          x: g.attribute.x,
          min: g.attribute.min,
          q1: g.attribute.q1,
          median: g.attribute.median,
          q3: g.attribute.q3,
          max: g.attribute.max,
          color: g.attribute.stroke,
          hover: position(g, g.attribute.boxWidth / 4, g.attribute.median)
        })),
      outliers: series
        .getMarkInName('outlier')
        .getGraphics()
        .map((g: any) => ({
          x: g.attribute.x,
          y: g.attribute.y,
          color: g.attribute.fill,
          hover: position(g, 0, 0)
        })),
      yDomain: series.getYAxisHelper().getScale(0).domain(),
      labels: w.chart.getSpec().axes.map((axis: any) => axis.title.text),
      legends: w.chart
        .getStage()
        .findAll((g: any) => g.name === 'legendItemLabel', true)
        .map((g: any) => g.attribute.text),
      legendColors: w.chart
        .getStage()
        .findAll((g: any) => g.name === 'legendItemShape', true)
        .map((g: any) => g.attribute.fill),
      titleVisible: w.chart.getSpec().title?.visible,
      emptyTextVisible: w.chart
        .getStage()
        .findAll((g: any) => g.type === 'text', true)
        .some((g: any) => String(g.attribute.text).includes('暂无可绘制数据') && g.AABBBounds.width() > 0),
      sameInstance: w.originalBoxChart === w.chart,
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

test('原始箱线五数、异常点和真实 hover 各自显示正确内容', async ({ page }, info) => {
  await render(page, example);
  const result = await read(page);
  expect(result.errors).toEqual([]);
  expect(result.boxes).toHaveLength(1);
  expect(result.outliers).toHaveLength(1);
  expect(result.rows[0]).toMatchObject({ q1: 2, median: 4, q3: 6, whiskerLower: 0, whiskerUpper: 7, outliers: [100] });
  expect(result.labels).toEqual(['实验组', '时长']);
  expect(result.yDomain[0]).toBeLessThanOrEqual(0);
  expect(result.yDomain[1]).toBeGreaterThanOrEqual(100);
  const box = result.boxes[0];
  expect((box.min - box.q1) / (box.q1 - box.q3)).toBeCloseTo(0.5, 8);
  expect((box.q1 - box.median) / (box.q1 - box.q3)).toBeCloseTo(0.5, 8);
  expect((box.q3 - box.max) / (box.q1 - box.q3)).toBeCloseTo(0.25, 8);
  expect(result.outliers[0].y).toBeLessThan(box.max);
  await page.mouse.move(box.hover.x, box.hover.y);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('第一四分位数');
  await expect(page.locator('.vchart-tooltip-element')).toContainText('1.5×IQR');
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value')).toHaveText([
    '7',
    '6',
    '4',
    '2',
    '0',
    '1.5×IQR'
  ]);
  await page.mouse.move(result.outliers[0].hover.x, result.outliers[0].hover.y);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('异常值');
  await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value')).toHaveText(['100']);
  await screenshot(page, 'raw', info.repeatEachIndex);
});

test('同实例更新倍数、原始值和空表，旧异常点真实移除', async ({ page }, info) => {
  await render(page, example);
  const before = await read(page);
  await update(page, { ...example, whiskers: { iqrMultiplier: 30 } });
  const wide = await read(page);
  expect(wide.sameInstance).toBe(true);
  expect(wide.outliers).toHaveLength(0);
  expect(wide.rows[0].whiskerUpper).toBe(100);
  expect(wide.boxes[0].max).toBeLessThan(before.boxes[0].max);
  await update(page, { ...example, data: [5, 5, 5, 5, 100].map(value => ({ category: 'A', value })) });
  const zero = await read(page);
  expect(zero.rows[0]).toMatchObject({ q1: 5, median: 5, q3: 5, whiskerLower: 5, whiskerUpper: 5, outliers: [100] });
  expect(zero.boxes[0].q1).toBe(zero.boxes[0].q3);
  expect(zero.outliers).toHaveLength(1);
  await screenshot(page, 'zero-iqr', info.repeatEachIndex);
  await update(page, { ...example, data: [{ category: 'A', value: 5 }] });
  expect((await read(page)).outliers).toHaveLength(0);
  await update(page, { ...example, data: [] });
  const empty = await read(page);
  expect(empty.boxes).toHaveLength(0);
  expect(empty.emptyTextVisible).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(1);
  await update(page, { ...example, data: [0, 100, 100, 100].map(value => ({ category: 'A', value })) });
  const small = await read(page);
  expect(small.emptyTextVisible).toBe(false);
  expect(small.titleVisible).toBe(false);
  expect(small.rows[0]).toMatchObject({
    whiskerLower: 75,
    q1: 75,
    median: 100,
    q3: 100,
    whiskerUpper: 100,
    outliers: [0]
  });
  expect(small.boxes[0].min).toBe(small.boxes[0].q1);
  await screenshot(page, 'small-sample', info.repeatEachIndex);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('类别和系列首次顺序、颜色与双层位置一致，主题和 resize 保留统计', async ({ page }, info) => {
  const spec: BoxPlotSpec = {
    type: 'boxPlot',
    data: [
      { category: 'A', series: 'X', value: 0 },
      { category: 'B', series: 'Y', value: 100 },
      { category: 'A', series: 'Z', value: 200 },
      { category: 'B', series: 'X', value: 20 },
      { category: 'A', series: 'X', value: 10 },
      { category: 'B', series: 'Y', value: 110 },
      { category: 'A', series: 'Z', value: 210 },
      { category: 'B', series: 'X', value: 30 }
    ]
  };
  await render(page, spec);
  const grouped = await read(page);
  expect(grouped.boxes).toHaveLength(4);
  expect(grouped.legends).toEqual(['X', 'Y', 'Z']);
  const ax = grouped.boxes.find((b: any) => b.category === 'A' && b.series === 'X');
  const az = grouped.boxes.find((b: any) => b.category === 'A' && b.series === 'Z');
  const bx = grouped.boxes.find((b: any) => b.category === 'B' && b.series === 'X');
  expect(ax.x).toBeLessThan(az.x);
  expect(az.x).toBeLessThan(bx.x);
  expect(ax.color).toBe(bx.color);
  expect(ax.color).not.toBe(az.color);
  expect(grouped.legendColors).toEqual(
    ['X', 'Y', 'Z'].map(series => grouped.boxes.find((box: any) => box.series === series).color)
  );
  await screenshot(page, 'grouped', info.repeatEachIndex);
  await update(page, { ...spec, theme: 'dark' });
  expect((await read(page)).rows).toEqual(grouped.rows);
  await screenshot(page, 'grouped-dark', info.repeatEachIndex);
  await page.evaluate(async () => (window as any).chart.resize(420, 320));
  const resized = await read(page);
  expect(resized.rows).toEqual(grouped.rows);
  expect(resized.sameInstance).toBe(true);
  expect(resized.errors).toEqual([]);
  expect(resized.boxes[0].x).not.toBe(grouped.boxes[0].x);
  await update(page, {
    type: 'boxPlot',
    data: [
      { category: 'C', series: '新组', value: 1 },
      { category: 'C', series: '新组', value: 2 }
    ]
  });
  const replaced = await read(page);
  expect(replaced.boxes).toHaveLength(1);
  expect(replaced.legends).toEqual(['新组']);
  expect(replaced.outliers).toHaveLength(0);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
