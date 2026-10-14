import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';

const compile = (spec: object) => compileStatPlot(spec as any) as any;
const scoreData = [0.1, 0.4, 0.35, 0.8].map((score, i) => ({ score, actual: [false, false, true, true][i] }));
test('confusion matrix counts raw predictions and retains undefined denominators', () => {
  const chart = compile({
    type: 'confusionMatrix',
    normalization: 'actual',
    classOrder: ['A', 'B', 'C'],
    data: [
      ['A', 'A'],
      ['A', 'B'],
      ['A', 'B'],
      ['B', 'B']
    ].map(([actual, predicted]) => ({ actual, predicted }))
  });
  expect(chart.series[0].data.values.map((r: any) => r.count)).toEqual([1, 2, 0, 0, 1, 0]);
  expect(chart.series[0].data.values.map((r: any) => r.value)).toEqual([1 / 3, 2 / 3, 0, 0, 1, 0]);
  expect(chart.series[1].data.values.map((r: any) => r.value)).toEqual([null, null, null]);
});
test('ROC and PR compute complete threshold curves and distinct area definitions', () => {
  const roc = compile({ type: 'rocCurve', data: scoreData }).series[0].data.values;
  expect(roc.map((r: any) => [r.fpr, r.tpr])).toEqual([
    [0, 0],
    [0, 0.5],
    [0.5, 0.5],
    [0.5, 1],
    [1, 1]
  ]);
  expect(roc.every((r: any) => r.auc === 0.75)).toBe(true);
  expect(roc[0].threshold).toBeUndefined();
  const chart = compile({ type: 'precisionRecallCurve', data: scoreData });
  const pr = chart.series[0].data.values;
  expect(pr.map((r: any) => [r.recall, r.precision])).toEqual([
    [0, 1],
    [0.5, 1],
    [0.5, 0.5],
    [1, 2 / 3],
    [1, 0.5]
  ]);
  expect(pr[0].averagePrecision).toBeCloseTo(5 / 6, 14);
  expect(chart.series[0].line.style.curveType).toBe('stepBefore');
});
test('same-score observations enter a threshold together', () => {
  const data = [
    { actual: true, score: -2 },
    { actual: false, score: -2 }
  ];
  for (const input of [data, [...data].reverse()]) {
    const roc = compile({ type: 'rocCurve', data: input }).series[0].data.values;
    expect(roc).toHaveLength(2);
    expect(roc[0].auc).toBe(0.5);
    const pr = compile({ type: 'precisionRecallCurve', data: input }).series[0].data.values;
    expect(pr).toHaveLength(2);
    expect(pr[0].averagePrecision).toBe(0.5);
  }
});
test('calibration bin boundaries include equal values on the left', () => {
  const data = [0, 0.5, 0.5, 1].map((probability, i) => ({ probability, actual: [false, true, false, true][i] }));
  const rows = compile({ type: 'calibrationCurve', binning: { binCount: 2 }, data }).series[0].data.values;
  expect(rows.map((r: any) => [r.count, r.meanPredictedProbability, r.observedRate])).toEqual([
    [3, 1 / 3, 1 / 3],
    [1, 1, 1]
  ]);
});
test('constant probabilities and repeated quantile boundaries keep every sample', () => {
  const data = [true, true, false, false].map(actual => ({ actual, probability: 0.5 }));
  const rows = compile({ type: 'calibrationCurve', binning: { binCount: 4, strategy: 'quantile' }, data }).series[0]
    .data.values;
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ count: 4, meanPredictedProbability: 0.5, observedRate: 0.5 });
});
test.each([
  { type: 'rocCurve', data: [{ actual: true, score: 1 }] },
  { type: 'precisionRecallCurve', data: [{ actual: false, score: 1 }] },
  { type: 'calibrationCurve', data: [{ actual: true, probability: 2 }] },
  { type: 'rocCurve', data: [{ fpr: 0, tpr: 0 }] },
  { type: 'confusionMatrix', data: [{ actual: 'A', predicted: 'A', count: 1 }] }
])('rejects undefined statistics and old results', spec => expect(validateStatPlot(spec).valid).toBe(false));
