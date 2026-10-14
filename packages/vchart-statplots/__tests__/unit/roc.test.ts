import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';
const data = [
  { actual: true, score: 4 },
  { actual: false, score: -2 }
];
test('ROC accepts arbitrary finite scores and unordered immutable observations', () => {
  const spec = { type: 'rocCurve' as const, data: Object.freeze(data.map(row => Object.freeze(row))) as any };
  const before = JSON.stringify(spec);
  const chart = compileStatPlot(spec) as any;
  expect(chart.series[0].data.values.map((r: any) => r.threshold)).toEqual([undefined, 4, -2]);
  expect(JSON.stringify(spec)).toBe(before);
  expect(validateStatPlot({ ...spec, data: [...data].reverse() }).valid).toBe(true);
});
test('ROC rejects legacy coordinates and a group without both classes', () => {
  for (const spec of [
    { type: 'rocCurve', data: [{ fpr: 0, tpr: 1 }] },
    { type: 'rocCurve', data, metrics: [{ auc: 1 }] },
    { type: 'rocCurve', data: [{ actual: 1, score: 2 }] },
    { type: 'rocCurve', data: [{ actual: true, score: Infinity }] },
    { type: 'rocCurve', data: [{ actual: true, score: 2 }] }
  ])
    expect(validateStatPlot(spec).valid).toBe(false);
  expect(() => compileStatPlot({ type: 'rocCurve', data: [{ actual: true, score: Infinity }] })).toThrow(
    StatPlotValidationError
  );
});
