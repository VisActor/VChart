import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { ResidualPlotSpec } from '../../src/types';
const data = Array.from({ length: 21 }, (_, x) => ({ x, y: x === 10 ? 100 : x + Math.sin(x) }));
const compile = (spec: ResidualPlotSpec): any => compileStatPlot(spec);

test('default raw residuals use x; fitted axis changes coordinates but not statistics or row order', () => {
  const spec: ResidualPlotSpec = {
    type: 'residualPlot',
    input: 'observations',
    data: data.slice().reverse(),
    fieldLabels: { x: '自变量', y: '实际值', fittedValue: '预测' }
  };
  const before = JSON.stringify(spec),
    predictor = compile(spec),
    fitted = compile({ ...spec, xAxis: 'fitted' });
  expect(predictor.series[0].xField).toBe('x');
  expect(fitted.series[0].xField).toBe('fittedValue');
  expect(predictor.axes[0].title.text).toBe('自变量');
  expect(fitted.axes[0].title.text).toBe('预测');
  expect(predictor.series[0].data.values).toEqual(fitted.series[0].data.values);
  predictor.series[0].data.values.forEach((p: any, i: number) => {
    expect(p.x).toBe(spec.data[i].x);
    expect(p.residual).toBe(p.y - p.fittedValue);
    expect(p.residualKind).toBe('原始残差');
  });
  expect(JSON.stringify(spec)).toBe(before);
  expect(predictor.markLine.y).toBe(0);
});

test('LOWESS-generated residuals use the identical robust model as the scatter curve', () => {
  const residual = compile({
    type: 'residualPlot',
    input: 'observations',
    data,
    regression: { method: 'lowess', span: 0.5, iterations: 3 }
  });
  const scatter: any = compileStatPlot({
    type: 'scatterPlot',
    data,
    fit: { input: 'observations', method: 'lowess', span: 0.5, iterations: 3 }
  });
  const curve = scatter.series.find((s: any) => s.id === 'fit').data.values;
  residual.series[0].data.values.forEach((p: any, i: number) =>
    expect(p.fittedValue).toBeCloseTo(curve[i].estimate, 12)
  );
});

test('residual smooth is separate from generating residuals; fitted-value external modes stay intact', () => {
  const base: ResidualPlotSpec = { type: 'residualPlot', input: 'observations', data };
  const without = compile(base),
    withSmooth = compile({ ...base, smooth: { method: 'lowess', span: 0.5 } });
  expect(withSmooth.series).toHaveLength(2);
  expect(withSmooth.series[0].data.values.map((p: any) => p.residual)).toEqual(
    without.series[0].data.values.map((p: any) => p.residual)
  );
  expect(withSmooth.legends.seriesId).toEqual(['residuals', 'residual-trend']);
  const external = compile({
    type: 'residualPlot',
    input: 'predictions',
    data: [{ id: 'a', actual: 8, fittedValue: 10 }],
    smooth: { method: 'lowess' }
  });
  expect(external.series[0].xField).toBe('fittedValue');
  expect(external.series[0].data.values[0]).toMatchObject({ residual: -2, trend: expect.stringContaining('不可计算') });
  expect(external.series[1].data.values).toEqual([]);
});

test('optional identifiers preserve original error indices and duplicates in raw values remain samples', () => {
  const rows = [
    { x: 0, y: 1 },
    { id: 'a', x: 1, y: 2 },
    { x: 1, y: 2 },
    { id: 'a', x: 2, y: 3 }
  ];
  expect(validateStatPlot({ type: 'residualPlot', input: 'observations', data: rows }).errors).toContainEqual(
    expect.objectContaining({ code: 'DUPLICATE_KEY', path: '/data/3' })
  );
  expect(
    compile({ type: 'residualPlot', input: 'observations', data: rows.map(({ x, y }) => ({ x, y })) }).series[0].data
      .values
  ).toHaveLength(4);
});

test.each([
  { input: 'observations', data: [{ x: 1, y: 2 }], residualKind: 'raw' },
  {
    input: 'observations',
    data: [
      { x: 1, y: 2 },
      { x: 2, y: 3 }
    ],
    regression: { method: 'linear', degree: 2 }
  },
  { input: 'predictions', data: [{ id: '1', actual: 8, fittedValue: 10 }], regression: { method: 'linear' } },
  { input: 'predictions', data: [{ id: '1', actual: 8, fittedValue: 10 }], xAxis: 'predictor' },
  {
    input: 'residuals',
    residualKind: 'raw',
    data: [{ id: '1', fittedValue: 10, residual: 0 }],
    smooth: { method: 'linear' }
  }
])('rejects mixed residual input/algorithm semantics: %j', spec => {
  expect(validateStatPlot({ type: 'residualPlot', ...spec }).valid).toBe(false);
});

test('unrepresentable residual trends report the original row and field after skipping another series', () => {
  const data = [
    { id: '0', series: 'A', fittedValue: 0, residual: 0 },
    ...[1.6e308, 1.6e308, -1.6e308, -1.6e308].map((residual, i) => ({
      id: String(i),
      series: 'B',
      fittedValue: i,
      residual
    }))
  ];
  expect(() =>
    compileStatPlot({
      type: 'residualPlot',
      input: 'residuals',
      residualKind: 'raw',
      data,
      smooth: { method: 'lowess', span: 1, iterations: 0 }
    })
  ).toThrow('/data/1/residual');
});
