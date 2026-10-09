import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
const compile = (spec: object) => compileStatPlot(spec as any) as any;
const values = (spec: object, id: string) => compile(spec).series.find((s: any) => s.id === id).data.values;
const kinds = [
  'countPlot',
  'confusionMatrix',
  'rocCurve',
  'precisionRecallCurve',
  'calibrationCurve',
  'qqPlot',
  'autocorrelationPlot'
];
test.each(kinds)('%s keeps an explicit empty state with omitted options', type => {
  const chart = compile({ type, data: [] });
  expect(chart.title.subtext).toContain('暂无可绘制数据');
  expect(chart.series.every((s: any) => s.data.values.length === 0)).toBe(true);
});
test('curve groups use separate labels, thresholds and denominators even when interleaved', () => {
  const data = Object.freeze([
    Object.freeze({ actual: true, score: 0, series: 'B' }),
    Object.freeze({ actual: true, score: 9, series: 'A' }),
    Object.freeze({ actual: false, score: 1, series: 'B' }),
    Object.freeze({ actual: false, score: 8, series: 'A' }),
    Object.freeze({ actual: true, score: 2, series: 'B' })
  ]);
  for (const [type, id, metric] of [
    ['rocCurve', 'roc', 'auc'],
    ['precisionRecallCurve', 'pr', 'averagePrecision']
  ]) {
    const rows = values({ type, data }, id);
    expect([...new Set(rows.map((r: any) => r.series))]).toEqual(['B', 'A']);
    expect(rows.filter((r: any) => r.series === 'A').every((r: any) => r[metric] === 1 && r.sampleCount === 2)).toBe(
      true
    );
    expect(rows.filter((r: any) => r.series === 'B').every((r: any) => r.sampleCount === 3)).toBe(true);
  }
});
test('all-positive PR is valid and AP is exactly one', () => {
  const rows = values(
    {
      type: 'precisionRecallCurve',
      data: [
        { actual: true, score: -2 },
        { actual: true, score: 10 }
      ]
    },
    'pr'
  );
  expect(rows.every((r: any) => r.averagePrecision === 1 && r.precision === 1)).toBe(true);
});
test('calibration quantiles belong to each group; empty uniform bins are omitted', () => {
  const data = [0.1, 0.2, 0.8, 0.9].map((probability, i) => ({
    probability,
    actual: i % 2 === 0,
    series: i < 2 ? 'A' : 'B'
  }));
  const rows = values(
    { type: 'calibrationCurve', binning: { strategy: 'quantile', binCount: 2 }, data },
    'calibration'
  );
  expect(rows.filter((r: any) => r.series === 'A').map((r: any) => r.binStart)).toEqual([0.1, 0.15000000000000002]);
  expect(rows.filter((r: any) => r.series === 'B').map((r: any) => r.binStart)).toEqual([0.8, 0.8500000000000001]);
  expect(
    values(
      { type: 'calibrationCurve', binning: { binCount: 5 }, data: [{ actual: false, probability: 0 }] },
      'calibration'
    )
  ).toHaveLength(1);
});
test('confusion classOrder permits absent classes while normalization exposes zero denominators', () => {
  for (const normalization of ['actual', 'predicted']) {
    const chart = compile({
      type: 'confusionMatrix',
      normalization,
      classOrder: ['C', 'B', 'A'],
      data: [{ actual: 'A', predicted: 'B' }]
    });
    const rows = chart.series.flatMap((s: any) => s.data.values);
    expect(rows).toHaveLength(9);
    expect(rows.filter((r: any) => r.value === null)).toHaveLength(6);
    expect(chart.axes[0].domain).toEqual(['C', 'B', 'A']);
  }
});
test('QQ sorting and ACF preserve group sample order without modifying frozen input', () => {
  const data = Object.freeze(
    [2, 0, 3, 1, 7, 4, 6, 5].map((value, i) => Object.freeze({ value, series: i % 2 ? 'A' : 'B' }))
  );
  const qq = values({ type: 'qqPlot', data }, 'quantiles');
  expect(qq.filter((r: any) => r.series === 'B').map((r: any) => r.sampleQuantile)).toEqual([2, 3, 6, 7]);
  const grouped = values({ type: 'autocorrelationPlot', maxLag: 2, confidence: false, data }, 'values');
  const single = values(
    {
      type: 'autocorrelationPlot',
      maxLag: 2,
      confidence: false,
      data: data.filter(r => r.series === 'B').map(r => ({ value: r.value }))
    },
    'values'
  );
  expect(grouped.filter((r: any) => r.series === 'B').map((r: any) => r.correlation)).toEqual(
    single.map((r: any) => r.correlation)
  );
});
test.each([
  { type: 'autocorrelationPlot', method: 'pacf', maxLag: 2, data: [1, 2, 3, 4].map(value => ({ value })) },
  { type: 'autocorrelationPlot', data: [{ value: 1 }, { value: null }] },
  {
    type: 'autocorrelationPlot',
    confidence: { level: 1 - Number.EPSILON / 2 },
    data: [1, 2, 3, 4].map(value => ({ value }))
  },
  { type: 'qqPlot', distribution: 'normal', data: [{ value: 1 }] },
  { type: 'calibrationCurve', binning: { binCount: 513 }, data: [] },
  {
    type: 'rocCurve',
    data: [
      { actual: true, score: 1, series: 'A' },
      { actual: false, score: 2 }
    ]
  }
])('rejects unsupported raw input $type', spec => expect(validateStatPlot(spec).valid).toBe(false));
