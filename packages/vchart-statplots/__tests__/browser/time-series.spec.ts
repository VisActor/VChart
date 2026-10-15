import { test, expect } from '@playwright/test';
const time = (d: number) => `2026-01-${String(d).padStart(2, '0')}T00:00:00Z`;
async function read(page: any) {
  return page.evaluate(() => {
    const w = window as any;
    return {
      rows: w.chart.getSpec().series.at(-1).data.values,
      series: w.chart
        .getChart()
        .getAllSeries()
        .map((s: any) => ({
          id: s.userId,
          graphics: s
            .getSeriesMark()
            .getGraphics()
            .map((g: any) => ({
              points: g.attribute.points,
              datum: g.context?.data?.[0],
              color: g.attribute.stroke ?? g.attribute.fill,
              matrix: {
                a: g.globalTransMatrix.a,
                b: g.globalTransMatrix.b,
                c: g.globalTransMatrix.c,
                d: g.globalTransMatrix.d,
                e: g.globalTransMatrix.e,
                f: g.globalTransMatrix.f
              }
            }))
        })),
      errors: w.chartErrors
    };
  });
}
test('raw aggregation: actual points, null gaps, sample hover, legend band filtering and mode updates', async ({
  page
}) => {
  const data: any[] = [];
  for (const series of ['A', 'B'])
    for (const d of [1, 2, 3])
      for (const offset of [-1, 1])
        data.push({ series, time: time(d), value: d === 2 ? null : d * 3 + offset + (series === 'B' ? 4 : 0) });
  const spec: any = {
    type: 'timeSeriesPlot',
    input: 'observations',
    errorBar: { kind: 'range' },
    data: data.reverse()
  };
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), spec);
  const original = await read(page);
  expect(original.errors).toEqual([]);
  expect(original.rows.map((r: any) => r.sampleCount)).toEqual([2, 0, 2, 2, 0, 2]);
  const line = original.series.find((s: any) => s.id === 'observations').graphics[0];
  const band = original.series.find((s: any) => s.id === 'uncertainty').graphics[0];
  expect(line.points[1].defined).toBe(false);
  expect(band.points[1].defined).toBe(false);
  const p = line.points[0],
    m = line.matrix;
  await page.mouse.move(m.a * p.x + m.c * p.y + m.e, m.b * p.x + m.d * p.y + m.f);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('样本数');
  await expect(page.locator('.vchart-tooltip-element')).toContainText('样本范围');
  const legend = await page.evaluate(() => {
    const g = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true);
    const b = g.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.click(legend.x, legend.y);
  await expect.poll(async () => (await read(page)).series.map((s: any) => s.graphics.length)).toEqual([1, 1]);
  const filtered = await read(page);
  expect(filtered.series[0].graphics[0].datum.series).toBe(filtered.series[1].graphics[0].datum.series);
  // 更换输入模式须移除旧的不确定性图元。
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, estimator: false, errorBar: false }));
  }, spec);
  const direct = await read(page);
  expect(direct.series.map((s: any) => s.id)).toEqual(['observations']);
  expect(direct.rows).toHaveLength(12);
  expect(direct.rows[0].sampleCount).toBeUndefined();
  const external: any = {
    type: 'timeSeriesPlot',
    input: 'estimates',
    interval: { kind: 'range' },
    data: [
      { time: time(3), value: 8, lower: 7, upper: 9 },
      { time: time(1), value: 2, lower: 1, upper: 3 }
    ]
  };
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, external);
  const estimated = await read(page);
  expect(estimated.rows.map((r: any) => r.value)).toEqual([2, 8]);
  expect(estimated.rows[0].sampleCount).toBeUndefined();
  await page.evaluate(async () => (window as any).chart.resize(420, 320));
  expect((await read(page)).rows).toEqual(estimated.rows);
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
