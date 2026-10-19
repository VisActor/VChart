import fixture from '../fixtures/regression-python.json';
import { compileStatPlot } from '../../src/compile';
import { regressionBootstrap } from '@visactor/vutils';
import type { RegressionOptions, ResidualObservationsSpec } from '../../src/types';

test.each(fixture.cases)('$name: raw regression predictions match independent Python', item => {
  const spec: ResidualObservationsSpec = {
    type: 'residualPlot',
    input: 'observations',
    data: item.data,
    regression: item.options as RegressionOptions
  };
  const chart: any = compileStatPlot(spec);
  chart.series[0].data.values.forEach((row: any, i: number) => {
    expect(Math.abs(row.fittedValue - item.expected[i])).toBeLessThan(fixture.absoluteTolerance);
    expect(Math.abs(row.residual - (item.data[i].y - item.expected[i]))).toBeLessThan(fixture.absoluteTolerance);
  });
});

test.each(fixture.bootstraps)(
  'paired $options.method degree=$options.degree intervals match NumPy at fixed indices',
  item => {
    const actual = regressionBootstrap(item.data, item.options as Parameters<typeof regressionBootstrap>[1]);
    actual.forEach((row, i) => {
      expect(row.x).toBe(item.expected[i].x);
      expect(Math.abs(row.lower - item.expected[i].lower)).toBeLessThan(fixture.absoluteTolerance);
      expect(Math.abs(row.upper - item.expected[i].upper)).toBeLessThan(fixture.absoluteTolerance);
    });
  }
);
