import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const root = path.resolve(__dirname, '../../examples/specs');
const output = path.resolve(__dirname, '../../../../.vchart-statplots/raw-input');
fs.mkdirSync(output, { recursive: true });
const fixture = (type: string, grouped = false) =>
  JSON.parse(fs.readFileSync(path.join(root, grouped ? 'grouped' : '', type + '.json'), 'utf8'));
async function render(page: Page, spec: any) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    await (window as any).renderStatPlot(spec);
  }, spec);
}
async function state(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    return {
      errors: w.chartErrors,
      rows: w.chart.getSpec().series.map((s: any) => ({ id: s.id, values: s.data.values })),
      geometry: w.chart
        .getChart()
        .getAllSeries()
        .map((s: any) => ({
          id: s.userId,
          graphics: (s.userId === 'stems' ? s.getMarkInName('line') : s.getSeriesMark())
            .getGraphics()
            .map((g: any) => ({
              type: g.type,
              width: g.AABBBounds.width(),
              height: g.AABBBounds.height(),
              color: g.type === 'line' ? g.attribute.stroke : g.attribute.fill,
              series: g.context?.data?.[0]?.series
            }))
        })),
      legends: w.chart
        .getStage()
        .findAll((g: any) => g.name === 'legendItemLabel', true)
        .map((g: any) => g.attribute.text)
    };
  });
}
const changes: Record<string, object> = {
  countPlot: { statistic: 'proportion', normalizationScope: 'series' },
  confusionMatrix: { normalization: 'all' },
  rocCurve: {
    data: [
      { actual: true, score: 0 },
      { actual: false, score: 1 }
    ]
  },
  precisionRecallCurve: {
    baseline: true,
    data: [
      { actual: true, score: 0 },
      { actual: false, score: 1 }
    ]
  },
  calibrationCurve: { binning: { binCount: 2, strategy: 'quantile' } },
  qqPlot: { distribution: { type: 'normal', mean: 4, standardDeviation: 2 }, referenceLine: 'regression' },
  autocorrelationPlot: { method: 'pacf', maxLag: 1, confidence: { level: 0.9 } }
};
for (const type of Object.keys(changes))
  test(`${type} raw input update changes computed values and survives resize/theme/release`, async ({ page }) => {
    const spec = fixture(type);
    await render(page, spec);
    const before = await state(page);
    expect(before.errors).toEqual([]);
    expect(before.geometry.some(s => s.graphics.some(g => g.width > 0 && g.height > 0))).toBe(true);
    await page.evaluate(
      async next => {
        const w = window as any;
        w.originalChart = w.chart;
        await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(next));
      },
      { ...spec, ...changes[type] }
    );
    const changed = await state(page);
    expect(changed.rows).not.toEqual(before.rows);
    for (let round = 1; round <= 5; round++) {
      await page.mouse.move(0, 0);
      await page.screenshot({ path: path.join(output, `${type}-round-${round}.png`) });
    }
    await page.evaluate(
      async next => {
        const w = window as any;
        await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...next, theme: 'dark' }));
        await w.chart.resize(480, 360);
      },
      { ...spec, ...changes[type] }
    );
    const resized = await state(page);
    expect(resized.rows).toEqual(changed.rows);
    expect(resized.errors).toEqual([]);
    expect(await page.evaluate(() => (window as any).chart === (window as any).originalChart)).toBe(true);
    await page.screenshot({ path: path.join(output, `${type}-dark-compact.png`) });
    await page.evaluate(() => (window as any).chart.release());
    await expect(page.locator('canvas')).toHaveCount(0);
  });
for (const type of ['rocCurve', 'precisionRecallCurve', 'qqPlot', 'autocorrelationPlot'])
  test(`${type} legend controls both statistical and auxiliary layers`, async ({ page }) => {
    const spec = fixture(type, type !== 'rocCurve');
    if (type === 'precisionRecallCurve') spec.baseline = true;
    if (type === 'qqPlot') spec.referenceLine = 'quartiles';
    await render(page, spec);
    const before = await state(page);
    const names = [...new Set(spec.data.map((r: any) => r.series))];
    expect(before.legends).toEqual(names);
    expect(before.geometry).toHaveLength(type === 'rocCurve' ? 1 : type === 'autocorrelationPlot' ? 3 : 2);
    if (type === 'rocCurve') {
      const curves = await page.evaluate(() =>
        (window as any).chart
          .getChart()
          .getAllSeries()[0]
          .getMarkInName('line')
          .getGraphics()
          .map((g: any) => ({
            series: g.context.data[0].series,
            points: g.attribute.points.map((p: any) => ({ x: p.x, y: p.y })),
            color: g.attribute.stroke
          }))
      );
      expect(curves.map((g: any) => g.series)).toEqual(names);
      expect(curves[0].points).not.toEqual(curves[1].points);
      expect(curves[0].color).not.toBe(curves[1].color);
      for (let round = 1; round <= 5; round++) {
        await page.screenshot({ path: path.join(output, `rocCurve-model-comparison-${round}.png`) });
      }
    }
    const target = await page.evaluate(() => {
      const g = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true);
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(target.x, target.y);
    await expect
      .poll(async () => (await state(page)).geometry.every(s => s.graphics.every(g => g.series === names[1])))
      .toBe(true);
    const after = await state(page);
    for (const layer of after.geometry) expect(layer.graphics.length).toBeGreaterThan(0);
    const colors = after.geometry.flatMap(s => s.graphics.map(g => g.color));
    expect(new Set(colors).size).toBe(1);
  });
test('PR geometry is a native stepBefore curve; ACF single-lag band has visible area and vertical zero stems', async ({
  page
}) => {
  await render(page, fixture('precisionRecallCurve'));
  expect(
    await page.evaluate(() =>
      (window as any).chart
        .getChart()
        .getAllSeries()[0]
        .getMarkInName('line')
        .getGraphics()
        .map((g: any) => g.attribute.curveType)
    )
  ).toEqual(['stepBefore']);
  await render(page, {
    type: 'autocorrelationPlot',
    method: 'pacf',
    maxLag: 1,
    data: [1, 3, 2, 5].map(value => ({ value }))
  });
  const s = await state(page);
  expect(s.geometry.find(s => s.id === 'uncertainty')!.graphics[0].width).toBeGreaterThan(100);
  const stems = await page.evaluate(() => {
    const s = (window as any).chart
      .getChart()
      .getAllSeries()
      .find((s: any) => s.userId === 'stems');
    const zero = s.getYAxisHelper().dataToPosition([0]);
    return s
      .getMarkInName('line')
      .getGraphics()
      .map((g: any) => ({
        points: g.attribute.points.map((p: any) => ({ x: p.x, y: p.y })),
        lineWidth: g.attribute.lineWidth,
        zero
      }));
  });
  expect(stems).toHaveLength(2);
  for (const stem of stems) {
    expect(stem.lineWidth).toBe(1.5);
    expect(stem.points[0].x).toBeCloseTo(stem.points[1].x, 5);
    expect(stem.points[0].y).toBeCloseTo(stem.zero, 5);
  }
});
for (const [type, id, labels] of [
  ['rocCurve', 'roc', ['AUC', '样本数']],
  ['precisionRecallCurve', 'pr', ['Average precision', '正例比例']],
  ['qqPlot', 'quantiles', ['分位点位置']],
  ['autocorrelationPlot', 'values', ['零中心下界', '样本数']]
] as const)
  test(`${type} real hover displays computed statistical quantities`, async ({ page }) => {
    await render(page, fixture(type));
    const target = await page.evaluate(id => {
      const series = (window as any).chart
        .getChart()
        .getAllSeries()
        .find((s: any) => s.userId === id);
      const mark = series.getMarkInName('point');
      const g = mark.getGraphics()[1];
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    }, id);
    await page.mouse.move(target.x, target.y);
    await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
    for (const label of labels) await expect(page.locator('.vchart-tooltip-element')).toContainText(label);
  });
