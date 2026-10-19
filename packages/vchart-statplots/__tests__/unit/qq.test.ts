import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';

const compile = (spec: object) => compileStatPlot(spec as any) as any;
test('QQ sorts raw samples at the Statsmodels a=0 plotting positions', () => {
  const data = Object.freeze([3, 1, 2].map(value => Object.freeze({ value })));
  const values = compile({ type: 'qqPlot', data }).series[0].data.values;
  expect(values.map((r: any) => r.sampleQuantile)).toEqual([1, 2, 3]);
  values.forEach((r: any, i: number) =>
    expect(r.theoreticalQuantile).toBeCloseTo([-0.6744897501960817, 0, 0.6744897501960817][i], 7)
  );
  expect(values.map((r: any) => r.probability)).toEqual([0.25, 0.5, 0.75]);
});
test('QQ quartile line uses original samples rather than fitting the normal parameters', () => {
  const chart = compile({ type: 'qqPlot', data: [0, 1, 2, 3].map(value => ({ value })), referenceLine: 'quartiles' });
  const line = chart.series[1].data.values;
  expect(line[0].slope).toBeCloseTo(1.1119516638792015, 7);
  expect(line[0].intercept).toBeCloseTo(1.5, 7);
  const values = compile({
    type: 'qqPlot',
    data: [{ value: 9 }],
    distribution: { type: 'normal', mean: 5, standardDeviation: 2 }
  }).series[0].data.values;
  expect(values[0]).toMatchObject({ theoreticalQuantile: 5, sampleQuantile: 9 });
});
test('QQ keeps repetitions and valid constant/sample identity lines', () => {
  expect(
    compile({ type: 'qqPlot', data: [2, 2, 2].map(value => ({ value })), referenceLine: 'regression' }).series[0].data
      .values
  ).toHaveLength(3);
  const chart = compile({ type: 'qqPlot', data: [{ value: 0 }], referenceLine: 'identity' });
  const line = chart.series[1].data.values;
  expect(line[0].theoreticalQuantile).toBeLessThan(line[1].theoreticalQuantile);
});
test.each([
  { type: 'qqPlot', data: [{ theoreticalQuantile: 0, sampleQuantile: 1 }], distribution: 'normal' },
  { type: 'qqPlot', data: [{ value: 1 }], referenceLine: 'regression' },
  { type: 'qqPlot', data: [{ value: 1 }], distribution: { type: 'normal', standardDeviation: 0 } }
])('rejects invalid QQ contracts', spec => expect(validateStatPlot(spec).valid).toBe(false));
