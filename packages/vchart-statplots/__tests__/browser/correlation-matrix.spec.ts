import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import type { CorrelationMatrixSpec } from '../../src/types';
import { names, correlationExample as example, denseCorrelation } from '../fixtures/correlation-matrix';
const outputDir = path.resolve(__dirname, '../../../../.vchart-statplots/correlation-matrix');
type Bounds = { x1: number; x2: number; y1: number; y2: number };
type Cell = {
  row: string;
  column: string;
  value: number | null;
  size: number[];
  x: number;
  y: number;
  fill: unknown;
  bounds: Bounds;
};

async function render(page: Page, spec: CorrelationMatrixSpec, width = 800, height = 600) {
  await page.evaluate(
    async ({ spec, width, height }) => {
      const w = window as any;
      const mount = document.getElementById('statplot-mount')!;
      mount.style.width = `${width}px`;
      mount.style.height = `${height}px`;
      await w.renderStatPlot(spec);
    },
    { spec, width, height }
  );
}

async function resize(page: Page, width: number, height: number) {
  await page.evaluate(
    async ({ width, height }) => {
      // 模拟实际容器调整，容器和画布保持一致。
      const mount = document.getElementById('statplot-mount')!;
      mount.style.width = `${width}px`;
      mount.style.height = `${height}px`;
      await (window as any).chart.resize(width, height);
    },
    { width, height }
  );
}

async function readLayout(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    const chart = w.chart.getChart();
    const region = chart.getAllRegions()[0];
    const series = chart.getAllSeries();
    const cells: Cell[] = series
      .flatMap((s: any) => s.getSeriesMark().getGraphics())
      .map((g: any) => ({
        row: g.context.data[0].row,
        column: g.context.data[0].column,
        value: g.context.data[0].correlation,
        size: g.attribute.size,
        x: g.attribute.x,
        y: g.attribute.y,
        fill: g.attribute.fill,
        bounds: { ...g.globalAABBBounds }
      }));
    const marks: { name: string; text: string; y: number; bounds: any }[] = chart
      .getAllMarks()
      .filter((mark: any) => /^correlation-/.test(mark.name))
      .flatMap((mark: any) =>
        mark.getGraphics().map((g: any) => ({
          name: mark.name,
          text: g.attribute.text,
          y: g.globalAABBBounds.y1,
          bounds: { ...g.globalAABBBounds }
        }))
      );
    const labels: { text: string; x1: number; x2: number; y1: number; y2: number }[] = w.chart
      .getStage()
      .findAll(
        (g: any) =>
          g.type === 'text' &&
          g.attribute.visible !== false &&
          g.attribute.opacity !== 0 &&
          /^(?:-?\d+\.\d{2}|NA)$/.test(String(g.attribute.text)),
        true
      )
      .map((g: any) => ({ text: String(g.attribute.text), ...g.globalAABBBounds }));
    const axisLabels: { text: string; x1: number; x2: number; y1: number; y2: number }[] = w.chart
      .getStage()
      .findAll((g: any) => g.name === 'axis-label' && g.attribute.visible !== false, true)
      .map((g: any) => ({ text: String(g.attribute.text), ...g.globalAABBBounds }));
    return {
      region: { ...region.getLayoutRect(), ...region.getLayoutStartPoint() },
      cells,
      marks,
      labels,
      axisLabels,
      domains: [series[0].getXAxisHelper().getScale(0).domain(), series[0].getYAxisHelper().getScale(0).domain()],
      errors: w.chartErrors
    };
  });
}

function expectMatrix(layout: Awaited<ReturnType<typeof readLayout>>, variables: string[], count: number) {
  expect(layout.errors).toEqual([]);
  expect(layout.region.width).toBeGreaterThan(0);
  expect(layout.region.width).toBeCloseTo(layout.region.height, 5);
  expect(layout.domains).toEqual([variables, variables]);
  expect(layout.cells).toHaveLength(count);
  const step = layout.region.width / variables.length;
  let deviation = 0;
  for (const cell of layout.cells) {
    deviation = Math.max(
      deviation,
      Math.abs(cell.size[0] - step),
      Math.abs(cell.size[1] - step),
      Math.abs(cell.x - (variables.indexOf(cell.column) + 0.5) * step),
      Math.abs(cell.y - (variables.indexOf(cell.row) + 0.5) * step)
    );
  }
  expect(deviation).toBeLessThan(0.000005);
  const title = layout.marks.find(mark => mark.name === 'correlation-colorbar-title')!;
  expect(title.bounds.x1).toBeGreaterThanOrEqual(layout.region.x + layout.region.width + 15);
  const bottomLabels = layout.axisLabels.filter(label => label.y1 >= layout.region.y + layout.region.height);
  expect(bottomLabels.length).toBeGreaterThan(0);
  expect(Math.max(...bottomLabels.map(label => label.y1)) - layout.region.y - layout.region.height).toBeLessThan(20);
  expect(layout.marks.filter(mark => mark.name !== 'correlation-colorbar')).toHaveLength(12);
}

async function update(page: Page, spec: CorrelationMatrixSpec) {
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, spec);
}

test('correlation matrix uses square contiguous cells and a static five-tick colorbar', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  await render(page, example);
  const layout = await readLayout(page);
  expectMatrix(layout, names, 25);
  const ticks = layout.marks.filter(mark => mark.name === 'correlation-colorbar-tick');
  expect(ticks.map(tick => String(tick.text))).toEqual(['−1', '−0.5', '0', '0.5', '1']);
  expect(ticks[4].y).toBeLessThan(ticks[2].y);
  expect(ticks[2].y).toBeLessThan(ticks[0].y);
  expect(layout.marks.find(mark => mark.name === 'correlation-colorbar-title')!.text).toBe('Pearson r');
  expect(
    await page.evaluate(
      () =>
        (window as any).chart
          .getChart()
          .getComponentsByKey('legends')
          .filter((c: any) => c.getSpec().visible !== false).length
    )
  ).toBe(0);
  await page.screenshot({ path: path.join(outputDir, 'light-full-800.png') });
});

test('the gallery main example retains constant-variable NA in its lower triangle', async ({ page }) => {
  const main: CorrelationMatrixSpec = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../examples/specs/correlationMatrix.json'), 'utf8')
  );
  await page.goto('/__tests__/browser/page.html');
  for (const theme of ['light', 'dark'] as const) {
    await render(page, { ...main, theme }, theme === 'light' ? 800 : 420, theme === 'light' ? 600 : 360);
    const layout = await readLayout(page);
    expectMatrix(layout, ['年龄', '收入', '常量'], 6);
    expect(layout.cells.filter(cell => cell.value === null)).toHaveLength(3);
    await page.screenshot({ path: path.join(outputDir, `${theme}-main.png`) });
  }
});

test('triangles, ordering, themes and resize keep one shared square grid', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  await render(page, example);
  for (const theme of ['light', 'dark'] as const) {
    for (const triangle of ['full', 'lower', 'upper'] as const) {
      const variables = triangle === 'upper' ? names.slice().reverse() : names;
      const spec = { ...example, theme, triangle, variableOrder: variables };
      await update(page, spec);
      for (const [width, height] of [
        [800, 600],
        [420, 360],
        [1000, 420]
      ]) {
        await resize(page, width, height);
        const layout = await readLayout(page);
        expectMatrix(layout, variables, triangle === 'full' ? 25 : 15);
        for (const cell of layout.cells) {
          const r = variables.indexOf(cell.row);
          const c = variables.indexOf(cell.column);
          if (triangle === 'lower') expect(r).toBeGreaterThanOrEqual(c);
          if (triangle === 'upper') expect(r).toBeLessThanOrEqual(c);
          expect(cell.value).toBe(
            example.data.find(row => row.row === cell.row && row.column === cell.column)!.correlation
          );
        }
        for (const mark of layout.marks) {
          expect(mark.bounds.x2).toBeLessThanOrEqual(width);
          expect(mark.bounds.y2).toBeLessThanOrEqual(height);
        }
        await page.screenshot({ path: path.join(outputDir, `${theme}-${triangle}-${width}.png`) });
      }
    }
  }
});

test('dense labels avoid overlap without losing cells; sparse values and NA keep real tooltips', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  await render(page, example);
  const denseSpec = denseCorrelation(30);
  await update(page, denseSpec);
  await resize(page, 420, 360);
  const dense = await readLayout(page);
  expectMatrix(
    dense,
    Array.from({ length: 30 }, (_, i) => `变量${i + 1}`),
    900
  );
  expect(dense.labels.length).toBeGreaterThan(0);
  expect(dense.labels.length).toBeLessThan(900);
  for (let i = 0; i < dense.labels.length; i++) {
    for (let j = i + 1; j < dense.labels.length; j++) {
      const a = dense.labels[i];
      const b = dense.labels[j];
      expect(a.x2 + 2 <= b.x1 || b.x2 + 2 <= a.x1 || a.y2 + 2 <= b.y1 || b.y2 + 2 <= a.y1).toBe(true);
    }
  }
  await page.screenshot({ path: path.join(outputDir, 'dense-420.png') });
  await update(page, example);
  await resize(page, 800, 600);
  const sparse = await readLayout(page);
  expectMatrix(sparse, names, 25);
  expect(sparse.labels).toHaveLength(25);
  expect(new Set(sparse.labels.map(label => label.text))).toEqual(new Set(['1.00', '0.50', '-0.50', '0.00', 'NA']));
  for (const target of [
    sparse.cells.find(cell => cell.value === -0.5)!,
    sparse.cells.find(cell => cell.value === null)!
  ]) {
    await page.mouse.move(0, 0);
    await page.mouse.move((target.bounds.x1 + target.bounds.x2) / 2, (target.bounds.y1 + target.bounds.y2) / 2);
    const tooltip = page.locator('.vchart-tooltip-element');
    await expect(tooltip).toBeVisible();
    for (const text of [target.row, target.column, 'pearson', target.value === null ? '不可计算' : '-0.5']) {
      await expect(tooltip).toContainText(text);
    }
  }
});

test('single, null, empty and long-label inputs retain geometry and method metadata', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  for (const correlation of [1, null]) {
    await render(page, {
      type: 'correlationMatrix',
      method: 'spearman',
      data: [{ row: 'A', column: 'A', correlation }]
    });
    const layout = await readLayout(page);
    expectMatrix(layout, ['A'], 1);
    expect(layout.cells[0].value).toBe(correlation);
    expect(layout.marks.find(mark => mark.name === 'correlation-colorbar-title')!.text).toBe('Spearman ρ');
  }
  await render(page, { ...example, method: 'kendall', data: example.data.map(row => ({ ...row, correlation: null })) });
  expectMatrix(await readLayout(page), names, 25);
  expect((await readLayout(page)).labels.every(label => label.text === 'NA')).toBe(true);
  const longName = '这是一个用于检查坐标轴截断和占位的很长的中文变量名称';
  const longNames = names.map(name => longName + name);
  await render(
    page,
    {
      ...example,
      description: '保留统计方法与完整数据',
      fieldLabels: { row: '行变量', column: '列变量', correlation: '系数' },
      data: example.data.map(row => ({ ...row, row: longName + row.row, column: longName + row.column }))
    },
    420,
    360
  );
  expectMatrix(await readLayout(page), longNames, 25);
  await page.screenshot({ path: path.join(outputDir, 'long-labels-420.png') });
  await render(page, { ...example, data: [] });
  const empty = await readLayout(page);
  expect(empty.cells).toHaveLength(0);
  expect(empty.marks).toHaveLength(0);
  expect(empty.errors).toEqual([]);
  await render(page, example, 120, 80);
  const tiny = await readLayout(page);
  expect(tiny.errors).toEqual([]);
  expect(Number.isFinite(tiny.region.width) && tiny.region.width >= 0).toBe(true);
  expect(tiny.cells.every(cell => cell.size.every((size: number) => Number.isFinite(size) && size >= 0))).toBe(true);
});

for (const dpr of [1, 1.25, 2]) {
  test(`colorbar pixels agree with cells across themes, palettes and fractional sizes at DPR ${dpr}`, async ({
    browser
  }) => {
    const context = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 1000, height: 800 } });
    const page = await context.newPage();
    await page.goto('/__tests__/browser/page.html');
    try {
      const palettes = [
        undefined,
        ['#0000ff', '#ffffff', '#ff0000'],
        ['#0000ff', '#8080ff', '#ffffff', '#ff8080', '#ff0000']
      ];
      for (const theme of ['light', 'dark'] as const) {
        for (let i = 0; i < palettes.length; i++) {
          const spec: CorrelationMatrixSpec = {
            ...example,
            theme,
            colors: palettes[i] ? { diverging: palettes[i] } : undefined
          };
          if (i === 0 && theme === 'light') await render(page, spec);
          else await update(page, spec);
          await resize(page, 823.5, 599.25);
          expectMatrix(await readLayout(page), names, 25);
          const samples = await page.evaluate(() => {
            const w = window as any;
            const chart = w.chart.getChart();
            const region = chart.getAllRegions()[0];
            const rail = chart.getMarkByUserName('correlation-colorbar-rail')[0].getGraphics()[0].globalAABBBounds;
            const cells = chart.getAllSeries()[0].getSeriesMark().getGraphics();
            const canvas = document.querySelector('canvas')!;
            const rect = canvas.getBoundingClientRect();
            const dpr = w.chart.getStage().window.dpr;
            const ctx = canvas.getContext('2d')!;
            const pixel = (x: number, y: number) =>
              Array.from(
                ctx.getImageData(Math.floor((x - rect.left) * dpr), Math.floor((y - rect.top) * dpr), 1, 1).data
              );
            return [-0.5, 0, 0.5].map(value => {
              const cell = cells.find((g: any) => g.context.data[0].correlation === value);
              const origin = region.getLayoutStartPoint();
              return {
                value,
                bar: pixel((rail.x1 + rail.x2) / 2, rail.y1 + ((1 - value) / 2) * (rail.y2 - rail.y1)),
                cell: pixel(
                  origin.x + cell.attribute.x - cell.attribute.size[0] * 0.2,
                  origin.y + cell.attribute.y - cell.attribute.size[1] * 0.2
                )
              };
            });
          });
          for (const sample of samples) {
            expect(sample.bar[3]).toBe(255);
            expect(sample.cell[3]).toBe(255);
            for (let channel = 0; channel < 3; channel++)
              expect(Math.abs(sample.bar[channel] - sample.cell[channel])).toBeLessThanOrEqual(2);
          }
          await page.screenshot({ path: path.join(outputDir, `${theme}-dpr-${dpr}-palette-${i}.png`) });
        }
      }
    } finally {
      await context.close();
    }
  });
}

test('ten thousand cells keep a fixed colorbar through render, update, resize and release', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const timing = await page.evaluate(async spec => {
    const w = window as any;
    let start = performance.now();
    await w.renderStatPlot(spec);
    const renderMs = performance.now() - start;
    const count = () =>
      w.chart
        .getChart()
        .getAllSeries()
        .reduce((n: number, s: any) => n + s.getSeriesMark().getGraphics().length, 0);
    const renderCount = count();
    start = performance.now();
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, method: 'kendall', theme: 'dark' }));
    const updateMs = performance.now() - start;
    start = performance.now();
    const mount = document.getElementById('statplot-mount')!;
    mount.style.width = '420px';
    mount.style.height = '360px';
    await w.chart.resize(420, 360);
    return { renderMs, updateMs, resizeMs: performance.now() - start, renderCount, updateCount: count() };
  }, denseCorrelation(100));
  expect(timing.renderCount).toBe(10000);
  expect(timing.updateCount).toBe(10000);
  expectMatrix(
    await readLayout(page),
    Array.from({ length: 100 }, (_, i) => `变量${i + 1}`),
    10000
  );
  await page.screenshot({ path: path.join(outputDir, 'ten-thousand.png') });
  const releaseMs = await page.evaluate(() => {
    const start = performance.now();
    (window as any).chart.release();
    return performance.now() - start;
  });
  expect(await page.locator('canvas').count()).toBe(0);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'lifecycle-timing.json'), JSON.stringify({ ...timing, releaseMs }, null, 2));
});
