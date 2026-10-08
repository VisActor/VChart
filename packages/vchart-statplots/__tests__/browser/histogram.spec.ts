import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { HistogramSpec } from '../../src/types';
import { histogramObservations } from '../fixtures/histogram';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve(__dirname, '../../../../.vchart-statplots/histogram');
fs.mkdirSync(outputDir, { recursive: true });
const example: HistogramSpec = {
  type: 'histogram',
  binning: { binCount: 2 },
  data: histogramObservations,
  fieldLabels: { value: '年龄', count: '样本数', proportion: '样本比例', density: '概率密度' }
};

async function render(page: Page, spec: HistogramSpec) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    await (window as any).renderStatPlot(spec);
  }, spec);
}
async function update(page: Page, spec: HistogramSpec) {
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
      bars: series
        .getSeriesMark()
        .getGraphics()
        .map((g: any) => ({
          datum: g.context.data[0] as { binStart: number; binEnd: number; count: number; height: number },
          width: Math.abs(g.attribute.x1 - g.attribute.x),
          height: Math.abs(g.attribute.y1 - g.attribute.y),
          expectedWidth: Math.abs(
            series.getXAxisHelper().valueToPosition(g.context.data[0].binEnd) -
              series.getXAxisHelper().valueToPosition(g.context.data[0].binStart)
          ),
          bounds: { ...g.globalAABBBounds },
          fill: g.attribute.fill
        })) as {
        datum: { binStart: number; binEnd: number; count: number; height: number };
        width: number;
        height: number;
        expectedWidth: number;
        bounds: { x1: number; x2: number; y1: number; y2: number };
        fill: string;
      }[],
      xDomain: series.getXAxisHelper().getScale(0).domain() as number[],
      xSpan: Math.abs(
        series.getXAxisHelper().getScale(0).scale(4) - series.getXAxisHelper().getScale(0).scale(0)
      ) as number,
      labels: w.chart.getSpec().axes.map((axis: any) => axis.title.text) as string[],
      legends: w.chart.getSpec().legends.visible as boolean,
      errors: w.chartErrors as string[]
    };
  });
}
const bins = (result: Awaited<ReturnType<typeof read>>) => result.bars.map(bar => bar.datum);

for (const statistic of ['count', 'proportion', 'density'] as const) {
  test(`${statistic} renders exact bin widths and proportional heights without a legend`, async ({
    page
  }, testInfo) => {
    await render(page, { ...example, statistic });
    const result = await read(page);
    expect(result.errors).toEqual([]);
    expect(result.xDomain).toEqual([0, 4]);
    expect(result.bars).toHaveLength(2);
    expect(result.bars.map(bar => bar.datum.count)).toEqual([2, 3]);
    expect(result.bars[0].width).toBeGreaterThan(100);
    expect(result.bars[0].width / result.bars[1].width).toBeCloseTo(1, 5);
    expect(result.bars[0].height / result.bars[1].height).toBeCloseTo(2 / 3, 5);
    expect(result.labels).toEqual(['年龄', example.fieldLabels![statistic]]);
    expect(result.legends).toBe(false);
    expect(result.bars.map(bar => bar.datum.height)).toEqual(
      statistic === 'count' ? [2, 3] : statistic === 'proportion' ? [0.4, 0.6] : [0.2, 0.3]
    );
    const target = result.bars[1];
    await page.mouse.move((target.bounds.x1 + target.bounds.x2) / 2, (target.bounds.y1 + target.bounds.y2) / 2);
    const tooltip = page.locator('.vchart-tooltip-element');
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('.vchart-tooltip-value').nth(2)).toHaveText('3');
    await expect(tooltip).toContainText('年龄下界');
    await expect(tooltip).toContainText('年龄上界');
    await expect(tooltip.locator('.vchart-tooltip-value')).toHaveCount(statistic === 'count' ? 3 : 4);
    if (statistic !== 'count')
      await expect(tooltip.locator('.vchart-tooltip-value').nth(3)).toHaveText(String(target.datum.height));
    await page.mouse.move(0, 0);
    await page.screenshot({ path: path.join(outputDir, `round-${testInfo.repeatEachIndex}-${statistic}.png`) });
  });
}

test('same-instance data and binCount updates change real geometry and hover counts', async ({ page }) => {
  await render(page, example);
  await page.evaluate(() => {
    (window as any).originalChart = (window as any).chart;
  });
  async function hoverCount(count: number) {
    const result = await read(page);
    const target = result.bars[1];
    expect(target.datum.count).toBe(count);
    await page.mouse.move(0, 0);
    await page.mouse.move((target.bounds.x1 + target.bounds.x2) / 2, (target.bounds.y1 + target.bounds.y2) / 2);
    await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
    await expect(page.locator('.vchart-tooltip-element .vchart-tooltip-value').nth(2)).toHaveText(String(count));
  }
  await hoverCount(3);
  const next = { ...example, data: [0, 1, 2, 2, 3, 4].map(value => ({ value })) };
  await update(page, next);
  await hoverCount(4);
  expect(await page.evaluate(() => (window as any).chart === (window as any).originalChart)).toBe(true);
  const coarse = await read(page);
  expect(coarse.bars[0].width / coarse.xSpan).toBeCloseTo(0.5, 5);
  await update(page, { ...next, binning: { binCount: 4 } });
  const fine = await read(page);
  expect(fine.bars.map(bar => bar.datum.count)).toEqual([1, 1, 2, 2]);
  expect(fine.bars[0].width / fine.xSpan).toBeCloseTo(0.25, 5);
  await hoverCount(1);
});

test('zero bins, constant observations, empty data and resize retain their meanings', async ({ page }, testInfo) => {
  await render(page, { ...example, data: [{ value: 0 }, { value: 4 }], binning: { binCount: 4 } });
  const zero = await read(page);
  expect(zero.bars.map(bar => bar.datum.count)).toEqual([1, 0, 0, 1]);
  expect(zero.bars.map(bar => bar.height)).toEqual([zero.bars[0].height, 0, 0, zero.bars[0].height]);
  await page.screenshot({ path: path.join(outputDir, `round-${testInfo.repeatEachIndex}-zero-bin.png`) });
  await update(page, { ...example, data: [{ value: 0 }, { value: 0 }, { value: 0 }] });
  const constant = await read(page);
  expect(constant.xDomain).toEqual([-0.5, 0.5]);
  expect(constant.bars).toHaveLength(1);
  expect(constant.bars[0].datum.count).toBe(3);
  expect(constant.bars[0].height).toBeGreaterThan(100);
  await page.screenshot({ path: path.join(outputDir, `round-${testInfo.repeatEachIndex}-constant.png`) });
  for (const theme of ['light', 'dark'] as const) {
    await update(page, { ...example, theme, colors: { categorical: ['#bb4422'] } });
    expect((await read(page)).xDomain).toEqual([0, 4]);
    for (const [width, height] of [
      [420, 320],
      [1000, 420]
    ]) {
      const before = bins(await read(page));
      await page.evaluate(
        async ({ width, height }) => {
          const mount = document.getElementById('statplot-mount')!;
          mount.style.width = `${width}px`;
          mount.style.height = `${height}px`;
          await (window as any).chart.resize(width, height);
        },
        { width, height }
      );
      const after = await read(page);
      expect(after.errors).toEqual([]);
      expect(bins(after)).toEqual(before);
      expect(after.bars.every(bar => bar.fill === '#bb4422')).toBe(true);
      await page.screenshot({ path: path.join(outputDir, `round-${testInfo.repeatEachIndex}-${theme}-${width}.png`) });
    }
  }
  await update(page, { ...example, data: [] });
  expect((await read(page)).bars).toHaveLength(0);
  expect(await page.evaluate(() => (window as any).chart.getSpec().title.subtext)).toContain('暂无可绘制数据');
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('200 dense bins preserve actual intervals in a narrow chart', async ({ page }) => {
  await render(page, { ...example, binning: { binCount: 200 } });
  await page.evaluate(async () => {
    await (window as any).chart.resize(320, 260);
  });
  const result = await read(page);
  expect(result.errors).toEqual([]);
  expect(result.bars).toHaveLength(200);
  expect(result.bars[0].expectedWidth).toBeLessThan(2);
  for (const bar of result.bars) expect(bar.width).toBeCloseTo(bar.expectedWidth, 5);
});

test('gallery identifies coarse and fine histogram variants', async ({ page }) => {
  await page.goto('/examples/index.html?type=histogram');
  for (const [binCount, name] of [
    [2, '粗分箱直方图'],
    [10, '细分箱直方图']
  ] as const) {
    await page.locator('#input').fill(JSON.stringify({ ...example, binning: { binCount } }));
    await page.locator('#render').click();
    await expect(page.locator('#error')).toBeEmpty();
    await expect(page.locator('#chart-title')).toHaveText(name);
  }
});

test('10k and 100k observations survive the lifecycle and 20 charts release all canvases', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const timings = [];
  for (const count of [10000, 100000]) {
    const timing = await page.evaluate(async count => {
      const w = window as any;
      const data = Array.from({ length: count }, (_, i) => ({ value: ((i * 73) % 997) / 997 }));
      const spec = { type: 'histogram', data, binning: { binCount: 30 } };
      w.VChartStatPlots.compileStatPlot(spec);
      const samples = [];
      for (let i = 0; i < 9; i++) {
        const start = performance.now();
        w.VChartStatPlots.compileStatPlot(spec);
        samples.push(performance.now() - start);
      }
      samples.sort((a, b) => a - b);
      let start = performance.now();
      await w.renderStatPlot(spec);
      const renderMs = performance.now() - start;
      start = performance.now();
      await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, data: [...data, data[0]] }));
      const updateMs = performance.now() - start;
      const snapshot = () =>
        w.chart
          .getChart()
          .getAllSeries()[0]
          .getSeriesMark()
          .getGraphics()
          .map((g: any) => {
            const d = g.context.data[0];
            return { binStart: d.binStart, binEnd: d.binEnd, count: d.count };
          });
      const before = snapshot();
      start = performance.now();
      await w.chart.resize(420, 320);
      const resizeMs = performance.now() - start;
      const after = snapshot();
      start = performance.now();
      w.chart.release();
      const releaseMs = performance.now() - start;
      return {
        count,
        compileMedianMs: samples[4],
        compileMaxMs: samples[8],
        renderMs,
        updateMs,
        resizeMs,
        releaseMs,
        before,
        after
      };
    }, count);
    expect(timing.before).toHaveLength(30);
    expect(timing.before.reduce((sum: number, bin: { count: number }) => sum + bin.count, 0)).toBe(count + 1);
    expect(timing.after).toEqual(timing.before);
    await expect(page.locator('canvas')).toHaveCount(0);
    timings.push({
      count: timing.count,
      compileMedianMs: timing.compileMedianMs,
      compileMaxMs: timing.compileMaxMs,
      renderMs: timing.renderMs,
      updateMs: timing.updateMs,
      resizeMs: timing.resizeMs,
      releaseMs: timing.releaseMs
    });
  }
  const dashboard = await page.evaluate(async () => {
    const w = window as any;
    const charts = [];
    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const mount = document.createElement('div');
      mount.id = `histogram-${i}`;
      mount.style.cssText = 'width:300px;height:200px';
      document.body.appendChild(mount);
      const spec = {
        type: 'histogram',
        binning: { binCount: 30 },
        data: Array.from({ length: 1000 }, (_, j) => ({ value: ((j * 73) % 997) / 997 }))
      };
      const chart = new w.VChart.default(w.VChartStatPlots.compileStatPlot(spec), {
        dom: mount.id,
        animation: false,
        autoFit: false
      });
      await chart.renderAsync();
      charts.push(chart);
    }
    const renderMs = performance.now() - start;
    const canvasCount = document.querySelectorAll('canvas').length;
    const releaseStart = performance.now();
    charts.forEach(chart => chart.release());
    return { chartCount: charts.length, canvasCount, renderMs, releaseMs: performance.now() - releaseStart };
  });
  expect(dashboard.canvasCount).toBe(20);
  await expect(page.locator('canvas')).toHaveCount(0);
  fs.writeFileSync(path.join(outputDir, 'lifecycle-timing.json'), JSON.stringify({ timings, dashboard }, null, 2));
});
