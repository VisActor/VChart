import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { ScatterPlotSpec, FeatureImportancePlotSpec, PairedComparisonPlotSpec } from '../../src/types';

const interval = { kind: 'confidence' as const, level: 0.95 };

test('external scatter intervals preserve missing positions without changing caller input', () => {
  const spec: ScatterPlotSpec = {
    type: 'scatterPlot',
    data: [
      { x: 0, y: 1 },
      { x: 4, y: 1 }
    ],
    fit: {
      input: 'estimates',
      method: 'external',
      interval,
      data: [0, 1, 2, 3, 4].map(x => ({ x, estimate: 1, ...(x === 2 ? {} : { lower: 0.5, upper: 1.5 }) }))
    }
  };
  const original = JSON.stringify(spec);
  expect(validateStatPlot(spec).valid).toBe(true);
  const chart: any = compileStatPlot(spec);
  const area = chart.series.find((s: any) => s.id === 'fit-band');
  expect(area.data.values.map((row: any) => row.x)).toEqual([0, 1, 2, 3, 4]);
  expect(area.data.values[2]).toMatchObject({ lower: null, upper: null });
  expect(area.invalidType).toBe('break');
  expect(chart.series.find((s: any) => s.id === 'fit').data.values).toHaveLength(5);
  expect(JSON.stringify(spec)).toBe(original);
});

test('importance intervals share the main series legend filter', () => {
  const spec: FeatureImportancePlotSpec = {
    type: 'featureImportancePlot',
    method: 'external',
    interval,
    data: [
      { feature: 'f', series: 'A', importance: 1, lower: 0.5, upper: 1.5 },
      { feature: 'f', series: 'B', importance: 100, lower: 99, upper: 101 }
    ]
  };
  expect(validateStatPlot(spec).valid).toBe(true);
  const chart: any = compileStatPlot(spec);
  expect(chart.series.find((s: any) => s.id === 'intervals').seriesField).toBe('series');
  expect(chart.legends.seriesId).toEqual(['importance', 'intervals']);
});

test('paired lines keep object grouping while the legend filters original series', () => {
  const spec: PairedComparisonPlotSpec = {
    type: 'pairedComparisonPlot',
    categoryOrder: ['before', 'after'],
    data: ['A', 'B'].flatMap((series, i) => [
      { id: `object-${series}`, series, category: 'before', value: i + 1 },
      { id: `object-${series}`, series, category: 'after', value: i + 2 }
    ])
  };
  expect(validateStatPlot(spec).valid).toBe(true);
  const chart: any = compileStatPlot(spec);
  expect(chart.series.find((s: any) => s.id === 'pairs').seriesField).toBe('id');
  expect(chart.legends).toMatchObject({ seriesId: ['observations', 'pairs'], scaleName: 'color', field: 'series' });
  expect(chart.color.domain).toEqual(['A', 'B']);
});
