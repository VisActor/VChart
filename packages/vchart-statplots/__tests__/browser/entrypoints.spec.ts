import { test, expect } from '@playwright/test';
test('ESM consumer registers against its own VChart engine', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/__tests__/browser/esm.html');
  await page.waitForFunction(() => (window as any).esmReady);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        (window as any).esmChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics()[0].attribute.points.length
    )
  ).toBe(3);
  const violinRows = await page.evaluate(() => (window as any).esmChart.getSpec().series[0].data.values);
  expect(violinRows.map((row: any) => row.value)).toEqual([-2, 0, 2]);
  expect(violinRows[1].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
  expect(violinRows[1].__densityWidth).toBe(1);
  const distributions = await page.evaluate(async () => {
    const w = window as any;
    const results = [];
    for (const spec of [
      { type: 'kdePlot', data: [{ value: 0 }], estimation: { bandwidth: 1 }, sampling: { points: 3 } },
      { type: 'ecdfPlot', data: [4, 1, 0, 1].map(value => ({ value })) }
    ]) {
      await w.esmChart.updateSpec(w.esmCompile(spec));
      results.push({
        rows: w.esmChart.getSpec().series[0].data.values,
        points: w.esmChart.getChart().getAllSeries()[0].getSeriesMark().getGraphics()[0].attribute.points.length
      });
    }
    return results;
  });
  expect(distributions[0].rows.map((row: any) => row.value)).toEqual([-3, 0, 3]);
  expect(distributions[0].rows[1].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
  expect(distributions[0].points).toBe(3);
  expect(distributions[1].rows.map((row: any) => row.cumulativeProbability)).toEqual([0, 0.25, 0.75, 1, 1]);
  expect(distributions[1].points).toBe(5);
  const boxes = await page.evaluate(async () => {
    const w = window as any;
    await w.esmChart.updateSpec(
      w.esmCompile({ type: 'boxPlot', data: [0, 1, 2, 3, 4, 5, 6, 7, 100].map(value => ({ category: 'A', value })) })
    );
    const series = w.esmChart.getChart().getAllSeries()[0];
    return {
      rows: w.esmChart.getSpec().series[0].data.values,
      boxes: series.getMarkInName('boxPlot').getGraphics().length,
      outliers: series.getMarkInName('outlier').getGraphics().length
    };
  });
  expect(boxes.rows[0]).toMatchObject({ q1: 2, median: 4, q3: 6, whiskerLower: 0, whiskerUpper: 7, outliers: [100] });
  expect(boxes.boxes).toBe(1);
  expect(boxes.outliers).toBe(1);
  const raw = await page.evaluate(async () => {
    const w = window as any;
    await w.esmChart.updateSpec(
      w.esmCompile({ type: 'qqPlot', referenceLine: 'quartiles', data: [3, 1, 2].map(value => ({ value })) })
    );
    const qq = w.esmChart.getSpec().series[0].data.values;
    await w.esmChart.updateSpec(
      w.esmCompile({ type: 'autocorrelationPlot', maxLag: 2, data: [1, 2, 3, 4].map(value => ({ value })) })
    );
    const acf = w.esmChart.getSpec().series.find((s: any) => s.id === 'values').data.values;
    return { qq, acf };
  });
  expect(raw.qq.map((r: any) => r.sampleQuantile)).toEqual([1, 2, 3]);
  expect(raw.qq[0].theoreticalQuantile).toBeCloseTo(-0.6744897501960817, 7);
  expect(raw.acf[1].correlation).toBeCloseTo(0.25, 14);
  expect(raw.acf[1].upper).toBeCloseTo(0.979981992270027, 7);
  const regressions = await page.evaluate(async () => {
    const w = window as any;
    const results = [];
    const data = [0, 1, 2, 3, 4, 5].map(x => ({ x, y: 1 + 2 * x + (x * x) / 2 }));
    for (const regression of [
      { method: 'linear' },
      { method: 'polynomial', degree: 2 },
      { method: 'lowess', span: 1, iterations: 0 }
    ]) {
      await w.esmChart.updateSpec(
        w.esmCompile({ type: 'scatterPlot', data, fit: { input: 'observations', ...regression, confidence: false } })
      );
      const curve = w.esmChart.getSpec().series.find((s: any) => s.id === 'fit').data.values;
      await w.esmChart.updateSpec(w.esmCompile({ type: 'residualPlot', input: 'observations', data, regression }));
      const rows = w.esmChart.getSpec().series[0].data.values;
      results.push({ method: regression.method, curve, rows });
    }
    return results;
  });
  regressions.forEach(result => {
    expect(result.curve.length).toBeGreaterThan(1);
    expect(result.rows).toHaveLength(6);
    result.rows.forEach((r: any) => expect(r.residual).toBeCloseTo(r.y - r.fittedValue, 12));
  });
  regressions[1].rows.forEach((r: any) => expect(r.residual).toBeCloseTo(0, 12));
  const statistics = await page.evaluate(async () => {
    const w = window as any;
    await w.esmChart.updateSpec(
      w.esmCompile({
        type: 'timeSeriesPlot',
        input: 'observations',
        errorBar: { kind: 'standardError' },
        data: [
          { time: '2026-01-01T00:00:00Z', value: 1 },
          { time: '2026-01-01T08:00:00+08:00', value: 5 }
        ]
      })
    );
    const time = w.esmChart.getSpec().series.at(-1).data.values;
    await w.esmChart.updateSpec(
      w.esmCompile({
        type: 'kdePlot',
        data: [-1, 0, 1].map(value => ({ value })),
        estimation: { bandwidthAdjust: 2 },
        sampling: { points: 3 }
      })
    );
    return { time, kde: w.esmChart.getSpec().series[0].data.values };
  });
  expect(statistics.time[0]).toMatchObject({ value: 3, lower: 1, upper: 5, sampleCount: 2 });
  expect(statistics.kde[0].bandwidth).toBeCloseTo(2 * Math.pow(3, -0.2), 12);
  expect(errors).toEqual([]);
  await page.evaluate(() => (window as any).esmChart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
