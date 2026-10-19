import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';

const data = [0, 1, 2, 3, 4, 5].map(x => ({ x: 1e9 + x, y: 1 + 2 * x + (x * x) / 2 }));

test('raw polynomial scatter and residuals use the same model at actual observation x', () => {
  const scatter = compileStatPlot({
    type: 'scatterPlot',
    data,
    fit: { input: 'observations', method: 'polynomial', degree: 2, confidence: false }
  } as any) as any;
  const residual = compileStatPlot({
    type: 'residualPlot',
    input: 'observations',
    data,
    regression: { method: 'polynomial', degree: 2 }
  } as any) as any;
  const curve = scatter.series.find((s: any) => s.id === 'fit').data.values;
  expect(curve[0].estimate).toBeCloseTo(data[0].y, 10);
  const points = residual.series.find((s: any) => s.id === 'residuals').data.values;
  expect(residual.series[0].xField).toBe('x');
  points.forEach((p: any, i: number) => {
    expect(p.x).toBe(data[i].x);
    expect(p.fittedValue).toBeCloseTo(data[i].y, 10);
    expect(p.residual).toBeCloseTo(0, 10);
  });
});

test('raw fitting rejects unidentified models but pure scatter retains those observations', () => {
  const repeated = [
    { x: 1, y: 2 },
    { x: 1, y: 3 }
  ];
  expect(validateStatPlot({ type: 'scatterPlot', data: repeated }).valid).toBe(true);
  expect(
    validateStatPlot({ type: 'scatterPlot', data: repeated, fit: { input: 'observations', method: 'linear' } }).errors
  ).toContainEqual(expect.objectContaining({ code: 'INVALID_RANGE', path: '/data/0' }));
});
