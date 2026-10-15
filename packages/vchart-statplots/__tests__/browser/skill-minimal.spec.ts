import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import {
  generate,
  openGenerated,
  tableRequest,
  histogram,
  expectRendered,
  marks,
  artifacts,
  skillRoot
} from './skill-helpers';

for (const width of [360, 420, 1000, 1440]) {
  test(`minimal default at ${width}px shows one title, units and real tooltip`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await openGenerated(page, generate(tableRequest([histogram()]), 'minimal'));
    await expectRendered(page);
    await expect(
      page.locator('.toolbar,button,select,input,details,footer,.provenance,.source,.chart-meta,.scope,.caption')
    ).toHaveCount(0);
    await expect(page.getByRole('heading')).toHaveCount(1);
    const state = await page.evaluate(() => {
      const c = (window as any).__DSV_CONTROLLERS__.get('hist');
      return { title: c.chart.getSpec().title, labels: c.spec.fieldLabels };
    });
    expect(state.title.text).toBe('');
    expect(state.labels.value).toBe('年龄（岁）');
    const target = (await marks(page, 'hist'))[0];
    await page.mouse.move(target.x, target.y);
    await expect(page.locator('.vchart-tooltip-element')).toContainText('数量');
    const box = await page.locator('.vchart-tooltip-element').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.mouse.move(0, 0);
    fs.mkdirSync(path.join(artifacts, 'simplification/screenshots'), { recursive: true });
    await page.screenshot({
      path: path.join(artifacts, `simplification/screenshots/minimal-${width}.png`),
      fullPage: true
    });
    expect(errors).toEqual([]);
  });
}

test('one parameter creates one selector and no unrelated actions', async ({ page }) => {
  const request = tableRequest([histogram()], {
    parameters: [{ chartId: 'hist', path: 'binning.binCount', values: [1, 2] }]
  });
  await openGenerated(page, generate(request));
  await expectRendered(page);
  await expect(page.locator('select')).toHaveCount(1);
  await expect(page.getByRole('button')).toHaveCount(0);
  await page.getByLabel('指标分布 · 分箱数', { exact: true }).selectOption('2');
  await expect.poll(async () => (await marks(page, 'hist')).map((g: any) => g.datum.count)).toEqual([2, 2]);
});

test('filter-only page preserves fixed conditions when editable filters clear', async ({ page }) => {
  const request = {
    ...tableRequest([histogram()], {
      filters: [{ field: 'x', kind: 'range' }],
      initialFilters: [{ field: 'group', kind: 'category', value: 'A' }]
    }),
    title: 'A 地区年龄分布'
  };
  await openGenerated(page, generate(request));
  await expectRendered(page);
  await expect(page.getByRole('button')).toHaveCount(2);
  await expect(page.locator('#summary')).toHaveText('当前筛选 2 条');
  await page.getByLabel('年龄 下界').fill('1');
  await page.locator('#apply').click();
  await expect(page.locator('#summary')).toHaveText('当前筛选 1 条');
  expect((await marks(page, 'hist'))[0].datum.count).toBe(1);
  await page.locator('#clear').click();
  await expect(page.locator('#summary')).toHaveText('当前筛选 2 条');
  expect(
    await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('hist').spec.data.map((r: any) => r.value))
  ).toEqual([0, 1]);
  await page.getByLabel('年龄 下界').fill('100');
  await page.locator('#apply').click();
  await expect(page.locator('#empty-hist')).toHaveText('暂无符合条件的数据');
  await page.locator('#clear').click();
  await expect(page.locator('#empty-hist')).toBeHidden();
  await page.screenshot({ path: path.join(artifacts, 'simplification/screenshots/filter-only.png'), fullPage: true });
});

for (const action of ['theme', 'exportPNG', 'exportSpec', 'saveView']) {
  test(`${action} is the only requested action`, async ({ page }) => {
    await openGenerated(page, generate({ ...tableRequest([histogram()]), presentation: { actions: [action] } }));
    await expectRendered(page);
    await expect(page.getByRole('button')).toHaveCount(1);
    if (action === 'theme') {
      await page.getByRole('button').click();
      await expect(page.locator('body')).toHaveClass('dark');
    } else {
      const event = page.waitForEvent('download');
      await page.getByRole('button').click();
      expect((await event).suggestedFilename()).toBe(
        action === 'exportPNG' ? 'hist.png' : action === 'exportSpec' ? 'statplots.json' : 'visualization.request.json'
      );
    }
  });
}

test('a fixed scope survives conversational rewrite without any page controls', async ({ page }) => {
  const chart = {
    id: 'comparison',
    binding: { type: 'boxPlot', fields: { category: 'group', value: 'y' }, options: { title: '收入' } }
  };
  const original = {
    ...tableRequest([chart], { initialFilters: [{ field: 'group', kind: 'category', value: 'A' }] }),
    title: 'A 地区收入分布'
  };
  const html = generate(original, 'dialogue');
  const request = JSON.parse(fs.readFileSync(path.join(path.dirname(html), 'visualization.request.json'), 'utf8'));
  expect(request.dataset.source.records).toHaveLength(4);
  request.charts[0].binding.type = 'violinPlot';
  await openGenerated(page, generate(request, 'dialogue-violin'));
  await expectRendered(page);
  await expect(page.locator('button,select,input,.toolbar')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.filteredN)).toBe(2);
  expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__.get('comparison').spec.fieldLabels.value)).toBe(
    '收入（元）'
  );
  request.controls.initialFilters = [];
  request.title = '全部地区收入分布';
  await openGenerated(page, generate(request, 'dialogue-cleared'));
  await expectRendered(page);
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.filteredN)).toBe(4);
});

for (const enabled of [false, true]) {
  test(`pair brush ${enabled ? 'requested' : 'absent'} changes actual selection accordingly`, async ({ page }) => {
    await openGenerated(
      page,
      generate(
        tableRequest([
          {
            id: 'pair',
            interactions: enabled ? ['brush'] : [],
            binding: { type: 'pairPlot', fields: { variables: ['x', 'y'] } }
          }
        ])
      )
    );
    await expectRendered(page);
    const target = await page.evaluate(() => {
      const c = (window as any).__DSV_CONTROLLERS__.get('pair').chart;
      const s = c
        .getChart()
        .getAllSeries()
        .find((s: any) => s.userId === 'scatter-0-1');
      const g = s
        .getSeriesMark()
        .getGraphics()
        .find((g: any) => g.context.data[0].id === '002');
      const b = g.globalAABBBounds;
      const canvas = document.querySelector('#dsv-pair canvas')!.getBoundingClientRect();
      return { x: canvas.x + (b.x1 + b.x2) / 2, y: canvas.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(target.x - 5, target.y - 5);
    await page.mouse.down();
    await page.mouse.move(target.x + 5, target.y + 5, { steps: 5 });
    await page.mouse.up();
    await expect
      .poll(async () =>
        (await marks(page, 'pair')).filter((g: any) => g.states?.includes('inBrush')).map((g: any) => g.datum.id)
      )
      .toEqual(enabled ? ['002', '002'] : []);
  });
  test(`group legend ${enabled ? 'requested' : 'static'} changes real displayed data accordingly`, async ({ page }) => {
    await openGenerated(
      page,
      generate(
        tableRequest([
          {
            id: 'count',
            interactions: enabled ? ['legendFilter'] : [],
            binding: { type: 'countPlot', fields: { category: 'group', series: 'group' } }
          }
        ])
      )
    );
    await expectRendered(page);
    const before = (await marks(page, 'count')).length;
    const target = await page.evaluate(() => {
      const c = (window as any).__DSV_CONTROLLERS__.get('count').chart;
      const b = c.getStage().find((g: any) => g.name === 'legendItem', true).globalAABBBounds;
      const canvas = document.querySelector('#dsv-count canvas')!.getBoundingClientRect();
      return { x: canvas.x + (b.x1 + b.x2) / 2, y: canvas.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(target.x, target.y);
    await expect.poll(async () => (await marks(page, 'count')).length).toBe(enabled ? before / 2 : before);
  });
}

for (const type of ['pairPlot', 'seasonalPlot']) {
  test(`${type} uses titleless public layout and retains semantic title`, async ({ page }) => {
    const resource = path.join(skillRoot, 'references/statplots');
    const catalog = JSON.parse(fs.readFileSync(path.join(resource, 'index.json'), 'utf8'));
    const entry = catalog.find((entry: any) => entry.type === type);
    const spec = JSON.parse(fs.readFileSync(path.join(resource, entry.example), 'utf8'));
    spec.description = '真实结果范围';
    await openGenerated(
      page,
      generate({ version: 1, title: '结果图', charts: [{ id: 'plot', spec, source: { label: '已有结果' } }] })
    );
    await expectRendered(page);
    const result = await page.evaluate(() => {
      const c = (window as any).__DSV_CONTROLLERS__.get('plot');
      const { title, description, ...input } = c.spec;
      const expected = (window as any).VChartStatPlots.compileStatPlot(input);
      return { title, description, layout: c.chart.getSpec().layout, expected: expected.layout };
    });
    expect(result.title).toBe(spec.title);
    expect(result.description).toBe('真实结果范围');
    expect(result.layout).toEqual(result.expected);
  });
}

test('default CDN failure finishes without tools and preserves detailed error', async ({ page }) => {
  const html = generate(tableRequest([histogram()]));
  await page.route('https://unpkg.com/**', route => route.abort());
  await page.goto(pathToFileURL(html).href);
  await expect.poll(() => page.evaluate(() => (window as any).__DSV_STATUS__?.ready)).toBe(true);
  await expect(page.locator('#error-hist')).toBeVisible();
  await expect(page.getByRole('button')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts[0].error)).toContain('图表库加载失败');
});

test('multi-chart units, titles and explicit caption remain without technical panels', async ({ page }) => {
  const pair = {
    id: 'pair',
    binding: { type: 'pairPlot', fields: { variables: ['x', 'y'] }, options: { title: '变量关系' } }
  };
  await openGenerated(page, generate(tableRequest([histogram(), { ...pair, caption: '样本范围：本月记录' }])));
  await expectRendered(page);
  await expect(page.getByRole('heading')).toHaveCount(3);
  await expect(page.locator('.units')).toContainText('收入（元）');
  await expect(page.locator('.caption')).toHaveText('样本范围：本月记录');
  await expect(page.locator('button,.toolbar,.source,.chart-meta')).toHaveCount(0);
  await page.screenshot({ path: path.join(artifacts, 'simplification/screenshots/multiple.png'), fullPage: true });
});
