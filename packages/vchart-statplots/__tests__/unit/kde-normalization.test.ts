import fs from 'fs';
import path from 'path';
import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { prepareViolin, estimateViolin } from '../../src/plots/violin/estimation';
const reference: { kde: Record<string, any>[]; violin: Record<string, any>[]; violinData: any[] } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../fixtures/time-kde-python-reference.json'), 'utf8')
);
const rows = (spec: any) => (compileStatPlot(spec) as any).series[0].data.values as any[];

test.each(reference.kde)(
  'SciPy Gaussian PDF: $method, adjust=$adjust',
  ({ data, method, adjust, bandwidth, values, density }) => {
    const result = rows({
      type: 'kdePlot',
      data: data.map((value: number) => ({ value })),
      estimation: { bandwidth: method, bandwidthAdjust: adjust },
      sampling: { points: 9 }
    });
    expect(result[0].bandwidth).toBeCloseTo(bandwidth, 12);
    result.forEach((row, i) => {
      expect(row.value).toBeCloseTo(values[i], 12);
      expect(row.density).toBeCloseTo(density[i], 12);
    });
  }
);

test.each(reference.violin)(
  'Seaborn sampled peak widths: $normalization, $scope',
  ({ normalization, scope, peakWidths }) => {
    const result = rows({
      type: 'violinPlot',
      data: reference.violinData,
      sampling: { points: 9 },
      densityNormalization: normalization,
      normalizationScope: scope
    });
    const peaks = Array.from(new Set(result.map(row => row.__violinGroup)), key =>
      Math.max(...result.filter(row => row.__violinGroup === key).map(row => row.__densityWidth))
    );
    peaks.forEach((width, i) => expect(width).toBeCloseTo(peakWidths[i], 12));
  }
);

test('KDE all weights by sample count without changing bandwidth or grid; legacy is explicit', () => {
  const spec = {
    type: 'kdePlot',
    data: [
      ...[-1, 0, 1].map(value => ({ value, series: 'A' })),
      ...Array.from({ length: 12 }, (_, i) => ({ value: (i % 3) - 1, series: 'B' }))
    ],
    sampling: { points: 9 }
  };
  const all = rows(spec),
    own = rows({ ...spec, normalizationScope: 'series' });
  all.forEach((row, i) => {
    expect(row.value).toBe(own[i].value);
    expect(row.bandwidth).toBe(own[i].bandwidth);
    expect(row.density / own[i].density).toBeCloseTo(row.series === 'A' ? 0.2 : 0.8, 12);
  });
  const legacy = rows({ ...spec, normalizationScope: 'series', estimation: { standardDeviation: 'population' } });
  expect(legacy[0].bandwidth / own[0].bandwidth).toBeCloseTo(Math.sqrt(2 / 3), 12);
});

test('cut only changes support; fixed bandwidth adjustment applies once; defaults differ by plot', () => {
  const spec = {
    type: 'kdePlot',
    data: [{ value: -1 }, { value: 1 }],
    estimation: { bandwidth: 1, bandwidthAdjust: 2 },
    sampling: { points: 3, cut: 0 }
  };
  expect(rows(spec).map(row => row.value)).toEqual([-1, 0, 1]);
  const tail = rows({ ...spec, sampling: { points: 3 } });
  expect(tail.map(row => row.value)).toEqual([-7, 0, 7]);
  expect(tail[1].density).toBe(rows(spec)[1].density);
  expect(
    rows({
      type: 'violinPlot',
      data: [{ category: 'A', value: 0 }],
      estimation: { bandwidth: 1 },
      sampling: { points: 3 }
    }).map(row => row.value)
  ).toEqual([-2, 0, 2]);
});

test.each([
  { estimation: { bandwidth: 1, standardDeviation: 'sample' }, path: '/estimation/standardDeviation' },
  { estimation: { bandwidthAdjust: 0 }, path: '/estimation/bandwidthAdjust' },
  { sampling: { cut: -1 }, path: '/sampling/cut' },
  { sampling: { cut: Infinity }, path: '/sampling/cut' },
  { data: [{ value: 0 }], estimation: { bandwidth: 1 }, sampling: { cut: 0 }, path: '/data/0/value' }
])('rejects ineffective or unrepresentable configuration at $path', ({ path, ...options }) => {
  const result = validateStatPlot({ type: 'kdePlot', data: [{ value: 0 }, { value: 1 }], ...options });
  expect(result.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path })]));
});

test('known density and sample scales distinguish area/count/width, each group evaluated once', () => {
  const prepared = prepareViolin({
    type: 'violinPlot',
    estimation: { bandwidth: 1 },
    sampling: { points: 2 },
    data: [
      ...Array.from({ length: 2 }, () => ({ category: 'A', value: 0 })),
      ...Array.from({ length: 8 }, () => ({ category: 'B', value: 0 }))
    ]
  });
  const first = jest.fn(() => [0.2, 0.4]);
  const second = jest.fn(() => [0.6, 0.8]);
  prepared.groups[0].model.evaluate = first as any;
  prepared.groups[1].model.evaluate = second as any;
  for (const [normalization, expected] of [
    ['area', 0.25],
    ['count', 0.125],
    ['width', 0.5]
  ] as const) {
    first.mockClear();
    second.mockClear();
    expect(estimateViolin(prepared, normalization).values[0].__densityWidth).toBe(expected);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  }
});
