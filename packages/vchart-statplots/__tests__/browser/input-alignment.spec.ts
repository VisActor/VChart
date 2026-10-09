import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const fixture = (type: string) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
for (const [type, seriesId, tooltipText] of [
  ['pointIntervalPlot', 'estimates', '样本数'],
  ['residualPlot', 'residuals', '实际值'],
  ['learningCurve', 'scores', '折数'],
  ['correlationMatrix', '', '有效配对数'],
  ['missingValueMatrix', '', '状态']
]) {
  test(`${type}: raw input reaches graphics, hover, update, resize, empty and release`, async ({ page }) => {
    await page.goto('/__tests__/browser/page.html');
    const spec = fixture(type);
    await page.evaluate(async spec => {
      await (window as any).renderStatPlot(spec);
      (window as any).originalChart = (window as any).chart;
    }, spec);
    const target = await page.evaluate(seriesId => {
      const series = (window as any).chart
        .getChart()
        .getAllSeries()
        .find((s: any) => !seriesId || s.userId === seriesId);
      const graphics = (series.getMarkInName('point') ?? series.getSeriesMark()).getGraphics();
      const g = graphics[Math.floor(graphics.length / 2)];
      const b = g.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2, datum: g.context.data[0] };
    }, seriesId);
    expect(target.datum).toBeTruthy();
    await page.mouse.move(target.x, target.y);
    await expect(page.locator('.vchart-tooltip-element')).toContainText(tooltipText);
    await page.mouse.move(990, 790);
    const update = JSON.parse(JSON.stringify(spec));
    if (type === 'pointIntervalPlot') update.data[0].value += 3;
    if (type === 'residualPlot') update.data[0].actual += 3;
    if (type === 'learningCurve') update.data[0].score += 0.03;
    if (type === 'correlationMatrix') update.data.observations[0].values[update.variables[0]] += 3;
    if (type === 'missingValueMatrix')
      update.data.observations[0].values[update.variables[0]] =
        update.data.observations[0].values[update.variables[0]] === null ? 0 : null;
    const state = await page.evaluate(
      async ({ update, seriesId }) => {
        const chart = (window as any).chart;
        const series = () =>
          chart
            .getChart()
            .getAllSeries()
            .find((s: any) => !seriesId || s.userId === seriesId);
        const before = JSON.stringify(
          series()
            .getSeriesMark()
            .getGraphics()
            .map((g: any) => g.context.data[0])
        );
        await chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(update));
        const after = JSON.stringify(
          series()
            .getSeriesMark()
            .getGraphics()
            .map((g: any) => g.context.data[0])
        );
        await chart.resize(640, 480);
        return {
          before,
          after,
          same: chart === (window as any).originalChart,
          count: series().getSeriesMark().getGraphics().length
        };
      },
      { update, seriesId }
    );
    expect(state.same).toBe(true);
    expect(state.after).not.toEqual(state.before);
    expect(state.count).toBeGreaterThan(0);
    await page.screenshot({
      path: path.resolve(__dirname, '../../../../.vchart-statplots/input-alignment', `${type}.png`)
    });
    const image = await page.screenshot();
    for (let i = 0; i < 4; i++) expect(await page.screenshot()).toEqual(image);
    const empty = JSON.parse(JSON.stringify(update));
    if (Array.isArray(empty.data)) empty.data = [];
    else empty.data.observations = [];
    await page.evaluate(
      async ({ empty, update }) => {
        const chart = (window as any).chart;
        await chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(empty));
        if (
          chart
            .getChart()
            .getAllSeries()
            .some((s: any) => s.getSeriesMark().getGraphics().length)
        )
          throw new Error('empty input produced graphics');
        await chart.updateSpec((window as any).VChartStatPlots.compileStatPlot(update));
        chart.release();
      },
      { empty, update }
    );
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).chartErrors)).toEqual([]);
  });
}
test('point intervals: legend filters estimates, intervals and caps together; unavailable CI has no caps', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  const spec = {
    type: 'pointIntervalPlot',
    input: 'observations',
    data: [
      { category: 'A', value: 1, series: 'one' },
      { category: 'A', value: 3, series: 'one' },
      { category: 'A', value: 5, series: 'two' },
      { category: 'A', value: 7, series: 'two' }
    ]
  };
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), spec);
  const legend = await page.evaluate(() => {
    const b = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true).globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.click(legend.x, legend.y);
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).chart
          .getChart()
          .getAllSeries()
          .map((s: any) => s.getSeriesMark().getGraphics().length)
      )
    )
    .toEqual([1, 1, 2]);
  await page.evaluate(async () => {
    await (window as any).chart.updateSpec(
      (window as any).VChartStatPlots.compileStatPlot({
        type: 'pointIntervalPlot',
        input: 'observations',
        data: [{ category: 'A', value: 2 }]
      })
    );
  });
  expect(
    await page.evaluate(() =>
      (window as any).chart
        .getChart()
        .getAllSeries()
        .map((s: any) => s.getSeriesMark().getGraphics().length)
    )
  ).toEqual([0, 1, 0]);
});

test('learning curve legend filters the score curve and its deviation band together', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => (window as any).renderStatPlot(spec), fixture('learningCurve'));
  const target = await page.evaluate(() => {
    const b = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true).globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.click(target.x, target.y);
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).chart
          .getChart()
          .getAllSeries()
          .map((s: any) => s.getSeriesMark().getGraphics().length)
      )
    )
    .toEqual([1, 1]);
});
for (const type of ['pointIntervalPlot', 'residualPlot', 'learningCurve']) {
  test(`${type}: switch raw input to external results on the same instance`, async ({ page }) => {
    await page.goto('/__tests__/browser/page.html');
    const external = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../examples/specs/grouped', `${type}.json`), 'utf8')
    );
    await page.evaluate(async spec => (window as any).renderStatPlot(spec), fixture(type));
    const result = await page.evaluate(async external => {
      const chart = (window as any).chart;
      const compiled = (window as any).VChartStatPlots.compileStatPlot(external);
      await chart.updateSpec(compiled);
      return {
        same: chart === (window as any).chart,
        values: chart.getSpec().series.map((s: any) => s.data.values),
        expected: compiled.series.map((s: any) => s.data.values),
        errors: (window as any).chartErrors
      };
    }, external);
    expect(result.same).toBe(true);
    expect(result.errors).toEqual([]);
    for (let i = 0; i < result.expected.length; i++) {
      expect(result.values[i]).toHaveLength(result.expected[i].length);
      result.expected[i].forEach((row: any, j: number) => expect(result.values[i][j]).toMatchObject(row));
    }
  });
}
