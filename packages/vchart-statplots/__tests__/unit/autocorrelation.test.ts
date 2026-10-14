import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
const compile = (spec: object) => compileStatPlot(spec as any) as any;
const values = (data: number[], options: object = {}) =>
  compile({ type: 'autocorrelationPlot', data: data.map(value => ({ value })), ...options }).series.find(
    (s: any) => s.id === 'values'
  ).data.values;
test('ACF uses full-series centering and non-adjusted autocovariance', () => {
  values([1, 2, 3, 4], { maxLag: 2, confidence: false }).forEach((r: any, i: number) =>
    expect(r.correlation).toBeCloseTo([1, 0.25, -0.3][i], 14)
  );
  values([1, 2, 3, 4], { method: 'pacf', maxLag: 1, confidence: false }).forEach((r: any, i: number) =>
    expect(r.correlation).toBeCloseTo([1, 0.25][i], 14)
  );
});
test('confidence bands are centered on zero and omit lag zero', () => {
  const chart = compile({ type: 'autocorrelationPlot', maxLag: 2, data: [1, 2, 3, 4].map(value => ({ value })) });
  const band = chart.series.find((s: any) => s.id === 'uncertainty').data.values;
  expect(band.map((r: any) => r.lag)).toEqual([0.5, 1, 2, 2.5]);
  expect(band[0].upper).toBeCloseTo(0.979981992270027, 7);
  expect(band[2].upper).toBeCloseTo(1.0394278682622582, 7);
  expect(band.every((r: any) => r.lower === -r.upper)).toBe(true);
});
test('ACF is shift/scale invariant and respects input order', () => {
  const data = [0, 3, 1, 5, 2, 7];
  const correlations = (input: number[]) =>
    values(input, { maxLag: 2, confidence: false }).map((r: any) => r.correlation);
  correlations(data.map(x => 100 - 5 * x)).forEach((r: number, i: number) =>
    expect(r).toBeCloseTo(correlations(data)[i], 14)
  );
  expect(correlations([...data].sort((a, b) => a - b))).not.toEqual(correlations(data));
});
test.each([
  { type: 'autocorrelationPlot', data: [{ value: 1 }] },
  { type: 'autocorrelationPlot', data: [{ value: 1 }, { value: 1 }] },
  { type: 'autocorrelationPlot', maxLag: 4, data: [1, 2, 3, 4].map(value => ({ value })) },
  { type: 'autocorrelationPlot', confidence: { level: 1 }, data: [1, 2, 3, 4].map(value => ({ value })) },
  { type: 'autocorrelationPlot', data: [{ lag: 1, correlation: 0.2 }] }
])('rejects undefined or legacy autocorrelation input', spec => expect(validateStatPlot(spec).valid).toBe(false));
