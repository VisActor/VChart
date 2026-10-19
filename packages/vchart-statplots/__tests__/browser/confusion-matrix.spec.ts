import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import type { ConfusionMatrixSpec } from '../../src/types';

// 防止方阵拉伸、NA 层错位、色条方向反转及更新遗留；读取真实图元和像素。
const output = path.resolve(__dirname, '../../../../.vchart-statplots/matrix-style');
fs.mkdirSync(output, { recursive: true });
const fixture = (variant = false): ConfusionMatrixSpec =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        '../../examples/specs',
        variant ? 'variants/confusionMatrix-actual.json' : 'confusionMatrix.json'
      ),
      'utf8'
    )
  );

async function render(page: Page, spec: ConfusionMatrixSpec) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), spec);
}
async function update(page: Page, spec: ConfusionMatrixSpec) {
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, spec);
}
async function resize(page: Page, width: number, height: number) {
  await page.evaluate(
    async ({ width, height }) => {
      const mount = document.getElementById('statplot-mount')!;
      mount.style.width = `${width}px`;
      mount.style.height = `${height}px`;
      await (window as any).chart.resize(width, height);
    },
    { width, height }
  );
}
async function read(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    const chart = w.chart.getChart();
    const region = chart.getAllRegions()[0];
    const series = chart.getAllSeries();
    const cells = series
      .flatMap((s: any) => s.getSeriesMark().getGraphics())
      .map((g: any) => ({
        ...g.context.data[0],
        size: g.attribute.size,
        x: g.attribute.x,
        y: g.attribute.y,
        fill: g.attribute.fill,
        stroke: g.attribute.stroke,
        lineWidth: g.attribute.lineWidth,
        bounds: { ...g.globalAABBBounds }
      }));
    const marks = chart
      .getAllMarks()
      .filter((m: any) => m.name.startsWith('confusion-colorbar'))
      .flatMap((m: any) =>
        m.getGraphics().map((g: any) => ({ name: m.name, text: g.attribute.text, bounds: { ...g.globalAABBBounds } }))
      );
    const labels = w.chart
      .getStage()
      .findAll(
        (g: any) =>
          g.type === 'text' &&
          g.attribute.visible !== false &&
          g.attribute.opacity !== 0 &&
          /^(?:\d+(?:\.\d)?%|NA)$/.test(String(g.attribute.text)),
        true
      )
      .filter((g: any) =>
        cells.some((c: any) => {
          const b = g.globalAABBBounds;
          return (
            Math.abs((b.x1 + b.x2) / 2 - (c.bounds.x1 + c.bounds.x2) / 2) < 1 &&
            Math.abs((b.y1 + b.y2) / 2 - (c.bounds.y1 + c.bounds.y2) / 2) < 1
          );
        })
      )
      .map((g: any) => ({ text: g.attribute.text, ...g.globalAABBBounds }));
    return {
      cells,
      marks,
      labels,
      region: { ...region.getLayoutRect(), ...region.getLayoutStartPoint() },
      domains: [series[0].getXAxisHelper().getScale(0).domain(), series[0].getYAxisHelper().getScale(0).domain()],
      colorLegends: chart
        .getAllComponents()
        .filter((c: any) => c.type === 'colorLegend' && c.getSpec().visible !== false).length,
      errors: w.chartErrors
    };
  });
}
function square(layout: Awaited<ReturnType<typeof read>>, classes: string[]) {
  expect(layout.errors).toEqual([]);
  expect(layout.colorLegends).toBe(0);
  expect(layout.region.width).toBeGreaterThan(0);
  expect(layout.region.width).toBeCloseTo(layout.region.height, 5);
  expect(layout.domains).toEqual([classes, classes]);
  expect(layout.cells).toHaveLength(classes.length ** 2);
  const step = layout.region.width / classes.length;
  for (const c of layout.cells) {
    expect(c.size[0]).toBeCloseTo(step, 5);
    expect(c.size[1]).toBeCloseTo(step, 5);
    expect(c.x).toBeCloseTo((classes.indexOf(c.predicted) + 0.5) * step, 5);
    expect(c.y).toBeCloseTo((classes.indexOf(c.actual) + 0.5) * step, 5);
    expect(c.lineWidth).toBe(1);
  }
  const ticks = layout.marks
    .filter(m => m.name === 'confusion-colorbar-tick')
    .sort((a, b) => a.bounds.y1 - b.bounds.y1);
  const values = ticks.map(m => parseFloat(m.text));
  expect(values).toEqual([...values].sort((a, b) => b - a));
  expect(values[values.length - 1]).toBe(0);
  const title = layout.marks.find(m => m.name === 'confusion-colorbar-title')!;
  expect(title.bounds.x1).toBeGreaterThanOrEqual(layout.region.x + layout.region.width + 15);
}

test('three-class main example uses square contiguous cells, a percent colorbar and stable screenshots', async ({
  page
}) => {
  await render(page, fixture());
  const layout = await read(page);
  square(layout, ['A', 'B', 'C']);
  expect(layout.cells.filter(c => c.actual === c.predicted).map(c => c.value)).toEqual([0.8, 0.7, 0.7]);
  expect(layout.labels).toHaveLength(9);
  expect(layout.marks.find(m => m.name === 'confusion-colorbar-title')!.text).toBe('比例');
  for (let i = 1; i <= 5; i++) await page.screenshot({ path: path.join(output, `confusion-main-${i}.png`) });
});

test('normalization, class order, theme and resize retain one grid including zero-denominator NA', async ({ page }) => {
  const base = fixture(true);
  await render(page, base);
  for (const theme of ['light', 'dark'] as const) {
    for (const normalization of ['none', 'actual', 'predicted', 'all'] as const) {
      const classes = normalization === 'predicted' ? ['C', 'B', 'A'] : ['A', 'B', 'C'];
      await update(page, { ...base, theme, normalization, classOrder: classes });
      for (const [width, height] of [
        [800, 600],
        [1200, 600],
        [420, 360]
      ]) {
        await resize(page, width, height);
        const layout = await read(page);
        square(layout, classes);
        expect(layout.cells.reduce((n, c) => n + c.count, 0)).toBe(4);
        expect(layout.cells.filter(c => c.value === null)).toHaveLength(
          ['actual', 'predicted'].includes(normalization) ? 3 : 0
        );
        for (const m of layout.marks) {
          expect(m.bounds.x2).toBeLessThanOrEqual(width);
          expect(m.bounds.y2).toBeLessThanOrEqual(height);
        }
        await page.screenshot({ path: path.join(output, `confusion-${theme}-${normalization}-${width}.png`) });
      }
    }
  }
});

test('two-class and dense matrices retain every cell; real hover distinguishes proportion, count and NA', async ({
  page
}) => {
  await render(page, { type: 'confusionMatrix', data: [{ actual: 'A', predicted: 'B' }] });
  square(await read(page), ['A', 'B']);
  const classes = Array.from({ length: 20 }, (_, i) => `类别${i + 1}`);
  await update(page, {
    type: 'confusionMatrix',
    normalization: 'actual',
    classOrder: classes,
    data: classes.flatMap((actual, i) => [
      { actual, predicted: actual },
      { actual, predicted: classes[(i + 1) % 20] }
    ])
  });
  await resize(page, 420, 360);
  const dense = await read(page);
  square(dense, classes);
  expect(dense.labels.length).toBeLessThan(400);
  for (let i = 0; i < dense.labels.length; i++)
    for (let j = i + 1; j < dense.labels.length; j++) {
      const a = dense.labels[i],
        b = dense.labels[j];
      expect(a.x2 <= b.x1 || b.x2 <= a.x1 || a.y2 <= b.y1 || b.y2 <= a.y1).toBe(true);
    }
  await page.screenshot({ path: path.join(output, 'confusion-dense-420.png') });
  await update(page, fixture(true));
  await resize(page, 800, 600);
  const sparse = await read(page);
  square(sparse, ['A', 'B', 'C']);
  for (const target of [sparse.cells.find(c => c.value === 2 / 3)!, sparse.cells.find(c => c.value === null)!]) {
    await page.mouse.move(0, 0);
    await page.mouse.move((target.bounds.x1 + target.bounds.x2) / 2, (target.bounds.y1 + target.bounds.y2) / 2);
    const tip = page.locator('.vchart-tooltip-element');
    await expect(tip).toBeVisible();
    for (const text of [
      'count',
      '比例',
      target.actual,
      target.predicted,
      target.value === null ? '不可计算' : String(target.value)
    ])
      await expect(tip).toContainText(text);
  }
});

test('count ticks and custom titles update without duplicate colorbars; empty and release remove decorations', async ({
  page
}) => {
  const base = fixture();
  await render(page, base);
  for (const max of [1, 3, 10]) {
    await update(page, {
      ...base,
      normalization: 'none',
      fieldLabels: { count: '样本数量' },
      data: Array.from({ length: max }, () => ({ actual: 'A', predicted: 'A' }))
    });
    const layout = await read(page);
    square(layout, ['A', 'B', 'C']);
    const ticks = layout.marks.filter(m => m.name === 'confusion-colorbar-tick').map(m => m.text);
    expect(ticks).toEqual(max === 1 ? ['0', '1'] : max === 3 ? ['0', '1', '2', '3'] : ['0', '3', '6', '9', '10']);
    expect(layout.marks.filter(m => m.name === 'confusion-colorbar-rail')).toHaveLength(1);
    expect(layout.marks.find(m => m.name === 'confusion-colorbar-title')!.text).toBe('样本数量');
    expect(layout.cells.filter(c => c.count === 0)).toHaveLength(8);
  }
  await update(page, { ...base, fieldLabels: { proportion: '这是一个需要截断的很长的自定义比例名称' } });
  await resize(page, 420, 360);
  const longTitle = await read(page);
  square(longTitle, ['A', 'B', 'C']);
  const titleBounds = longTitle.marks.find(m => m.name === 'confusion-colorbar-title')!.bounds;
  expect(titleBounds.x2 - titleBounds.x1).toBeLessThanOrEqual(80);
  expect(titleBounds.x2).toBeLessThanOrEqual(420);
  await update(page, { ...base, data: [] });
  const empty = await read(page);
  expect(empty.cells).toHaveLength(0);
  expect(empty.marks).toHaveLength(0);
  expect(empty.errors).toEqual([]);
  await update(page, base);
  square(await read(page), ['A', 'B', 'C']);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});

for (const dpr of [1, 1.25, 2])
  test(`sequential colorbar pixels agree with actual cells at DPR ${dpr}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: dpr });
    const page = await context.newPage();
    try {
      await render(page, fixture());
      for (const theme of ['light', 'dark'] as const)
        for (const sequential of [undefined, ['#000000', '#ffffff'], 'cividis'] as const) {
          await update(page, {
            ...fixture(),
            theme,
            colors: sequential
              ? { sequential: typeof sequential === 'string' ? sequential : [...sequential] }
              : undefined
          });
          await resize(page, 823.5, 599.25);
          square(await read(page), ['A', 'B', 'C']);
          const samples = await page.evaluate(() => {
            const w = window as any;
            const chart = w.chart.getChart();
            const origin = chart.getAllRegions()[0].getLayoutStartPoint();
            const rail = chart.getMarkByUserName('confusion-colorbar-rail')[0].getGraphics()[0].globalAABBBounds;
            const canvas = document.querySelector('canvas')!;
            const rect = canvas.getBoundingClientRect();
            const ratio = w.chart.getStage().window.dpr;
            const ctx = canvas.getContext('2d')!;
            const pixel = (x: number, y: number) =>
              Array.from(
                ctx.getImageData(Math.floor((x - rect.left) * ratio), Math.floor((y - rect.top) * ratio), 1, 1).data
              );
            return chart
              .getAllSeries()[0]
              .getSeriesMark()
              .getGraphics()
              .map((g: any) => ({
                bar: pixel((rail.x1 + rail.x2) / 2, rail.y1 + (1 - g.context.data[0].value) * (rail.y2 - rail.y1)),
                cell: pixel(
                  origin.x + g.attribute.x - g.attribute.size[0] * 0.2,
                  origin.y + g.attribute.y - g.attribute.size[1] * 0.2
                )
              }));
          });
          for (const sample of samples) {
            expect(sample.bar[3]).toBe(255);
            expect(sample.cell[3]).toBe(255);
            for (let channel = 0; channel < 3; channel++)
              expect(Math.abs(sample.bar[channel] - sample.cell[channel])).toBeLessThanOrEqual(2);
          }
        }
    } finally {
      await context.close();
    }
  });

test('ten thousand confusion cells retain geometry and one colorbar through update, resize and release', async ({
  page
}) => {
  const classes = Array.from({ length: 100 }, (_, i) => `类别${i + 1}`);
  const spec: ConfusionMatrixSpec = {
    type: 'confusionMatrix',
    classOrder: classes,
    data: classes.map(actual => ({ actual, predicted: actual }))
  };
  const timings: { operation: string; durationMs: number }[] = [];
  const start = Date.now();
  await render(page, spec);
  timings.push({ operation: 'renderIncludingNavigation', durationMs: Date.now() - start });
  for (const theme of ['light', 'dark'] as const) {
    const began = Date.now();
    const order = theme === 'light' ? classes : classes.slice().reverse();
    await update(page, { ...spec, theme, normalization: 'actual', classOrder: order });
    await resize(page, theme === 'light' ? 800 : 420, theme === 'light' ? 600 : 360);
    timings.push({ operation: `${theme}UpdateAndResize`, durationMs: Date.now() - began });
    const layout = await read(page);
    expect(layout.errors).toEqual([]);
    expect(layout.cells).toHaveLength(10000);
    expect(layout.domains).toEqual([order, order]);
    expect(layout.region.width).toBeCloseTo(layout.region.height, 5);
    expect(layout.cells.filter(c => c.value === 1)).toHaveLength(100);
    expect(layout.cells.filter(c => c.value === 0)).toHaveLength(9900);
    const step = layout.region.width / 100;
    let deviation = 0;
    for (const c of layout.cells) {
      deviation = Math.max(
        deviation,
        Math.abs(c.size[0] - step),
        Math.abs(c.size[1] - step),
        Math.abs(c.x - (order.indexOf(c.predicted) + 0.5) * step),
        Math.abs(c.y - (order.indexOf(c.actual) + 0.5) * step)
      );
    }
    expect(deviation).toBeLessThan(0.000005);
    expect(layout.marks.filter(m => m.name === 'confusion-colorbar-rail')).toHaveLength(1);
    expect(layout.marks.filter(m => m.name === 'confusion-colorbar-tick')).toHaveLength(5);
    expect(layout.colorLegends).toBe(0);
  }
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
  fs.writeFileSync(
    path.join(output, 'lifecycle-10000.json'),
    JSON.stringify({ cellCount: 10000, timings }, null, 2) + '\n'
  );
});
