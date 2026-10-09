import { test, expect } from '@playwright/test';
import path from 'path';

test('gallery switches all 28 types, validates JSON and exports the current chart', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('violinPlot');
  const types = await page
    .locator('#chart-nav a[data-type]')
    .evaluateAll(links => links.map(link => (link as HTMLAnchorElement).dataset.type));
  expect(types).toHaveLength(28);
  for (const type of types) {
    await page.locator(`#chart-nav a[data-type="${type}"]`).click();
    await expect(page.locator('#status')).toContainText(`${type} ·`);
    await expect(page.locator('#chart-nav [aria-current="page"]')).toHaveAttribute('data-type', type!);
    expect(new URL(page.url()).searchParams.get('type')).toBe(type);
    await expect(page.locator('#error')).toBeEmpty();
    await expect(page.locator('#plot canvas')).toHaveCount(1);
  }
  await page.locator('#theme').click();
  await expect(page.locator('#status')).toContainText('dark');
  const download = page.waitForEvent('download');
  await page.locator('#export').click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
  await page.locator('#input').fill('{"type":"rocCurve","data":[{"x":0,"y":1}]}');
  await page.locator('#render').click();
  await expect(page.locator('#error')).toContainText('/data/0');
  expect(errors).toEqual([]);
});

test('gallery shares URLs, restores the last type, and follows browser history', async ({ page }) => {
  await page.goto('/examples/index.html?type=missingValueMatrix&source=shared#preview');
  await expect(page.locator('#status')).toContainText('missingValueMatrix ·');
  await expect(page.locator('#chart-nav [aria-current="page"]')).toHaveAttribute('data-type', 'missingValueMatrix');
  const rocCurve = page.locator('#chart-nav a[data-type="rocCurve"]');
  await expect(rocCurve).toHaveAttribute('href', /\?type=rocCurve&source=shared#preview$/);
  await rocCurve.click();
  await expect(page.locator('#status')).toContainText('rocCurve ·');
  await expect(page).toHaveURL(/\?type=rocCurve&source=shared#preview$/);
  await page.goBack();
  await expect(page.locator('#status')).toContainText('missingValueMatrix ·');
  await page.goForward();
  await expect(page.locator('#status')).toContainText('rocCurve ·');
  await page.reload();
  await expect(page.locator('#status')).toContainText('rocCurve ·');
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('rocCurve ·');
  await expect(page).toHaveURL(/\?type=rocCurve$/);
  // 显式 URL 必须优先于已保存的 ROC。
  await page.goto('/examples/index.html?type=boxPlot');
  await expect(page.locator('#status')).toContainText('boxPlot ·');
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('boxPlot ·');
});

test('gallery normalizes unknown types and works when browser storage is unavailable', async ({ page }) => {
  await page.goto('/examples/index.html?type=unknown');
  await expect(page.locator('#status')).toContainText('violinPlot ·');
  await expect(page).toHaveURL(/\?type=violinPlot$/);
  await page.locator('#chart-nav a[data-type="countPlot"]').click();
  await expect(page.locator('#status')).toContainText('countPlot ·');
  await page.goto('/examples/index.html?type=unknown');
  await expect(page.locator('#status')).toContainText('countPlot ·');
  await page.evaluate(() => localStorage.setItem('vchart-statplots:last-type', 'unknown'));
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('violinPlot ·');

  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage disabled', 'SecurityError');
      }
    });
  });
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('violinPlot ·');
  await page.locator('#chart-nav a[data-type="ecdfPlot"]').click();
  await expect(page.locator('#status')).toContainText('ecdfPlot ·');
  await page.reload();
  await expect(page.locator('#status')).toContainText('ecdfPlot ·');
  await expect(page.locator('#error')).toBeEmpty();
});

test('gallery keeps the latest choice when an older example finishes loading later', async ({ page }) => {
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('violinPlot ·');
  let release: () => void = () => {};
  const delayed = new Promise<void>(resolve => {
    release = resolve;
  });
  await page.route('**/examples/specs/countPlot.json', async route => {
    const response = await route.fetch();
    await delayed;
    await route.fulfill({ response });
  });
  await page.locator('#chart-nav a[data-type="countPlot"]').click();
  await expect(page.locator('#status')).toContainText('正在加载 countPlot');
  await page.locator('#chart-nav a[data-type="missingValueMatrix"]').click();
  await expect(page.locator('#status')).toContainText('missingValueMatrix ·');
  const finished = page.waitForResponse('**/examples/specs/countPlot.json');
  release();
  await (await finished).finished();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.locator('#status')).toContainText('missingValueMatrix ·');
  await expect(page.locator('#input')).toHaveValue(/"type": "missingValueMatrix"/);
  await expect(page.locator('#chart-nav [aria-current="page"]')).toHaveAttribute('data-type', 'missingValueMatrix');
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('missingValueMatrix ·');
});

test('gallery updates navigation after a valid edited spec and supports keyboard links', async ({ page }) => {
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('violinPlot ·');
  await page
    .locator('#input')
    .fill('{"type":"rocCurve","data":[{"actual":false,"score":0},{"actual":true,"score":1}]}');
  await page.locator('#render').click();
  await expect(page.locator('#status')).toContainText('rocCurve ·');
  await expect(page).toHaveURL(/\?type=rocCurve$/);
  await expect(page.locator('#chart-nav [aria-current="page"]')).toHaveAttribute('data-type', 'rocCurve');
  await expect(page.locator('#schema')).toHaveAttribute('href', '/schema/plots/rocCurve.schema.json');
  await page.locator('#chart-nav a[data-type="boxPlot"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#status')).toContainText('boxPlot ·');
  await expect(page.locator('#error')).toBeEmpty();
});

test('gallery sidebar and preview fit desktop and narrow screens', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1000, height: 800 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/examples/index.html?type=violinPlot');
    await expect(page.locator('#status')).toContainText('violinPlot ·');
    await expect(page.locator('#plot canvas')).toHaveCount(1);
    const bounds = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      nav: document.getElementById('chart-nav')!.getBoundingClientRect().toJSON(),
      plot: document.getElementById('plot')!.getBoundingClientRect().toJSON()
    }));
    expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width);
    expect(bounds.plot.width).toBeGreaterThan(300);
    if (viewport.width > 640) expect(bounds.nav.right).toBeLessThan(bounds.plot.left);
    await page.screenshot({
      path: path.resolve(__dirname, `../../../../.vchart-statplots/screenshots/gallery-${viewport.width}.png`),
      fullPage: true
    });
  }
});

test('legacy URLs and storage migrate only the gallery entry point', async ({ page }) => {
  const entries: [string, string][] = [
    ['count', 'countPlot'],
    ['missingness', 'missingValueMatrix'],
    ['kde', 'kdePlot'],
    ['ecdf', 'ecdfPlot'],
    ['violin', 'violinPlot'],
    ['estimateInterval', 'pointIntervalPlot'],
    ['paired', 'pairedComparisonPlot'],
    ['scatter', 'scatterPlot'],
    ['hexbin', 'hexbinPlot'],
    ['timeSeries', 'timeSeriesPlot'],
    ['seasonal', 'seasonalPlot'],
    ['autocorrelation', 'autocorrelationPlot'],
    ['scree', 'screePlot'],
    ['embedding', 'embeddingPlot'],
    ['residual', 'residualPlot'],
    ['qq', 'qqPlot'],
    ['roc', 'rocCurve'],
    ['precisionRecall', 'precisionRecallCurve'],
    ['calibration', 'calibrationCurve'],
    ['featureImportance', 'featureImportancePlot'],
    ['shapBeeswarm', 'shapBeeswarmPlot']
  ];
  for (const [old, canonical] of entries) {
    await page.goto(`/examples/index.html?type=${old}&source=shared#preview`);
    await expect(page.locator('#status')).toContainText(`${canonical} ·`);
    expect(new URL(page.url()).searchParams.get('type')).toBe(canonical);
    expect(new URL(page.url()).searchParams.get('source')).toBe('shared');
    expect(new URL(page.url()).hash).toBe('#preview');
    await expect(page.locator('#chart-nav [aria-current="page"]')).toHaveAttribute('data-type', canonical);
  }
  await page.evaluate(() => localStorage.setItem('vchart-statplots:last-type', 'count'));
  await page.goto('/examples/index.html');
  await expect(page.locator('#status')).toContainText('countPlot ·');
  expect(await page.evaluate(() => localStorage.getItem('vchart-statplots:last-type'))).toBe('countPlot');
  await page.goto('/examples/index.html?type=roc');
  await expect(page.locator('#status')).toContainText('rocCurve ·');
  await page.locator('#input').fill('{"type":"count","data":[{"category":"A","count":3}]}');
  await page.locator('#render').click();
  await expect(page.locator('#error')).toContainText('/type');
  await expect(page).toHaveURL(/type=rocCurve/);
});

test('catalog names actual variants and reports a failed catalog load', async ({ page }) => {
  await page.goto('/examples/index.html?type=stripPlot');
  await expect(page.locator('#chart-title')).toHaveText('抖动散点图');
  await page
    .locator('#input')
    .fill('{"type":"stripPlot","layout":"swarm","data":[{"id":"a","category":"A","value":1}]}');
  await page.locator('#render').click();
  await expect(page.locator('#chart-title')).toHaveText('蜂群图');
  await page.goto('/examples/index.html?type=seasonalPlot');
  await expect(page.locator('#chart-title')).toHaveText('季节子序列图');
  await page.goto('/examples/index.html?type=pairPlot');
  await page.locator('#input').fill(
    JSON.stringify({
      type: 'pairPlot',
      variables: ['x', 'y'],
      diagonal: { type: 'histogram', binning: { binCount: 2 } },
      data: {
        observations: [
          { id: '0', values: { x: 0, y: 1 } },
          { id: '1', values: { x: 1, y: 0 } }
        ]
      }
    })
  );
  await page.locator('#render').click();
  await expect(page.locator('#chart-title')).toHaveText('自定义对角直方图的散点矩阵');
  // 相同父配置、不同深层箱数不能误命中两箱变体。
  await page
    .locator('#input')
    .fill((await page.locator('#input').inputValue()).replace('"binCount":2', '"binCount":3'));
  await page.locator('#render').click();
  await expect(page.locator('#chart-title')).toHaveText('散点矩阵图');
  await page.route('**/docs/plot-catalog.json', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.reload();
  await expect(page.locator('#error')).toContainText('图表目录加载失败（503）');
  await expect(page.locator('#render')).toBeDisabled();
  await expect(page.locator('#chart-nav a')).toHaveCount(0);
});
