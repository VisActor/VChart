import { test, expect, type Page } from '@playwright/test';

async function render(page: Page, spec: object) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), spec);
}

async function clickLegend(page: Page, label: string) {
  const position = await page.evaluate(label => {
    const graphic = (window as any).chart
      .getStage()
      .find((g: any) => g.name === 'legendItemLabel' && g.attribute.text === label, true);
    const b = graphic.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  }, label);
  await page.mouse.click(position.x, position.y);
  await page.mouse.move(990, 790);
}

async function state(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    return {
      errors: w.chartErrors,
      legend: w.chart
        .getChart()
        .getAllComponents()
        .find((c: any) => c.type === 'discreteLegend')
        .getLegendDefaultData(),
      legendItems: w.chart
        .getChart()
        .getAllComponents()
        .find((c: any) => c.type === 'discreteLegend')
        .getVRenderComponents()[0]
        .attribute.items.map((item: any) => ({ label: item.label, fill: item.shape.fill })),
      series: w.chart
        .getChart()
        .getAllSeries()
        .map((s: any) => ({
          id: s.userId,
          groups: Array.from(new Set(s.getViewData().latestData.map((d: any) => d.series))),
          xDomain: s.getXAxisHelper().getScale(0).domain(),
          yDomain: s.getYAxisHelper().getScale(0).domain(),
          graphics: s
            .getSeriesMark()
            .getGraphics()
            .map((g: any) => ({
              data: g.context.data.map((d: any) => ({
                id: d.id,
                series: d.series,
                category: d.category,
                value: d.value
              })),
              fill: g.attribute.fill,
              points: g.attribute.points?.map((p: any) => ({ x: p.x, y: p.y, defined: p.defined }))
            }))
        }))
    };
  });
}

test('external fit bands break at missing intervals through resize and updateSpec', async ({ page }, testInfo) => {
  const makeSpec = (gaps: number[]) => ({
    type: 'scatterPlot',
    data: [
      { x: 0, y: 1 },
      { x: 4, y: 1 }
    ],
    fit: {
      input: 'estimates',
      method: 'external',
      interval: { kind: 'confidence', level: 0.95 },
      data: [0, 1, 2, 3, 4].map(x => ({ x, estimate: 1, ...(gaps.includes(x) ? {} : { lower: 0.5, upper: 1.5 }) }))
    }
  });
  await render(page, makeSpec([2]));
  const check = async (gaps: number[]) => {
    const rendered = await page.evaluate(() => {
      const w = window as any;
      const series = w.chart.getChart().getAllSeries();
      const area = series.find((s: any) => s.userId === 'fit-band');
      const line = series.find((s: any) => s.userId === 'fit');
      return {
        errors: w.chartErrors,
        x: area.getViewData().latestData.map((d: any) => d.x),
        missing: area
          .getViewData()
          .latestData.filter((d: any) => d.lower === null && d.upper === null)
          .map((d: any) => d.x),
        area: area
          .getMarkInName('area')
          .getGraphics()[0]
          .attribute.points.map((p: any) => p.defined !== false),
        line: line
          .getMarkInName('line')
          .getGraphics()[0]
          .attribute.points.map((p: any) => p.defined !== false)
      };
    });
    expect(rendered.errors).toEqual([]);
    expect(rendered.x).toEqual([0, 1, 2, 3, 4]);
    expect(rendered.missing).toEqual(gaps);
    expect(rendered.area).toEqual([0, 1, 2, 3, 4].map(x => !gaps.includes(x)));
    expect(rendered.line).toEqual([true, true, true, true, true]);
  };
  await check([2]);
  await page.evaluate(async () => (window as any).chart.resize(900, 650));
  await check([2]);
  await page.evaluate(
    async spec => (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(spec)),
    makeSpec([])
  );
  await check([]);
  await page.evaluate(
    async spec => (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(spec)),
    makeSpec([1, 2])
  );
  await check([1, 2]);
  await page.screenshot({ path: testInfo.outputPath('fit-band-gaps.png') });
  const image = await page.screenshot();
  for (let i = 0; i < 4; i++) expect(await page.screenshot()).toEqual(image);
});

test('importance legend hides and restores bars, intervals and their axis contribution', async ({ page }, testInfo) => {
  await render(page, {
    type: 'featureImportancePlot',
    method: 'external',
    interval: { kind: 'confidence', level: 0.95 },
    data: [
      { feature: 'f', series: 'A', importance: 1, lower: 0.5, upper: 1.5 },
      { feature: 'f', series: 'B', importance: 100, lower: 99, upper: 101 }
    ]
  });
  const before = await state(page);
  expect(before.errors).toEqual([]);
  expect(before.legend).toEqual(['A', 'B']);
  expect(before.series.map(s => s.graphics.length)).toEqual([2, 2]);
  await clickLegend(page, 'B');
  await expect.poll(async () => (await state(page)).series.map(s => s.groups)).toEqual([['A'], ['A']]);
  const filtered = await state(page);
  expect(filtered.series.map(s => s.graphics.length)).toEqual([1, 1]);
  for (const series of filtered.series) expect(Math.max(...series.xDomain)).toBeLessThan(3);
  await page.evaluate(async () => (window as any).chart.resize(900, 650));
  expect((await state(page)).series.map(s => s.groups)).toEqual([['A'], ['A']]);
  await page.screenshot({ path: testInfo.outputPath('importance-filtered.png') });
  await clickLegend(page, 'B');
  await expect
    .poll(async () => (await state(page)).series.map(s => s.groups))
    .toEqual([
      ['A', 'B'],
      ['A', 'B']
    ]);
  const restored = await state(page);
  expect(restored.series.map(s => s.graphics.length)).toEqual([2, 2]);
  expect(Math.max(...restored.series[0].xDomain)).toBeGreaterThanOrEqual(101);
  expect(restored.errors).toEqual([]);
});

for (const categorical of [undefined, 'vchart', ['#123456', '#abcdef']]) {
  test(`paired legend filters object lines and keeps grouping/color through updates (${
    categorical ?? 'default'
  })`, async ({ page }, testInfo) => {
    const makeSpec = (offset = 0) => ({
      type: 'pairedComparisonPlot',
      categoryOrder: ['before', 'after'],
      ...(categorical ? { colors: { categorical } } : {}),
      data: ['A', 'B'].flatMap((series, group) =>
        [1, 2].flatMap(subject => [
          { id: `${series}-${subject}`, series, category: 'before', value: group * 100 + subject * 2 - 1 + offset },
          { id: `${series}-${subject}`, series, category: 'after', value: group * 100 + subject * 2 + offset }
        ])
      )
    });
    await render(page, makeSpec());
    const before = await state(page);
    expect(before.errors).toEqual([]);
    expect(before.legend).toEqual(['A', 'B']);
    expect(before.series.map(s => s.graphics.length)).toEqual([4, 8]);
    for (const item of before.legendItems) {
      const point = before.series[1].graphics.find(g => g.data[0].series === item.label)!;
      expect(item.fill).toBe(point.fill);
      if (Array.isArray(categorical)) expect(point.fill).toBe(categorical[item.label === 'A' ? 0 : 1]);
    }
    await clickLegend(page, 'B');
    await expect.poll(async () => (await state(page)).series.map(s => s.groups)).toEqual([['A'], ['A']]);
    const checkA = async (offset: number) => {
      const filtered = await state(page);
      expect(filtered.errors).toEqual([]);
      expect(filtered.series.map(s => s.graphics.length)).toEqual([2, 4]);
      const lines = filtered.series[0].graphics;
      expect(lines.map(g => g.data[0].id).sort()).toEqual(['A-1', 'A-2']);
      for (const line of lines) {
        expect(line.data.map((d: any) => d.category)).toEqual(['before', 'after']);
        expect(new Set(line.data.map((d: any) => d.id)).size).toBe(1);
        expect(line.points).toHaveLength(2);
        const subject = Number(line.data[0].id.split('-')[1]);
        expect(line.data.map((d: any) => d.value)).toEqual([subject * 2 - 1 + offset, subject * 2 + offset]);
      }
      for (const series of filtered.series) expect(Math.max(...series.yDomain)).toBeLessThan(10);
      const oldColor = before.series[1].graphics.find(g => g.data[0].series === 'A')!.fill;
      expect(filtered.series[1].graphics.every(g => g.fill === oldColor)).toBe(true);
      expect(filtered.legendItems).toEqual(before.legendItems);
    };
    await checkA(0);
    await page.evaluate(async () => (window as any).chart.resize(900, 650));
    await checkA(0);
    await page.evaluate(
      async spec => (window as any).chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(spec)),
      makeSpec(0.25)
    );
    await checkA(0.25);
    await page.screenshot({ path: testInfo.outputPath('paired-filtered.png') });
    const image = await page.screenshot();
    for (let i = 0; i < 4; i++) expect(await page.screenshot()).toEqual(image);
    await clickLegend(page, 'B');
    await expect
      .poll(async () => (await state(page)).series.map(s => s.groups))
      .toEqual([
        ['A', 'B'],
        ['A', 'B']
      ]);
    const restored = await state(page);
    expect(restored.series.map(s => s.graphics.length)).toEqual([4, 8]);
    expect(Math.max(...restored.series[0].yDomain)).toBeGreaterThanOrEqual(104);
    expect(restored.errors).toEqual([]);
  });
}
