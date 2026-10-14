import { test, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const output = path.resolve(__dirname, '../../../../.vchart-statplots/regression/browser');
fs.mkdirSync(output, { recursive: true });
const grouped = Array.from({ length: 12 }, (_, x) => ({ x, y: 1 + x * 0.7 + Math.sin(x) / 2, series: 'A' })).concat(
  Array.from({ length: 12 }, (_, x) => ({ x, y: 8 - x / 3 + Math.sin(x) / 3, series: 'B' }))
);

async function view(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    return w.chart
      .getChart()
      .getAllSeries()
      .map((s: any) => ({
        id: s.userId,
        groups: Array.from(new Set(s.getViewData().latestData.map((p: any) => p.series))),
        graphics: s
          .getSeriesMark()
          .getGraphics()
          .map((g: any) => ({
            group: g.context.data[0]?.series,
            color: s.type === 'line' ? g.attribute.stroke : g.attribute.fill
          }))
      }));
  });
}
async function firstLegend(page: Page) {
  return page.evaluate(() => {
    const b = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true).globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
}
async function hoverObservation(page: Page, id: string) {
  const target = await page.evaluate(id => {
    const s = (window as any).chart
      .getChart()
      .getAllSeries()
      .find((s: any) => s.userId === id);
    const g = s.getMarkInName('point').getGraphics()[0],
      b = g.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  }, id);
  await page.mouse.move(target.x, target.y);
}

for (const method of ['linear', 'polynomial', 'lowess']) {
  test(`scatter ${method}: real points/curve/band share color and legend filtering`, async ({ page }) => {
    await page.goto('/__tests__/browser/page.html');
    const spec = {
      type: 'scatterPlot',
      data: grouped,
      fieldLabels: { y: '测量值' },
      fit: {
        input: 'observations',
        method,
        ...(method === 'polynomial' ? { degree: 2 } : {})
      }
    };
    await page.evaluate(async spec => (window as any).renderStatPlot(spec), spec);
    const before = await view(page);
    expect(before.map((s: any) => s.id)).toEqual(
      method === 'lowess' ? ['fit', 'observations'] : ['fit-band', 'fit', 'observations']
    );
    for (const group of ['A', 'B']) {
      const colors = before.map((s: any) => s.graphics.find((g: any) => g.group === group)?.color);
      expect(colors[0]).toMatch(/^#/);
      expect(new Set(colors).size).toBe(1);
    }
    await hoverObservation(page, 'observations');
    await expect(page.locator('.vchart-tooltip-element')).toContainText('测量值');
    await page.mouse.move(990, 790);
    const legend = await firstLegend(page);
    await page.mouse.click(legend.x, legend.y);
    await expect.poll(async () => (await view(page)).map((s: any) => s.groups)).toEqual(before.map(() => ['B']));
    await page.mouse.click(legend.x, legend.y);
    await expect.poll(async () => (await view(page)).map((s: any) => s.groups)).toEqual(before.map(() => ['A', 'B']));
    await page.mouse.move(990, 790);
    await page.screenshot({ path: path.join(output, `scatter-${method}.png`) });
    const image = await page.screenshot();
    for (let i = 0; i < 4; i++) expect(await page.screenshot()).toEqual(image);
    await page.evaluate(() => (window as any).chart.release());
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
    await expect(page.locator('canvas')).toHaveCount(0);
  });
  test(`residual ${method}: raw coordinates, trend, tooltip and fitted-axis update`, async ({ page }) => {
    await page.goto('/__tests__/browser/page.html');
    const spec = {
      type: 'residualPlot',
      input: 'observations',
      data: grouped,
      regression: { method, ...(method === 'polynomial' ? { degree: 2 } : {}) },
      smooth: { method: 'lowess', span: 0.5 },
      fieldLabels: { x: '原始自变量', fittedValue: '预测结果' }
    };
    await page.evaluate(async spec => {
      await (window as any).renderStatPlot(spec);
      (window as any).regressionChart = (window as any).chart;
    }, spec);
    await hoverObservation(page, 'residuals');
    await expect(page.locator('.vchart-tooltip-element')).toContainText('原始残差');
    await page.mouse.move(990, 790);
    const legend = await firstLegend(page);
    await page.mouse.click(legend.x, legend.y);
    await expect.poll(async () => (await view(page)).map((s: any) => s.groups)).toEqual([['B'], ['B']]);
    await page.mouse.click(legend.x, legend.y);
    const state = await page.evaluate(async spec => {
      const w = window as any,
        chart = w.chart;
      const before = chart.getSpec().series[0].data.values.map((p: any) => p.residual);
      await chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, xAxis: 'fitted' }));
      const after = chart.getSpec().series[0].data.values.map((p: any) => p.residual);
      await chart.resize(640, 480);
      return {
        before,
        after,
        x: chart.getSpec().series[0].xField,
        label: chart.getSpec().axes[0].title.text,
        same: chart === w.regressionChart
      };
    }, spec);
    expect(state.after).toEqual(state.before);
    expect(state.x).toBe('fittedValue');
    expect(state.label).toBe('预测结果');
    expect(state.same).toBe(true);
    await page.screenshot({ path: path.join(output, `residual-${method}.png`) });
    await page.evaluate(() => (window as any).chart.release());
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
  });
}

test('scatter fitting mode changes remove obsolete bands/curves and preserve chart lifecycle', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async data => {
    const w = window as any;
    await w.renderStatPlot({ type: 'scatterPlot', data, fit: { input: 'observations', method: 'linear' } });
    w.regressionChart = w.chart;
  }, grouped);
  for (const fit of [
    { input: 'observations', method: 'polynomial', degree: 2, confidence: false },
    { input: 'observations', method: 'lowess', delta: 0.5 },
    {
      input: 'estimates',
      method: 'external',
      data: [
        { x: 0, estimate: 2, series: 'A' },
        { x: 11, estimate: 6, series: 'A' }
      ]
    },
    undefined
  ]) {
    await page.evaluate(
      async ({ fit, data }) => {
        const w = window as any;
        await w.chart.updateSpec(
          w.VChartStatPlots.compileStatPlot({ type: 'scatterPlot', data, ...(fit ? { fit } : {}) })
        );
      },
      { fit, data: grouped }
    );
    expect((await view(page)).map((s: any) => s.id)).toEqual(fit ? ['fit', 'observations'] : ['observations']);
  }
  await page.evaluate(async () => {
    const w = window as any;
    await w.chart.updateSpec(
      w.VChartStatPlots.compileStatPlot({
        type: 'scatterPlot',
        data: [],
        fit: { input: 'observations', method: 'linear' }
      })
    );
    if (
      w.chart
        .getChart()
        .getAllSeries()
        .some((s: any) => s.getSeriesMark().getGraphics().length)
    )
      throw new Error('empty regression has graphics');
    if (w.chart !== w.regressionChart) throw new Error('chart instance replaced');
    w.chart.release();
  });
  expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
});

test('residual modes keep external axis and kind while source data updates recompute raw fit', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const result = await page.evaluate(async data => {
    const w = window as any;
    await w.renderStatPlot({ type: 'residualPlot', input: 'observations', data });
    const first = w.chart.getSpec().series[0].data.values[0].fittedValue;
    const changed = data.map((p: any, i: number) => ({ ...p, y: p.y + (i === 0 ? 3 : 0) }));
    await w.chart.updateSpec(
      w.VChartStatPlots.compileStatPlot({ type: 'residualPlot', input: 'observations', data: changed })
    );
    const second = w.chart.getSpec().series[0].data.values[0].fittedValue;
    await w.chart.updateSpec(
      w.VChartStatPlots.compileStatPlot({
        type: 'residualPlot',
        input: 'predictions',
        data: [{ id: 'a', actual: 8, fittedValue: 10 }]
      })
    );
    const predicted = w.chart.getSpec().series[0];
    await w.chart.updateSpec(
      w.VChartStatPlots.compileStatPlot({
        type: 'residualPlot',
        input: 'residuals',
        residualKind: 'studentized',
        data: [{ id: 'a', fittedValue: 10, residual: -0.5 }]
      })
    );
    const prepared = w.chart.getSpec().series[0].data.values[0];
    w.chart.release();
    return { first, second, axis: predicted.xField, residual: predicted.data.values[0].residual, prepared };
  }, grouped);
  expect(result.first).not.toBe(result.second);
  expect(result.axis).toBe('fittedValue');
  expect(result.residual).toBe(-2);
  expect(result.prepared).toMatchObject({ residual: -0.5, residualKind: '学生化残差' });
  expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
});
