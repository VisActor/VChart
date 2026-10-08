import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const example = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../examples/specs/missingValueMatrix.json'), 'utf8')
);
const outputDir = path.resolve(__dirname, '../../../../.vchart-statplots/missingness-layout');
const makeData = (rows: number, columns: number) =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: columns }, (_, c) => ({
      observationId: String(r + 1),
      variable: `变量${c + 1}`,
      isMissing: (r + c) % 7 === 0
    }))
  ).flat();

async function readLayout(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    const series = w.chart.getChart().getAllSeries()[0];
    const graphics: any[] = series.getSeriesMark().getGraphics();
    const first = graphics[0].context.data[0];
    const axes = [
      { helper: series.getXAxisHelper(), group: 'observationId', start: 'x1', end: 'x2' },
      { helper: series.getYAxisHelper(), group: 'variable', start: 'y1', end: 'y2' }
    ].map(({ helper, group, start, end }) => {
      const scale = helper.getScale(0);
      const cells = graphics
        .filter((g: any) => g.context.data[0][group] === first[group])
        .sort((a: any, b: any) => a.AABBBounds[start] - b.AABBBounds[start]);
      const bounds = cells.map((g: any) => ({ start: g.AABBBounds[start], end: g.AABBBounds[end] }));
      const range = scale.range();
      return {
        type: helper.getAxisType(),
        domain: scale.domain(),
        outer: [bounds[0].start - Math.min(...range), Math.max(...range) - bounds[bounds.length - 1].end],
        inner: bounds.slice(1).map((b: any, i: number) => b.start - bounds[i].end),
        boundaries: cells.slice(0, -1).map((g: any) => g.globalAABBBounds[end])
      };
    });
    const stage = w.chart.getStage();
    const lines = (stage.findAll((g: any) => g.name === 'axis-grid-line', true) as any[]).map((g: any) => {
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y1: b.y1, y2: b.y2, width: g.attribute.lineWidth, color: g.attribute.stroke };
    });
    const labels = (
      stage.findAll(
        (g: any) => g.name === 'axis-label' && g.attribute.visible !== false && /^\d+$/.test(String(g.attribute.text)),
        true
      ) as any[]
    )
      .map((g: any) => ({ text: String(g.attribute.text), y1: g.globalAABBBounds.y1, y2: g.globalAABBBounds.y2 }))
      .sort((a: any, b: any) => a.y1 - b.y1);
    const observed = graphics.find((g: any) => !g.context.data[0].isMissing) ?? graphics[0];
    const b = observed.globalAABBBounds;
    const canvas = document.querySelector('canvas')!;
    const context = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const y = Math.floor((b.y1 + b.y2) / 2 - rect.top);
    const pixel = (x: number) => Array.from(context.getImageData(Math.floor(x - rect.left), y, 1, 1).data);
    const separatorPixels = axes[0].boundaries.map((x: number) => ({
      at: [pixel(x - 0.5), pixel(x + 0.5)],
      inside: pixel(x - 3)
    }));
    return { axes, lines, labels, separatorPixels, cells: graphics.length, errors: w.chartErrors };
  });
}

function expectCompact(layout: Awaited<ReturnType<typeof readLayout>>, columns: number, theme: string) {
  expect(layout.errors).toEqual([]);
  for (const axis of layout.axes) {
    expect(axis.type).toBe('cartesianAxis-band');
    for (const gap of [...axis.inner, ...axis.outer]) {
      expect(gap).toBeCloseTo(0, 5);
    }
  }
  // 网格数量只随变量数变化，不随观测数增长。
  const internalLines = layout.lines.filter(line =>
    layout.axes[0].boundaries.some(x => Math.abs(line.x - x) < 0.00001)
  );
  expect(internalLines).toHaveLength(columns - 1);
  // 原生网格允许绘制外缘线，边缘裁切和浮点舍入不影响内部列分隔。
  expect(layout.lines.length).toBeLessThanOrEqual(columns + 1);
  for (const line of layout.lines) {
    expect(line.width).toBe(1);
    expect(line.color).toBe(theme === 'dark' ? '#202226' : '#ffffff');
    expect(line.y2).toBeGreaterThan(line.y1);
  }
  for (const x of layout.axes[0].boundaries) {
    expect(layout.lines.some(line => Math.abs(line.x - x) < 0.00001)).toBe(true);
  }
  // 真实 canvas 像素验证细线在色块上可见，而不只检查网格配置。
  for (const sample of layout.separatorPixels) {
    expect(sample.at.some(pixel => pixel.slice(0, 3).some((v, i) => Math.abs(v - sample.inside[i]) > 20))).toBe(true);
  }
}

function expectLabelsDoNotOverlap(labels: Awaited<ReturnType<typeof readLayout>>['labels']) {
  expect(labels.length).toBeGreaterThan(1);
  for (let i = 1; i < labels.length; i++) {
    expect(labels[i].y1).toBeGreaterThanOrEqual(labels[i - 1].y2);
  }
}

test('missing-value matrix fills band axes and draws fixed column separators in both themes and sizes', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  for (const theme of ['light', 'dark']) {
    await page.evaluate(async spec => (window as any).renderStatPlot(spec), { ...example, theme });
    for (const size of [
      [800, 600],
      [420, 360]
    ]) {
      await page.evaluate(async size => {
        await (window as any).chart.resize(size[0], size[1]);
      }, size);
      const layout = await readLayout(page);
      expect(layout.cells).toBe(example.data.length);
      expectCompact(layout, 4, theme);
      expectLabelsDoNotOverlap(layout.labels);
      if (size[0] === 800) {
        expect(layout.labels.map(label => label.text)).toEqual(Array.from({ length: 12 }, (_, i) => String(i + 1)));
      }
      await page.screenshot({ path: path.join(outputDir, `${theme}-${size[0]}.png`) });
    }
  }
});

test('dense observation labels avoid overlap while update and resize retain every cell and hover semantics', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), example);
  const spec = { type: 'missingValueMatrix', data: makeData(300, 4) };
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, spec);
  const dense = await readLayout(page);
  expect(dense.cells).toBe(1200);
  expect(dense.axes[1].domain).toEqual(Array.from({ length: 300 }, (_, i) => String(i + 1)));
  expect(dense.labels.length).toBeLessThan(300);
  expectLabelsDoNotOverlap(dense.labels);
  expectCompact(dense, 4, 'light');
  await page.screenshot({ path: path.join(outputDir, 'dense-800.png') });
  await page.evaluate(async () => {
    await (window as any).chart.resize(420, 360);
  });
  const resized = await readLayout(page);
  expect(resized.cells).toBe(1200);
  expect(resized.labels.length).toBeLessThan(dense.labels.length);
  expectLabelsDoNotOverlap(resized.labels);
  expectCompact(resized, 4, 'light');
  await page.screenshot({ path: path.join(outputDir, 'dense-420.png') });
  // 更新回稀疏矩阵，以实际指针验证 Tooltip，避免亚像素行高影响命中位置。
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, example);
  const target = await page.evaluate(() => {
    const graphics = (window as any).chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
    const g = graphics.find((g: any) => g.context.data[0].isMissing);
    const b = g.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2, row: g.context.data[0] };
  });
  await page.mouse.move(target.x, target.y);
  await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
  for (const text of [target.row.observationId, target.row.variable, '缺失']) {
    await expect(page.locator('.vchart-tooltip-element')).toContainText(text);
  }
  expect((await readLayout(page)).cells).toBe(48);
});

test('single row, single column and empty matrices render without invalid geometry', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  for (const [rows, columns] of [
    [1, 4],
    [12, 1],
    [1, 1]
  ]) {
    await page.evaluate(async spec => (window as any).renderStatPlot(spec), {
      type: 'missingValueMatrix',
      data: makeData(rows, columns)
    });
    const layout = await readLayout(page);
    expect(layout.cells).toBe(rows * columns);
    expectCompact(layout, columns, 'light');
  }
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), { type: 'missingValueMatrix', data: [] });
  expect(
    await page.evaluate(() => ({
      errors: (window as any).chartErrors,
      cells: (window as any).chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics().length
    }))
  ).toEqual({ errors: [], cells: 0 });
});

test('ten thousand cells keep column-only decorations through render, update, resize and release', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const spec = { type: 'missingValueMatrix', data: makeData(1000, 10) };
  const timing = await page.evaluate(async spec => {
    const w = window as any;
    let start = performance.now();
    await w.renderStatPlot(spec);
    const renderMs = performance.now() - start;
    const renderCount = w.chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics().length;
    start = performance.now();
    await w.chart.updateSpec(
      w.VChartStatPlots.compileStatPlot({
        ...spec,
        data: spec.data.map(row => ({ ...row, isMissing: !row.isMissing }))
      })
    );
    const updateMs = performance.now() - start;
    start = performance.now();
    await w.chart.resize(420, 360);
    const graphics = w.chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
    return {
      renderMs,
      updateMs,
      resizeMs: performance.now() - start,
      renderCount,
      updatedFirstMissing: graphics[0].context.data[0].isMissing
    };
  }, spec);
  expect(timing.renderCount).toBe(10000);
  expect(timing.updatedFirstMissing).toBe(false);
  const layout = await readLayout(page);
  expect(layout.cells).toBe(10000);
  expect(layout.axes[1].domain[0]).toBe('1');
  expect(layout.axes[1].domain[999]).toBe('1000');
  expectCompact(layout, 10, 'light');
  expectLabelsDoNotOverlap(layout.labels);
  await page.screenshot({ path: path.join(outputDir, 'ten-thousand.png') });
  const releaseMs = await page.evaluate(() => {
    const start = performance.now();
    (window as any).chart.release();
    return performance.now() - start;
  });
  await expect(page.locator('canvas')).toHaveCount(0);
  fs.writeFileSync(path.join(outputDir, 'lifecycle-timing.json'), JSON.stringify({ ...timing, releaseMs }, null, 2));
  await test
    .info()
    .attach('lifecycle-timing', { body: JSON.stringify({ ...timing, releaseMs }), contentType: 'application/json' });
});
