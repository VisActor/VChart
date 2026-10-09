import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
import fs from 'fs';
import path from 'path';
const types = [
  'timeSeriesPlot',
  'seasonalPlot',
  'autocorrelationPlot',
  'screePlot',
  'embeddingPlot',
  'residualPlot',
  'qqPlot',
  'learningCurve',
  'featureImportancePlot'
];
test.each(types)('%s example has immutable prepared results', type => {
  const spec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
  const original = JSON.stringify(spec);
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  expect(compileStatPlot(spec).type).toBe('common');
  expect(JSON.stringify(spec)).toBe(original);
});
test.each([
  { type: 'timeSeriesPlot', data: [{ time: '2026-01-01', value: 1 }] },
  {
    type: 'screePlot',
    data: [
      { component: 1, explainedVarianceRatio: 0.8 },
      { component: 2, explainedVarianceRatio: 0.5 }
    ]
  },
  {
    type: 'embeddingPlot',
    method: 'umap',
    dimensions: { x: { name: 'X', explainedVarianceRatio: 0.5 }, y: { name: 'Y' } },
    data: []
  },
  { type: 'autocorrelationPlot', method: 'acf', data: [{ lag: 0.5, correlation: 0.8 }] },
  { type: 'learningCurve', metric: 'MSE', data: [{ trainSize: 0, split: 'train', score: 2 }] },
  {
    type: 'featureImportancePlot',
    method: 'permutation',
    data: [{ feature: 'x', importance: -0.1, lower: 1, upper: 0 }],
    interval: { kind: 'range' }
  }
])('rejects unsupported semantics: $type', spec => {
  expect(validateStatPlot(spec).valid).toBe(false);
});
test('rejects prepared ACF while allowing negative importance', () => {
  expect(
    validateStatPlot({ type: 'autocorrelationPlot', method: 'acf', data: [{ lag: 1, correlation: 1.2 }] }).valid
  ).toBe(false);
  expect(
    validateStatPlot({
      type: 'featureImportancePlot',
      method: 'permutation',
      data: [{ feature: 'x', importance: -0.1 }]
    }).valid
  ).toBe(true);
});
test('time validation rejects impossible calendar dates and equivalent instants in different zones', () => {
  expect(validateStatPlot({ type: 'timeSeriesPlot', data: [{ time: '2026-02-30T12:00:00Z', value: 1 }] }).valid).toBe(
    false
  );
  expect(
    validateStatPlot({
      type: 'timeSeriesPlot',
      data: [
        { time: '2026-01-01T12:00:00Z', value: 1 },
        { time: '2026-01-01T20:00:00+08:00', value: 2 }
      ]
    }).valid
  ).toBe(false);
  expect(validateStatPlot({ type: 'timeSeriesPlot', data: [{ time: '2024-02-29T12:00:00Z', value: 1 }] }).valid).toBe(
    true
  );
});
