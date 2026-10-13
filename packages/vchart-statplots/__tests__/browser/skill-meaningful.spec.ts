import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { generate, openGenerated, expectRendered, marks, artifacts } from './skill-helpers';

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/skill-meaningful-data.json'), 'utf8'));
const replays = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/skill-meaningful-requests.json'), 'utf8'));

function actualRequest(index: number) {
  const request = JSON.parse(JSON.stringify(replays.cases.find((entry: any) => entry.queryIndex === index).request));
  if (index === 4) {
    let seed = fixture.denseRecipe.seed;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    request.dataset.source = {
      records: Array.from({ length: fixture.denseRecipe.n }, (_, i) => {
        const x = 10 * random();
        return { id: String(i), x, y: 0.7 * x + random() - 0.5, sensor: i % 2 ? 'B' : 'A' };
      })
    };
  }
  return request;
}

async function render(page: Page, request: any) {
  await openGenerated(page, generate(request, 'meaningful'));
  await expectRendered(page);
  await expect(page.locator('button,select,input,.toolbar,.source,.chart-meta')).toHaveCount(0);
  return page.evaluate(() => {
    const c = (window as any).__DSV_CONTROLLERS__.get('chart');
    return { spec: c.spec, status: (window as any).__DSV_STATUS__.charts[0] };
  });
}

async function hover(page: Page, point: { x: number; y: number }, text: string[]) {
  await page.mouse.move(0, 0);
  await page.mouse.move(point.x, point.y);
  const tooltip = page.locator('.vchart-tooltip-element');
  await expect(tooltip).toBeVisible();
  for (const value of text) await expect(tooltip).toContainText(value);
}

test('actual income request retains zeros, duplicates, tail and missing denominator', async ({ page }) => {
  const result = await render(page, actualRequest(1));
  expect(result.spec.data.map((r: any) => r.value)).toEqual([0, 1000, 1000, 2000, 5000, 20000]);
  expect(result.status).toMatchObject({ inputN: 6, omittedN: 1 });
  expect(result.spec.fieldLabels.value).toBe('收入（元）');
  const bars = await marks(page, 'chart');
  expect(bars.map(g => g.datum.count)).toEqual([4, 1, 0, 1]);
  await hover(page, bars[0], ['收入（元）下界', '5000', '数量']);
});

test('actual small and constant group request shows individual observations', async ({ page }) => {
  const result = await render(page, actualRequest(2));
  expect(result.status).toMatchObject({ inputN: 6, omittedN: 1 });
  expect(result.spec.data.map((r: any) => r.id)).toEqual(['001', '002', '003', '004', '005', '006']);
  const points = await marks(page, 'chart');
  expect(points).toHaveLength(6);
  expect(points.filter(g => g.datum.category === 'B').map(g => g.datum.value)).toEqual([1000, 1000]);
  await hover(page, points.find(g => g.datum.id === '001')!, ['001', '部门', '收入（元）']);
});

test('actual threshold request displays the right-continuous probability 4/6 in Tooltip', async ({ page }) => {
  const result = await render(page, actualRequest(3));
  expect(result.status).toMatchObject({ inputN: 6, omittedN: 1 });
  const target = await page.evaluate(() => {
    const chart = (window as any).__DSV_CONTROLLERS__.get('chart').chart;
    const rows = chart.getSpec().series[0].data.values;
    const index = rows.findIndex((r: any) => r.value === 2000);
    const graphic = chart.getChart().getAllSeries()[0].getMarkInName('line').getGraphics()[0];
    const point = graphic.attribute.points[index];
    const matrix = graphic.globalTransMatrix;
    const canvas = document.querySelector('#dsv-chart canvas')!.getBoundingClientRect();
    return {
      probability: rows[index].cumulativeProbability,
      endProbability: rows[rows.length - 1].cumulativeProbability,
      curve: graphic.attribute.curveType,
      x: canvas.x + matrix.a * point.x + matrix.c * point.y + matrix.e,
      y: canvas.y + matrix.b * point.x + matrix.d * point.y + matrix.f
    };
  });
  expect(target.probability).toBe(4 / 6);
  expect(target.endProbability).toBe(1);
  expect(target.curve).toBe('stepAfter');
  await hover(page, target, ['收入（元）', '2000', String(4 / 6)]);
});

test('actual dense relationship request preserves all observations and both sensor series', async ({ page }) => {
  const request = actualRequest(4);
  const result = await render(page, request);
  expect(result.status).toMatchObject({ inputN: 5000, omittedN: 0 });
  expect(result.spec.fit).toBeUndefined();
  expect(result.spec.data.map((r: any) => ({ id: r.id, x: r.x, y: r.y, sensor: r.series }))).toEqual(
    request.dataset.source.records
  );
  const points = await marks(page, 'chart');
  expect(points).toHaveLength(5000);
  const seen = new Set<string>();
  // Later points are less likely to be covered. Observe the actual hit, rather than assuming the target is hit.
  for (const point of points.slice(-30)) {
    await hover(page, point, ['指标 X（mm）', '指标 Y（ms）']);
    const title = await page.locator('.vchart-tooltip-title').innerText();
    seen.add(title.trim());
    if (seen.has('A') && seen.has('B')) break;
  }
  expect([...seen].sort()).toEqual(['A', 'B']);
});

test('actual correlation request excludes numeric ID and explains constant-variable NA', async ({ page }) => {
  const result = await render(page, actualRequest(5));
  expect(result.spec.variables).toEqual(['height', 'weight', 'fixed_score']);
  expect(result.spec.data.observations).toHaveLength(7);
  const cells = await marks(page, 'chart');
  expect(cells).toHaveLength(9);
  const paired = cells.find(g => g.datum.row === 'height' && g.datum.column === 'weight')!;
  expect(paired.datum).toMatchObject({ sampleCount: 5, correlation: 1 });
  await hover(page, paired, ['有效配对数', '5', '相关系数']);
  const constant = cells.find(g => g.datum.row === 'fixed_score' && g.datum.column === 'height')!;
  expect(constant.datum).toMatchObject({ sampleCount: 6, correlation: null });
  await hover(page, constant, ['不可计算原因', '变量为常量，相关性不可定义']);
});

test('actual external UMAP retains provided coordinates, method, static legend and real Tooltip', async ({ page }) => {
  const request = actualRequest(6);
  const result = await render(page, request);
  expect(result.spec.method).toBe(fixture.embeddingResult.method);
  expect(result.spec.data).toEqual(fixture.embeddingResult.records);
  expect(result.spec.dimensions).toBeUndefined();
  const legend = await page.evaluate(() =>
    (window as any).__DSV_CONTROLLERS__
      .get('chart')
      .chart.getStage()
      .findAll((g: any) => g.name === 'legendItemLabel', true)
      .map((g: any) => ({ text: g.attribute.text, width: g.globalAABBBounds.width() }))
  );
  expect(legend.map((g: any) => g.text)).toEqual(['A', 'B']);
  expect(legend.every((g: any) => g.width > 0)).toBe(true);
  const points = await marks(page, 'chart');
  expect(points).toHaveLength(4);
  await hover(page, points.find(g => g.datum.id === 'p0')!, ['p0', 'UMAP 1', 'UMAP 2']);
  await page.mouse.move(0, 0);
  fs.mkdirSync(path.join(artifacts, 'resources/screenshots'), { recursive: true });
  await page.screenshot({ path: path.join(artifacts, 'resources/screenshots/umap-legend.png'), fullPage: true });
});

test('actual box-to-violin rewrite retains all source rows, units and fixed region', async ({ page }) => {
  const initial = replays.cases.find((entry: any) => entry.queryIndex === 7).initialRequest;
  const request = actualRequest(7);
  const before = await render(page, initial);
  const after = await render(page, request);
  expect(request.dataset).toEqual(initial.dataset);
  expect(request.controls).toEqual(initial.controls);
  expect(request.dataset.source.records).toEqual(fixture.rewriteDataset.records);
  expect(before.status.inputN).toBe(4);
  expect(after.status.inputN).toBe(4);
  expect(after.spec.fieldLabels.value).toBe('收入（元）');
  expect(after.spec.data.map((r: any) => r.value)).toEqual([0, 1000, 2000, 3000]);
  const saved = JSON.parse(
    fs.readFileSync(path.join(path.dirname(generate(request, 'rewrite')), 'visualization.request.json'), 'utf8')
  );
  expect(saved.dataset.source.records).toHaveLength(8);
  expect(saved.dataset.source.records.map((r: any) => r.id)).toEqual(
    fixture.rewriteDataset.records.map((r: any) => r.id)
  );
  saved.controls.initialFilters = [];
  const cleared = await render(page, saved);
  expect(cleared.status.inputN).toBe(8);
  expect(cleared.spec.data.map((r: any) => r.value)).toEqual(fixture.rewriteDataset.records.map((r: any) => r.income));
});
