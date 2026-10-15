import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { HexbinPlotSpec } from '../../src/types';
import type { HexbinBin } from '../../src/plots/hexbin/binning';
import { hexbinPoints } from '../fixtures/hexbin';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve(__dirname, '../../../../.vchart-statplots/hexbin');
const main: HexbinPlotSpec = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../examples/specs/hexbinPlot.json'), 'utf8')
);
const example: HexbinPlotSpec = {
  type: 'hexbinPlot',
  data: hexbinPoints(),
  binning: { xBins: 8 },
  fieldLabels: { x: '收入', y: '评分', count: '样本数' }
};
type Cell = {
  points: { x: number; y: number }[];
  datum: HexbinBin;
  bounds: { x1: number; x2: number; y1: number; y2: number };
  fill: unknown;
};

async function render(page: Page, spec: HexbinPlotSpec, width = 800, height = 600) {
  await page.evaluate(
    async ({ spec, width, height }) => {
      const mount = document.getElementById('statplot-mount')!;
      mount.style.width = `${width}px`;
      mount.style.height = `${height}px`;
      await (window as any).renderStatPlot(spec);
    },
    { spec, width, height }
  );
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
async function update(page: Page, spec: HexbinPlotSpec) {
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
      cells: series
        .getSeriesMark()
        .getGraphics()
        .map((g: any) => ({
          points: g.attribute.points as { x: number; y: number }[],
          datum: g.context.data[0] as {
            id: string;
            q: number;
            s: number;
            count: number;
            vertices: { x: number; y: number }[];
            xMin: number;
            xMax: number;
            yMin: number;
            yMax: number;
          },
          bounds: { ...g.globalAABBBounds },
          fill: g.attribute.fill
        })) as Cell[],
      region: series.getRegion().getLayoutRect() as { width: number; height: number },
      errors: w.chartErrors
    };
  });
}
type Snapshot = Awaited<ReturnType<typeof read>>;
function expectRegular(result: Snapshot, count: number) {
  expect(result.errors).toEqual([]);
  expect(result.cells.reduce((sum: number, cell: Snapshot['cells'][number]) => sum + cell.datum.count, 0)).toBe(count);
  let maxDeviation = 0;
  for (const cell of result.cells) {
    expect(cell.datum.count).toBeGreaterThan(0);
    expect(cell.points).toHaveLength(6);
    const edges = cell.points.map((p, i) => {
      const next = cell.points[(i + 1) % 6];
      return Math.hypot(p.x - next.x, p.y - next.y);
    });
    maxDeviation = Math.max(maxDeviation, Math.max(...edges) - Math.min(...edges));
    expect(Math.min(...edges)).toBeGreaterThan(0);
    cell.points.forEach((p, i) => {
      const prev = cell.points[(i + 5) % 6],
        next = cell.points[(i + 1) % 6];
      const cosine =
        ((prev.x - p.x) * (next.x - p.x) + (prev.y - p.y) * (next.y - p.y)) / (edges[i] * edges[(i + 5) % 6]);
      expect(Math.abs(cosine + 0.5)).toBeLessThan(1e-7);
    });
  }
  expect(maxDeviation).toBeLessThan(1e-5);
}
const raw = (snapshot: Snapshot) => snapshot.cells.map(cell => cell.datum);

test('raw scatter renders regular neighboring hexagons and retains the same bins across resize and themes', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  await render(page, example);
  const initial = await read(page);
  expectRegular(initial, example.data.length);
  // 轴向相邻箱 (q,s)、(q+1,s) 必须共享两个显示顶点。
  const a = initial.cells.find(cell =>
    initial.cells.some(other => other.datum.q === cell.datum.q + 1 && other.datum.s === cell.datum.s)
  )!;
  const b = initial.cells.find(cell => cell.datum.q === a.datum.q + 1 && cell.datum.s === a.datum.s)!;
  expect(a.points.filter(p => b.points.some(v => Math.hypot(p.x - v.x, p.y - v.y) < 1e-5))).toHaveLength(2);
  for (const theme of ['light', 'dark'] as const) {
    await update(page, {
      ...example,
      theme,
      colors: { sequential: theme === 'dark' ? 'cividis' : ['#ffffff', '#003366'] }
    });
    for (const [width, height] of [
      [800, 600],
      [420, 360],
      [1000, 420]
    ]) {
      await resize(page, width, height);
      const result = await read(page);
      expectRegular(result, example.data.length);
      expect(raw(result)).toEqual(raw(initial));
      await page.screenshot({ path: path.join(outputDir, `${theme}-${width}.png`) });
    }
  }
});

test('data and binning updates change real hover counts and current layout', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const spec: HexbinPlotSpec = {
    ...example,
    data: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0.5, y: 0.3 },
      { x: 0.5, y: 0.3 }
    ],
    binning: { xBins: 2 }
  };
  await render(page, spec);
  const before = await read(page);
  const targetId = before.cells.find(cell => cell.datum.count === 2)!.datum.id;
  async function hoverCount(count: number) {
    const result = await read(page);
    const target = result.cells.find(cell => cell.datum.id === targetId)!;
    await page.mouse.move(0, 0);
    await page.mouse.move((target.bounds.x1 + target.bounds.x2) / 2, (target.bounds.y1 + target.bounds.y2) / 2);
    const tooltip = page.locator('.vchart-tooltip-element');
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('.vchart-tooltip-value').first()).toHaveText(String(count));
    expect(target.datum.count).toBe(count);
    for (const text of [
      '样本数',
      '收入包围盒下界',
      '收入包围盒上界',
      '评分包围盒下界',
      '评分包围盒上界',
      String(count),
      String(target.datum.xMin),
      String(target.datum.yMax)
    ]) {
      await expect(tooltip).toContainText(text);
    }
  }
  await hoverCount(2);
  const next = { ...spec, data: [...spec.data, { x: 0.5, y: 0.3 }] };
  await update(page, next);
  await hoverCount(3);
  expectRegular(await read(page), 5);
  await update(page, example);
  const coarse = await read(page);
  await update(page, { ...example, binning: { xBins: 50 } });
  const fine = await read(page);
  expectRegular(fine, example.data.length);
  expect(fine.cells.length).toBeGreaterThan(coarse.cells.length);
  expect(fine.region.width / fine.region.height).not.toBeCloseTo(coarse.region.width / coarse.region.height, 4);
  await page.mouse.move(0, 0);
  await page.screenshot({ path: path.join(outputDir, 'fine.png') });
});

test('gallery identifies the nested coarse and fine binning options', async ({ page }) => {
  await page.goto('/examples/index.html?type=hexbinPlot');
  for (const [xBins, name] of [
    [8, '粗分箱六边形图'],
    [50, '细分箱六边形图']
  ] as const) {
    await page.locator('#input').fill(JSON.stringify({ ...example, binning: { xBins } }));
    await page.locator('#render').click();
    await expect(page.locator('#chart-title')).toHaveText(name);
    await expect(page.locator('#error')).toBeEmpty();
  }
});

test('different units, constant coordinates, a single observation and the gallery main example retain regularity', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  const cases: [string, HexbinPlotSpec][] = [
    ['main', main],
    ['units', { ...example, data: example.data.map(p => ({ x: p.x * 10000 + 1000000, y: p.y / 1000 })) }],
    ['constant', { ...example, data: example.data.map(p => ({ x: 2, y: p.y })) }],
    ['identical', { ...example, data: Array.from({ length: 20 }, () => ({ x: 2, y: 3 })) }],
    ['single', { ...example, data: [{ x: -2, y: 3 }] }]
  ];
  for (const [name, spec] of cases) {
    await render(page, spec);
    expectRegular(await read(page), spec.data.length);
    await page.screenshot({ path: path.join(outputDir, `${name}.png`) });
  }
  await render(page, { ...example, data: [] });
  expectRegular(await read(page), 0);
  expect((await read(page)).cells).toHaveLength(0);
  expect(await page.evaluate(() => (window as any).chart.getSpec().legends.visible)).toBe(false);
  await render(page, example, 120, 80);
  const tiny = await read(page);
  expect(tiny.errors).toEqual([]);
  expect(tiny.region.width).toBeGreaterThanOrEqual(0);
  expect(tiny.region.height).toBeGreaterThanOrEqual(0);
  expect(tiny.cells.every(cell => cell.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)))).toBe(true);
});

for (const dpr of [1, 1.25, 2]) {
  test(`fractional sizes keep six equal sides and 120 degree angles at DPR ${dpr}`, async ({ browser }) => {
    const context = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 1000, height: 800 } });
    const page = await context.newPage();
    try {
      await page.goto('/__tests__/browser/page.html');
      await render(page, example, 823.5, 599.25);
      expectRegular(await read(page), example.data.length);
      await page.screenshot({ path: path.join(outputDir, `fractional-dpr-${dpr}.png`) });
    } finally {
      await context.close();
    }
  });
}

test('10k and 100k observations are binned once per compile and survive render, update, resize and release', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  const timings = [];
  for (const count of [10000, 100000]) {
    const timing = await page.evaluate(async count => {
      const w = window as any;
      const data = Array.from({ length: count }, (_, i) => ({ x: ((i * 73) % 997) / 997, y: ((i * 137) % 991) / 991 }));
      const spec = { type: 'hexbinPlot', data, binning: { xBins: 30 } };
      let start = performance.now();
      const compiled = w.VChartStatPlots.compileStatPlot(spec);
      const compileMs = performance.now() - start;
      start = performance.now();
      if (w.chart) w.chart.release();
      w.VChartStatPlots.registerStatPlots();
      w.chart = new w.VChart.default(compiled, { dom: 'statplot-mount', autoFit: false, animation: false });
      w.chartErrors = [];
      await w.chart.renderAsync();
      const renderMs = performance.now() - start;
      start = performance.now();
      await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, data: [...data, data[0]] }));
      const updateMs = performance.now() - start;
      return { count, compileMs, renderMs, updateMs, binCount: compiled.series[0].data.values.length };
    }, count);
    const before = await read(page);
    expectRegular(before, count + 1);
    const start = Date.now();
    await resize(page, 420, 360);
    const resizeMs = Date.now() - start;
    expectRegular(await read(page), count + 1);
    expect(raw(await read(page))).toEqual(raw(before));
    const releaseMs = await page.evaluate(() => {
      const start = performance.now();
      (window as any).chart.release();
      return performance.now() - start;
    });
    await expect(page.locator('canvas')).toHaveCount(0);
    timings.push({ ...timing, resizeMs, releaseMs });
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'lifecycle-timing.json'), JSON.stringify(timings, null, 2));
});
