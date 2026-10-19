import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { hexbinPoints } from '../fixtures/hexbin';

test.each([undefined, 1, 30, 200])('accepts raw scatter with xBins=%s', xBins => {
  const spec = { type: 'hexbinPlot', data: hexbinPoints(), ...(xBins === undefined ? {} : { binning: { xBins } }) };
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
});
test('accepts empty binning and rejects the legacy polygon protocol', () => {
  expect(validateStatPlot({ type: 'hexbinPlot', data: [{ x: 1, y: 2 }], binning: {} }).valid).toBe(true);
  expect(
    validateStatPlot({ type: 'hexbinPlot', data: [{ id: 'old', count: 1, vertices: [{ x: 0, y: 0 }] }] }).valid
  ).toBe(false);
  const invalid = validateStatPlot({ type: 'hexbinPlot', data: [], binning: { radius: 1 } });
  expect(invalid.errors.some(e => e.path === '/binning/radius')).toBe(true);
});
test.each([0, -1, 1.5, 201])('rejects invalid xBins=%s at its JSON pointer', xBins => {
  const result = validateStatPlot({ type: 'hexbinPlot', data: [], binning: { xBins } });
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.path === '/binning/xBins')).toBe(true);
});
test.each([
  [{ x: null, y: 0 }, '/data/0/x'],
  [{ x: '1', y: 0 }, '/data/0/x'],
  [{ x: NaN, y: 0 }, '/data/0/x'],
  [{ x: 1, y: Infinity }, '/data/0/y'],
  [{ x: 1 }, '/data/0/y'],
  [{ x: 1, y: 1, id: 'a' }, '/data/0/id'],
  [{ x: 1, y: 1, count: 2 }, '/data/0/count'],
  [{ x: 1, y: 1, vertices: [] }, '/data/0/vertices'],
  [{ x: 1, y: 1, series: 'a' }, '/data/0/series'],
  [{ x: 1, y: 1, weight: 2 }, '/data/0/weight']
])('rejects unsupported row fields and invalid coordinates: %j', (row, pointer) => {
  const result = validateStatPlot({ type: 'hexbinPlot', data: [row] });
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.path === pointer)).toBe(true);
});
test.each(
  [
    [
      { x: -1e308, y: 0 },
      { x: 1e308, y: 1 }
    ],
    [
      { x: -8.5e307, y: 0 },
      { x: 8.5e307, y: 1 }
    ],
    [
      { x: 1e308, y: 0 },
      { x: 1.79e308, y: 1 }
    ],
    [
      { x: 1e16, y: 0 },
      { x: 1e16 + 2, y: 1 }
    ],
    [
      { x: 0, y: 0 },
      { x: Number.MIN_VALUE, y: 1 }
    ]
  ].map(data => [data])
)('rejects unrepresentable vertex ranges at the boundary: %j', data => {
  expect(validateStatPlot({ type: 'hexbinPlot', data })).toEqual({
    valid: false,
    errors: [expect.objectContaining({ code: 'INVALID_RANGE', path: '/data' })]
  });
});
test('compiles occupied bins, original-unit bounds, aspect and shared count colors without mutating input', () => {
  const spec = {
    type: 'hexbinPlot' as const,
    data: hexbinPoints(),
    binning: { xBins: 8 },
    fieldLabels: { x: '收入', y: '评分', count: '样本数' }
  };
  const before = JSON.stringify(spec);
  const chart: any = compileStatPlot(spec);
  const rows = chart.series[0].data.values;
  expect(rows.reduce((sum: number, row: any) => sum + row.count, 0)).toBe(spec.data.length);
  expect(rows.length).toBeLessThan(spec.data.length);
  expect(rows.every((row: any) => row.count > 0 && row.vertices.length === 6)).toBe(true);
  expect(chart.layout.type).toBe('statplotsHexbin');
  expect(chart.layout.normalizedAspect).toBeGreaterThan(0);
  expect(chart.axes.every((axis: any) => axis.nice === false)).toBe(true);
  expect(chart.scales[0].domain[0]).toBe(0);
  expect(chart.scales[0].domain.slice(-1)[0]).toBe(Math.max(...rows.map((row: any) => row.count)));
  expect(chart.legends.title.text).toBe('样本数');
  expect(JSON.stringify(spec)).toBe(before);
  const defaultChart: any = compileStatPlot({ ...spec, binning: undefined });
  expect(defaultChart.series[0].data).toEqual(
    (compileStatPlot({ ...spec, binning: { xBins: 30 } }) as any).series[0].data
  );
});
test('empty scatter uses the normal empty state and hides the legend', () => {
  const chart: any = compileStatPlot({ type: 'hexbinPlot', data: [] });
  expect(chart.series[0].data.values).toEqual([]);
  expect(chart.axes.map((axis: any) => [axis.min, axis.max])).toEqual([
    [0, 1],
    [0, 1]
  ]);
  expect(chart.layout.normalizedAspect).toBe(1);
  expect(chart.legends.visible).toBe(false);
  expect(chart.title.subtext).toContain('暂无');
});
