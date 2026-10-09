import fs from 'fs';
import path from 'path';
import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
const fixture = (type: string) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
const types = [
  'countPlot',
  'missingValueMatrix',
  'histogram',
  'kdePlot',
  'ecdfPlot',
  'boxPlot',
  'violinPlot',
  'stripPlot',
  'pointIntervalPlot',
  'pairedComparisonPlot',
  'scatterPlot',
  'hexbinPlot',
  'correlationMatrix',
  'pairPlot',
  'timeSeriesPlot',
  'seasonalPlot',
  'autocorrelationPlot',
  'screePlot',
  'embeddingPlot',
  'residualPlot',
  'qqPlot',
  'confusionMatrix',
  'rocCurve',
  'precisionRecallCurve',
  'calibrationCurve',
  'learningCurve',
  'featureImportancePlot',
  'shapBeeswarmPlot'
];
const oldTypes = [
  'count',
  'missingness',
  'kde',
  'ecdf',
  'violin',
  'estimateInterval',
  'paired',
  'scatter',
  'hexbin',
  'timeSeries',
  'seasonal',
  'autocorrelation',
  'scree',
  'embedding',
  'residual',
  'qq',
  'roc',
  'precisionRecall',
  'calibration',
  'featureImportance',
  'shapBeeswarm'
];
test('all canonical types have exactly one schema and valid main example', () => {
  const files = fs.readdirSync(path.resolve(__dirname, '../../schema/plots'));
  expect(files.sort()).toEqual(types.map(type => `${type}.schema.json`).sort());
  for (const type of types) expect(validateStatPlot(fixture(type))).toEqual({ valid: true, errors: [] });
});
test.each(oldTypes)('rejects legacy public type %s', type => {
  expect(validateStatPlot({ type, data: [] }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/type' })])
  );
});
const fieldCases = [
  ['countPlot', '', 'statistic', 'normalization'],
  ['histogram', '', 'statistic', 'normalization'],
  ['missingValueMatrix', 'data', 'observationId', 'observation'],
  ['missingValueMatrix', 'data', 'isMissing', 'missing'],
  ['violinPlot', '', 'densityNormalization', 'widthScale'],
  ['stripPlot', '', 'jitterRatio', 'jitter'],
  ['pointIntervalPlot', '', 'referenceLine', 'reference'],
  ['pairedComparisonPlot', '', 'categoryOrder', 'categories'],
  ['correlationMatrix', 'data', 'correlation', 'value'],
  ['correlationMatrix', '', 'variableOrder', 'order'],
  ['autocorrelationPlot', 'data', 'value', 'correlation'],
  ['residualPlot', 'data', 'fittedValue', 'fitted'],
  ['qqPlot', 'data', 'value', 'theoretical'],
  ['qqPlot', 'data', 'value', 'observed'],
  ['qqPlot', '', 'referenceLine', 'reference'],
  ['precisionRecallCurve', '', 'baseline', 'prevalence'],
  ['calibrationCurve', 'data', 'probability', 'meanPredicted'],
  ['seasonalPlot', 'data', 'cycle', 'season'],
  ['seasonalPlot', 'data', 'phase', 'period'],
  ['seasonalPlot', '', 'phaseOrder', 'periodOrder']
];
test.each(fieldCases)('%s rejects legacy %s field %s → %s', (type, scope, canonical, old) => {
  const spec = fixture(type);
  if (canonical === 'jitterRatio') spec.jitterRatio = 0.3;
  if (canonical === 'variableOrder') spec.variableOrder = [...new Set(spec.data.map((row: any) => row.row))];
  expect(validateStatPlot(spec).valid).toBe(true);
  const target = scope === 'data' ? spec.data[0] : spec;
  target[old] = target[canonical];
  delete target[canonical];
  const result = validateStatPlot(spec);
  expect(result.valid).toBe(false);
  expect(result.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ code: 'SCHEMA_ERROR', path: `${scope ? '/data/0' : ''}/${old}` })
    ])
  );
});
test.each(types.filter(type => type !== 'pairPlot'))('%s rejects legacy labels', type => {
  expect(validateStatPlot({ ...fixture(type), labels: {} }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/labels' })])
  );
});
test('rejects retired enum values without silently normalizing', () => {
  expect(validateStatPlot({ ...fixture('histogram'), statistic: 'probability' }).valid).toBe(false);
  expect(validateStatPlot({ ...fixture('confusionMatrix'), normalization: 'true' }).valid).toBe(false);
});
test('count statistic normalizes separately within each series', () => {
  const data = [
    ...Array.from('AAABBBBBBB', category => ({ category, series: 'one' })),
    ...Array.from('AABB', category => ({ category, series: 'two' }))
  ];
  const compiled = compileStatPlot({
    type: 'countPlot',
    statistic: 'proportion',
    normalizationScope: 'series',
    data
  }) as any;
  expect(compiled.series[0].data.values.map((row: any) => row.proportion)).toEqual([0.3, 0.7, 0.5, 0.5]);
  expect((compileStatPlot({ type: 'countPlot', data }) as any).series[0].yField).toBe('count');
});
test.each([
  ['actual', [0.8, 0.2, 0.1, 0.9]],
  ['predicted', [8 / 9, 2 / 11, 1 / 9, 9 / 11]],
  ['all', [0.4, 0.1, 0.05, 0.45]]
])('confusion normalization %s uses the documented denominator', (normalization, expected) => {
  const chart = compileStatPlot({
    type: 'confusionMatrix',
    normalization,
    data: [
      ...Array.from('AAAAAAAABB', predicted => ({ actual: 'A', predicted })),
      ...Array.from('ABBBBBBBBB', predicted => ({ actual: 'B', predicted }))
    ]
  } as any) as any;
  expect(chart.series[0].data.values.map((row: any) => row.value)).toEqual(expected);
});
test('QQ keeps theoretical and sample directions with its computed reference line', () => {
  const chart = compileStatPlot({
    type: 'qqPlot',
    referenceLine: 'regression',
    data: [1, 3, 5].map(value => ({ value }))
  }) as any;
  expect(chart.series[0].xField).toBe('theoreticalQuantile');
  expect(chart.series[0].yField).toBe('sampleQuantile');
  expect(chart.series[1].data.values.map((row: any) => row.sampleQuantile)).toEqual([1, 5]);
});
test('jitterRatio validates units and does not turn other layouts into jitter', () => {
  for (const value of [0, 0.5])
    expect(validateStatPlot({ ...fixture('stripPlot'), jitterRatio: value }).valid).toBe(true);
  for (const value of [-0.1, 0.51])
    expect(validateStatPlot({ ...fixture('stripPlot'), jitterRatio: value }).errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: '/jitterRatio', code: 'INVALID_RANGE' })])
    );
  expect(validateStatPlot({ ...fixture('stripPlot'), layout: 'swarm', jitterRatio: 0.3 }).valid).toBe(false);
});
test('PR derives its baseline and rejects external positiveRate', () => {
  const spec = { ...fixture('precisionRecallCurve'), baseline: true };
  const chart = compileStatPlot(spec) as any;
  expect(chart.series[1].data.values.every((row: any) => row.precision === 0.5)).toBe(true);
  expect(validateStatPlot({ ...spec, positiveRate: 0.2 }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/positiveRate' })])
  );
});
