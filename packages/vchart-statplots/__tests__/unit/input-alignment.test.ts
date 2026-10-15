import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
const compile = (spec: any): any => compileStatPlot(spec);
const table = (variables: string[], values: any[]) => ({
  variables,
  data: { observations: values.map((row, i) => ({ id: String(i), values: row })) }
});
describe('raw input alignment', () => {
  test('null alone is missing', () => {
    const spec = { type: 'missingValueMatrix', ...table(['a', 'b', 'c', 'd'], [{ a: 0, b: false, c: '', d: null }]) };
    expect(compile(spec).series[0].data.values.map((r: any) => r.status)).toEqual([
      '已观测',
      '已观测',
      '已观测',
      '缺失'
    ]);
    expect(
      validateStatPlot({ ...spec, data: { observations: [{ id: '0', values: { a: 0, b: false, c: '' } }] } }).valid
    ).toBe(false);
  });
  test('correlation excludes missing per pair and minSamples is real', () => {
    const spec = {
      type: 'correlationMatrix',
      ...table(
        ['a', 'b'],
        [
          { a: 1, b: 1 },
          { a: 2, b: null },
          { a: null, b: 3 },
          { a: 4, b: 4 }
        ]
      )
    };
    const values = compile(spec).series[0].data.values;
    expect(values.find((r: any) => r.row === 'a' && r.column === 'b')).toMatchObject({
      correlation: 1,
      sampleCount: 2
    });
    expect(compile({ ...spec, minSamples: 3 }).series[1].data.values).toHaveLength(2);
  });
  test('point interval calculates SEM and preserves external intervals', () => {
    const spec = {
      type: 'pointIntervalPlot',
      input: 'observations',
      data: [
        { category: 'A', value: 1 },
        { category: 'A', value: 3 }
      ],
      errorBar: { kind: 'standardError' }
    };
    expect(compile(spec).series.find((s: any) => s.id === 'estimates').data.values[0]).toMatchObject({
      estimate: 2,
      lower: 1,
      upper: 3,
      sampleCount: 2
    });
    expect(validateStatPlot({ ...spec, interval: { kind: 'range' } }).valid).toBe(false);
    const result = compile({
      type: 'pointIntervalPlot',
      input: 'estimates',
      data: [{ category: 'A', estimate: 0, lower: 1, upper: 2 }],
      interval: { kind: 'range' }
    });
    expect(result.series.find((s: any) => s.id === 'estimates').data.values[0].estimate).toBe(0);
  });
  test('residual direction and repeated subjects across models', () => {
    const spec = {
      type: 'residualPlot',
      input: 'predictions',
      data: [
        { id: '1', actual: 8, fittedValue: 10, series: 'A' },
        { id: '1', actual: 8, fittedValue: 7, series: 'B' }
      ]
    };
    expect(compile(spec).series[0].data.values.map((r: any) => r.residual)).toEqual([-2, 1]);
  });
  test('folds use population standard deviation', () => {
    const spec = {
      type: 'learningCurve',
      input: 'folds',
      metric: 'Accuracy',
      data: [
        { trainSize: 100, fold: '1', split: 'validation', score: 0.6 },
        { trainSize: 100, fold: '2', split: 'validation', score: 0.8 }
      ]
    };
    const row = compile(spec).series.find((s: any) => s.id === 'scores').data.values[0];
    expect(row.score).toBeCloseTo(0.7, 12);
    expect(row.standardDeviation).toBeCloseTo(0.1, 12);
    expect(row.lower).toBeCloseTo(0.6, 12);
    expect(row.upper).toBeCloseTo(0.8, 12);
  });
});

describe('explicit modes and statistical boundaries', () => {
  const observations = {
    type: 'pointIntervalPlot',
    input: 'observations',
    data: [
      { category: 'A', value: 1 },
      { category: 'A', value: 3 }
    ]
  };
  test.each([
    {},
    { input: 'unknown' },
    { interval: { kind: 'range' } },
    { estimator: 'unsupported' },
    { errorBar: { kind: 'confidence', resamples: 1 } },
    { errorBar: { kind: 'confidence', seed: -1 } },
    { errorBar: { kind: 'confidence', seed: 1.5 } },
    { errorBar: { kind: 'percentile', level: 1 } },
    { errorBar: { kind: 'range', resamples: 100 } },
    { errorBar: { kind: 'standardError', multiplier: 0 } },
    { errorBar: { kind: 'standardError' }, estimator: 'median' }
  ])('rejects invalid mode or effective parameters %#', options => {
    const spec = { ...observations, ...options };
    if (!Object.keys(options).length) {
      delete (spec as any).input;
    }
    expect(validateStatPlot(spec).valid).toBe(false);
  });
  test('mode discriminator error points to input', () => {
    expect(validateStatPlot({ ...observations, input: 'unknown' }).errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: '/input' })])
    );
  });
  test.each([false, { kind: 'confidence' }, { kind: 'standardError' }, { kind: 'standardDeviation' }])(
    'one observation keeps the estimate without caps: %j',
    errorBar => {
      const native = compile({ ...observations, data: [{ category: 'A', value: 2 }], errorBar });
      expect(native.series.find((s: any) => s.id === 'estimates').data.values[0]).toMatchObject({
        estimate: 2,
        lower: null,
        upper: null
      });
      expect(native.series.find((s: any) => s.id === 'caps').data.values).toEqual([]);
    }
  );
  test.each([{ kind: 'range' }, { kind: 'percentile' }, { kind: 'confidence' }])(
    'constant samples have a defined zero-width interval: %j',
    errorBar => {
      const native = compile({
        ...observations,
        data: [
          { category: 'A', value: 2 },
          { category: 'A', value: 2 }
        ],
        errorBar
      });
      expect(native.series.find((s: any) => s.id === 'estimates').data.values[0]).toMatchObject({
        estimate: 2,
        lower: 2,
        upper: 2
      });
    }
  );
  test('bootstrap does not mutate, is order independent, and groups use independent RNG state', () => {
    const data = [1, 2, 10, 4, 7].map(value => Object.freeze({ category: 'A', value }));
    const errorBar = { kind: 'confidence', seed: 7, resamples: 1000 };
    const native = compile({ ...observations, data: Object.freeze(data), errorBar });
    const row = native.series.find((s: any) => s.id === 'estimates').data.values[0];
    expect(
      compile({ ...observations, data: [...data].reverse(), errorBar }).series.find((s: any) => s.id === 'estimates')
        .data.values[0]
    ).toEqual(row);
    const grouped = compile({
      ...observations,
      data: [...data.map(r => ({ ...r, category: 'B' })), ...data],
      errorBar
    });
    expect(grouped.series.find((s: any) => s.id === 'estimates').data.values[1]).toEqual(row);
  });
  test('generated log interval is checked, and computation overflow is exposed', () => {
    expect(() =>
      compile({
        ...observations,
        data: [
          { category: 'A', value: 1 },
          { category: 'A', value: 100 }
        ],
        valueScale: 'log',
        errorBar: { kind: 'standardDeviation', multiplier: 2 }
      })
    ).toThrow();
    expect(() =>
      compile({ type: 'residualPlot', input: 'predictions', data: [{ id: '1', actual: 1e308, fittedValue: -1e308 }] })
    ).toThrow();
  });
  test('external estimates and model residuals are never reestimated', () => {
    const native = compile({
      type: 'residualPlot',
      input: 'residuals',
      residualKind: 'studentized',
      data: [{ id: '1', fittedValue: 10, residual: -1.2 }]
    });
    expect(native.series[0].data.values[0]).toMatchObject({ residual: -1.2, residualKind: '学生化残差' });
    expect(
      validateStatPlot({
        type: 'residualPlot',
        input: 'predictions',
        residualKind: 'studentized',
        data: [{ id: '1', actual: 8, fittedValue: 10 }]
      }).valid
    ).toBe(false);
    expect(
      validateStatPlot({
        type: 'pointIntervalPlot',
        input: 'estimates',
        data: [{ category: 'A', estimate: 0, lower: 1, upper: 2 }],
        interval: { kind: 'credible', level: 0.95 },
        errorBar: false
      }).valid
    ).toBe(false);
  });
  test('residual subject ids are unique within series', () => {
    expect(
      validateStatPlot({
        type: 'residualPlot',
        input: 'predictions',
        data: [
          { id: '1', actual: 8, fittedValue: 10 },
          { id: '1', actual: 8, fittedValue: 7 }
        ]
      }).valid
    ).toBe(false);
  });
  test.each([
    { variables: ['a', 'a'], data: { observations: [] } },
    { variables: ['a'], data: { observations: [{ id: '1', values: { a: 0, b: 1 } }] } },
    {
      variables: ['a'],
      data: {
        observations: [
          { id: '1', values: { a: 0 } },
          { id: '1', values: { a: 1 } }
        ]
      }
    },
    { variables: ['a'], data: { observations: [{ id: '', values: { a: 0 } }] } },
    { variables: ['a'], data: { observations: [{ id: '1', values: { a: NaN } }] } }
  ])('observation table rejects unsupported states %#', options => {
    expect(validateStatPlot({ type: 'missingValueMatrix', ...options }).valid).toBe(false);
  });
  test('correlation rejects strings and constant diagonals are NA for all methods', () => {
    expect(validateStatPlot({ type: 'correlationMatrix', ...table(['a'], [{ a: '1' }]) }).valid).toBe(false);
    for (const method of ['pearson', 'spearman', 'kendall']) {
      const native = compile({ type: 'correlationMatrix', method, ...table(['a'], [{ a: 2 }, { a: 2 }]) });
      expect(native.series[1].data.values[0]).toMatchObject({ correlation: null, sampleCount: 2 });
    }
  });
  const folds = [
    { trainSize: 100, fold: '1', split: 'validation', score: 0.6 },
    { trainSize: 100, fold: '2', split: 'validation', score: 0.8 }
  ];
  test('learning folds require consistent sets and preserve summaries', () => {
    const base = { type: 'learningCurve', input: 'folds', metric: 'MSE', data: folds };
    expect(validateStatPlot({ ...base, data: folds.slice(0, 1) }).valid).toBe(false);
    expect(
      validateStatPlot({
        ...base,
        data: [...folds, ...folds.map((r, i) => ({ ...r, trainSize: 200, fold: String(i + 2) }))]
      }).valid
    ).toBe(false);
    expect(
      validateStatPlot({
        ...base,
        data: [...folds, ...folds.map((r, i) => ({ ...r, split: 'train', fold: String(i + 2) }))]
      }).valid
    ).toBe(false);
    expect(validateStatPlot({ ...base, data: [...folds, folds[0]] }).valid).toBe(false);
    expect(compile({ ...base, spread: false }).series.map((s: any) => s.id)).toEqual(['scores']);
    const native = compile({
      type: 'learningCurve',
      input: 'summaries',
      metric: 'MSE',
      data: [{ trainSize: 100, split: 'train', score: 2, lower: 1, upper: 3 }],
      interval: { kind: 'prediction', level: 0.95 }
    });
    expect(native.series.find((s: any) => s.id === 'scores').data.values[0]).toMatchObject({
      score: 2,
      lower: 1,
      upper: 3
    });
  });
});
