import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
import { jitterOffset } from '../../src/common/jitter';
import fs from 'fs';
import path from 'path';
const types = [
  'countPlot',
  'missingValueMatrix',
  'stripPlot',
  'pairedComparisonPlot',
  'scatterPlot',
  'confusionMatrix',
  'precisionRecallCurve',
  'calibrationCurve'
];
test.each(types)('%s example is valid, immutable and compilable', type => {
  const spec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
  const original = JSON.stringify(spec);
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  expect(compileStatPlot(spec).type).toBe('common');
  expect(JSON.stringify(spec)).toBe(original);
});
test('confusion matrix keeps count and marks zero denominators undefined', () => {
  const spec = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../examples/specs/confusionMatrix.json'), 'utf8')
  );
  const chart = compileStatPlot(spec) as any;
  expect(chart.series[1].data.values).toHaveLength(3);
  expect(chart.series[0].data.values[0]).toMatchObject({ count: 38, value: 0.95 });
});
test('jitter is deterministic, bounded and keyed by id', () => {
  expect(jitterOffset('patient-1')).toBe(jitterOffset('patient-1'));
  for (let i = 0; i < 1000; i++) {
    expect(Math.abs(jitterOffset(String(i)))).toBeLessThanOrEqual(1);
  }
});
test.each([
  { type: 'countPlot', data: [{ category: 'A', count: -1 }] },
  {
    type: 'missingValueMatrix',
    data: [
      { observationId: 'A', variable: 'x', isMissing: false },
      { observationId: 'B', variable: 'y', isMissing: true }
    ]
  },
  { type: 'pairedComparisonPlot', categoryOrder: ['A', 'B'], data: [{ id: 'a', category: 'C', value: 1 }] },
  {
    type: 'calibrationCurve',
    data: [{ binStart: 0, binEnd: 0.2, meanPredictedProbability: 0.3, observedRate: 0.1, count: 5 }]
  },
  {
    type: 'scatterPlot',
    data: [{ x: 0, y: 1 }],
    fit: { method: 'OLS', data: [{ x: 0, estimate: 1, lower: 0, upper: 2 }] }
  },
  {
    type: 'precisionRecallCurve',
    data: [
      { recall: 0.5, precision: 0.3 },
      { recall: 0.2, precision: 0.8 }
    ]
  }
])('rejects inconsistent prepared input: $type', spec => {
  expect(validateStatPlot(spec).valid).toBe(false);
});
