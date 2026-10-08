import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { groupedPairObservations, pairObservations } from '../fixtures/pair-plot';

const directory = path.resolve(__dirname, '../../../../.vchart-statplots/pair-diagonal');
fs.mkdirSync(directory, { recursive: true });
const spec = {
  type: 'pairPlot',
  variables: ['x', 'y'],
  diagonal: { binning: { binCount: 2 } },
  data: { observations: pairObservations }
};

async function render(page: Page, input: unknown = spec) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async input => (window as any).renderStatPlot(input), input);
}
async function snapshot(page: Page) {
  return page.evaluate(() =>
    (window as any).chart
      .getChart()
      .getAllSeries()
      .map((s: any) => ({
        id: s.userId,
        xDomain: s.getXAxisHelper().getScale(0).domain(),
        yDomain: s.getYAxisHelper().getScale(0).domain(),
        bars: s
          .getSeriesMark()
          .getGraphics()
          .map((g: any) => ({
            datum: g.context.data[0],
            x: g.attribute.x,
            x1: g.attribute.x1,
            width: g.attribute.width,
            y: g.attribute.y,
            y1: g.attribute.y1,
            height: g.attribute.height,
            fill: g.attribute.fill,
            start: s.getXAxisHelper().valueToPosition(g.context.data[0].binStart),
            end: s.getXAxisHelper().valueToPosition(g.context.data[0].binEnd),
            zero: s.getYAxisHelper().valueToPosition(0),
            countY: s.getYAxisHelper().valueToPosition(g.context.data[0].count)
          }))
      }))
  );
}
async function hoverBin(page: Page, count: number) {
  const target = await page.evaluate(() => {
    const s = (window as any).chart
      .getChart()
      .getAllSeries()
      .find((s: any) => s.userId === 'diagonal-0');
    const g = s
      .getSeriesMark()
      .getGraphics()
      .find((g: any) => g.context.data[0].binStart === 0);
    const b = g.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.move(1, 1);
  await page.mouse.move(target.x, target.y);
  await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
  const text = await page.locator('.vchart-tooltip-element').innerText();
  expect(text).toContain('x · 箱下界（含）');
  expect(text).toContain('x · 箱上界（最后一箱含）');
  expect(text).toContain('计数');
  expect(text.trim()).toMatch(new RegExp(`0\\s+2\\s+${count}$`));
}

test('actual grouped bars share full bin intervals and variable axes', async ({ page }) => {
  await render(page, { ...spec, data: { observations: groupedPairObservations } });
  const result = await snapshot(page);
  const diagonal = result.find((s: any) => s.id === 'diagonal-0');
  expect(diagonal.bars.reduce((sum: number, b: any) => sum + b.datum.count, 0)).toBe(5);
  for (const bin of diagonal.bars) {
    expect(Math.min(bin.x, bin.x1 ?? bin.x + bin.width)).toBeCloseTo(bin.start, 5);
    expect(Math.max(bin.x, bin.x1 ?? bin.x + bin.width)).toBeCloseTo(bin.end, 5);
    expect(Math.abs((bin.y1 ?? bin.y + bin.height) - bin.y)).toBeCloseTo(Math.abs(bin.zero - bin.countY), 5);
  }
  expect(result.find((s: any) => s.id === 'scatter-1-0').xDomain).toEqual(diagonal.xDomain);
  expect(result.find((s: any) => s.id === 'scatter-0-1').yDomain).toEqual(diagonal.xDomain);
  expect(result.find((s: any) => s.id === 'scatter-0-1').bars).toHaveLength(4);
  const legend = await page.evaluate(() =>
    (window as any).chart
      .getStage()
      .findAll((g: any) => g.name === 'legendItemLabel', true)
      .map((g: any) => g.attribute.text)
  );
  expect(legend).toEqual(expect.arrayContaining(['A', 'B', 'C']));
  for (const series of ['A', 'B']) {
    const fill = diagonal.bars.find((b: any) => b.datum.series === series).fill;
    const scatter = result.find((s: any) => s.id === 'scatter-0-1').bars.find((b: any) => b.datum.series === series);
    expect(scatter.fill).toBe(fill);
  }
  await page.screenshot({ path: path.join(directory, 'grouped.png') });
  const target = await page.evaluate(() => {
    const g = (window as any).chart
      .getChart()
      .getAllSeries()
      .find((s: any) => s.userId === 'diagonal-0')
      .getSeriesMark()
      .getGraphics()
      .find((g: any) => g.context.data[0].series === 'B' && g.context.data[0].count === 3);
    const b = g.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.move(target.x, target.y);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('B');
});

test('real hover and same-instance updates recompute histogram counts', async ({ page }) => {
  await render(page);
  await hoverBin(page, 2);
  await page.evaluate(() => {
    (window as any).initialChart = (window as any).chart;
  });
  const next = { ...spec, data: { observations: [...pairObservations, { id: 'extra', values: { x: 1, y: null } }] } };
  await page.evaluate(async next => {
    await (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(next));
  }, next);
  await hoverBin(page, 3);
  expect(await page.evaluate(() => (window as any).chart === (window as any).initialChart)).toBe(true);
  expect((await snapshot(page)).find((s: any) => s.id === 'scatter-0-1').bars).toHaveLength(4);
});

test('changing resolution and none restores correct actual series', async ({ page }) => {
  await render(page);
  const four = { ...spec, diagonal: { binning: { binCount: 4 } } };
  await page.evaluate(async next => {
    await (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(next));
  }, four);
  expect((await snapshot(page)).find((s: any) => s.id === 'diagonal-0').bars.map((b: any) => b.datum.count)).toEqual([
    1, 1, 1, 2
  ]);
  await page.evaluate(
    async next => {
      await (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(next));
    },
    { ...spec, diagonal: { type: 'none' } }
  );
  expect((await snapshot(page)).map((s: any) => s.id)).toEqual(['scatter-0-1', 'scatter-1-0']);
  await page.screenshot({ path: path.join(directory, 'none.png') });
  await page.evaluate(async next => {
    await (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(next));
  }, spec);
  await hoverBin(page, 2);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});

for (const dpr of [1, 2]) {
  test(`resize and colors preserve bins and interval geometry at DPR ${dpr}`, async ({ browser }) => {
    const context = await browser.newContext({ deviceScaleFactor: dpr });
    const page = await context.newPage();
    await render(page);
    const initial = (await snapshot(page))
      .filter((s: any) => s.id.startsWith('diagonal'))
      .map((s: any) => s.bars.map((b: any) => b.datum));
    for (const size of [
      [720, 540],
      [823.5, 599.25]
    ]) {
      await page.evaluate(async size => {
        await (window as any).chart.resize(size[0], size[1]);
      }, size);
      const result = (await snapshot(page)).filter((s: any) => s.id.startsWith('diagonal'));
      expect(result.map((s: any) => s.bars.map((b: any) => b.datum))).toEqual(initial);
      for (const s of result)
        for (const bin of s.bars) {
          expect(bin.x).toBeCloseTo(bin.start, 5);
          expect(bin.x1 ?? bin.x + bin.width).toBeCloseTo(bin.end, 5);
        }
    }
    await page.evaluate(
      async next => {
        await (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(next));
      },
      { ...spec, theme: 'dark', colors: { categorical: 'deep' } }
    );
    expect(
      (await snapshot(page))
        .filter((s: any) => s.id.startsWith('diagonal'))
        .map((s: any) => s.bars.map((b: any) => b.datum))
    ).toEqual(initial);
    await page.screenshot({ path: path.join(directory, `dark-dpr-${dpr}.png`) });
    await context.close();
  });
}

test('all-missing and constant columns render only meaningful bins', async ({ page }) => {
  await render(page, {
    type: 'pairPlot',
    variables: ['missing', 'constant', 'value'],
    data: { observations: [0, 1, 2].map(i => ({ id: String(i), values: { missing: null, constant: 1e12, value: i } })) }
  });
  const result = await snapshot(page);
  expect(result.find((s: any) => s.id === 'diagonal-0').bars).toEqual([]);
  expect(result.find((s: any) => s.id === 'diagonal-1').bars.map((b: any) => b.datum.count)).toEqual([3]);
  const text = await page.evaluate(() =>
    (window as any).chart
      .getStage()
      .findAll((g: any) => g.type === 'text', true)
      .map((g: any) => g.attribute.text)
  );
  expect(text).toContain('计数 · n=0');
  expect(text).toContain('计数 · n=3');
  await page.screenshot({ path: path.join(directory, 'missing-constant.png') });
  expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
});

test('dense explicit bins preserve their intervals without a minimum pixel width', async ({ page }) => {
  await render(page, { ...spec, diagonal: { binning: { binCount: 200 } } });
  await page.evaluate(async () => {
    await (window as any).chart.resize(480, 360);
  });
  const bars = (await snapshot(page)).find((s: any) => s.id === 'diagonal-0').bars;
  expect(bars).toHaveLength(200);
  for (const bin of bars) {
    expect(bin.x).toBeCloseTo(bin.start, 5);
    expect(bin.x1 ?? bin.x + bin.width).toBeCloseTo(bin.end, 5);
  }
});

test('original group colors and legend survive none even without pairwise-valid observations', async ({ page }) => {
  const observations = [
    { id: 'a', series: 'A', values: { x: 0, y: null } },
    { id: 'b', series: 'B', values: { x: null, y: 0 } },
    { id: 'c', series: 'C', values: { x: null, y: null } }
  ];
  await render(page, { ...spec, data: { observations } });
  const before = (await snapshot(page))
    .filter((s: any) => s.id.startsWith('diagonal'))
    .flatMap((s: any) => s.bars.map((b: any) => ({ series: b.datum.series, fill: b.fill })));
  expect(before.map((b: any) => b.series)).toEqual(['A', 'B']);
  for (const diagonal of [{ type: 'none' }, { type: 'histogram' }]) {
    await page.evaluate(
      async input => {
        await (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(input));
      },
      { ...spec, diagonal, data: { observations } }
    );
    const labels = await page.evaluate(() =>
      (window as any).chart
        .getStage()
        .findAll((g: any) => g.name === 'legendItemLabel', true)
        .map((g: any) => g.attribute.text)
    );
    expect(labels).toEqual(['A', 'B', 'C']);
  }
  expect(
    (await snapshot(page))
      .filter((s: any) => s.id.startsWith('diagonal'))
      .flatMap((s: any) => s.bars.map((b: any) => ({ series: b.datum.series, fill: b.fill })))
  ).toEqual(before);
});
