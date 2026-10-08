import { binHistogram, collectHistogramExtent } from '../../src/plots/histogram/binning';
import { histogramDomain, makeHistogramEdges } from '../../src/common/histogram';
import { histogramObservations } from '../fixtures/histogram';

test('internal boundaries belong to the right bin and the maximum is retained', () => {
  const result = binHistogram(histogramObservations, 2);
  expect(result.edges).toEqual([0, 2, 4]);
  expect(result.bins).toEqual([
    { binStart: 0, binEnd: 2, count: 2 },
    { binStart: 2, binEnd: 4, count: 3 }
  ]);
  expect(result.sampleSize).toBe(5);
});

test('duplicate observations count independently; immutable input order does not affect bins', () => {
  const data = Object.freeze([0, 1, 2, 2, 3, 4].map(value => Object.freeze({ value })));
  const result = binHistogram(data, 2);
  expect(result.bins.map(bin => bin.count)).toEqual([2, 4]);
  expect(binHistogram(data.slice().reverse(), 2)).toEqual(result);
  expect(binHistogram([data[3], data[5], data[1], data[0], data[4], data[2]], 2)).toEqual(result);
});

test('zero-frequency bins preserve the full continuous domain', () => {
  expect(binHistogram([{ value: 0 }, { value: 4 }], 4).bins.map(bin => bin.count)).toEqual([1, 0, 0, 1]);
});

test('empty, single and constant input have explicit domains', () => {
  expect(binHistogram([])).toEqual({ sampleSize: 0, domain: [0, 1], edges: [], bins: [] });
  expect(binHistogram([{ value: 0 }], 200).bins).toEqual([{ binStart: -0.5, binEnd: 0.5, count: 1 }]);
  const result = binHistogram([{ value: 1e12 }, { value: 1e12 }], 20);
  expect(result.domain).toEqual([5e11, 1.5e12]);
  expect(result.bins).toEqual([{ binStart: 5e11, binEnd: 1.5e12, count: 2 }]);
});

test('Sturges defaults use sample size; explicit bin counts control the resolution', () => {
  expect(binHistogram(histogramObservations).bins).toHaveLength(4);
  expect(binHistogram(histogramObservations, 1).bins.map(bin => bin.count)).toEqual([5]);
});

test('automatic edges merge rounding duplicates; explicit counts cannot silently change', () => {
  const extent = collectHistogramExtent([{ value: 1 }, { value: 1 + Number.EPSILON }]);
  expect(makeHistogramEdges(extent)?.edges).toEqual([1, 1 + Number.EPSILON]);
  expect(makeHistogramEdges(extent, 2)).toBeNull();
  expect(makeHistogramEdges(extent, 1)?.edges).toEqual([1, 1 + Number.EPSILON]);
});

test('overflowing spans and constant domains fail at the numeric boundary', () => {
  expect(
    histogramDomain(collectHistogramExtent([{ value: -Number.MAX_VALUE }, { value: Number.MAX_VALUE }]))
  ).toBeNull();
  expect(makeHistogramEdges(collectHistogramExtent([{ value: Number.MAX_VALUE }]))).toBeNull();
});

test.each([1, 2, 20, 200])('negative and large-offset values conserve counts with %s bins', binCount => {
  for (const offset of [-100, 1e12]) {
    const data = Array.from({ length: 10001 }, (_, i) => ({ value: offset + (i % 997) / 10 }));
    const result = binHistogram(data, binCount);
    expect(result.bins).toHaveLength(binCount);
    expect(result.bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(data.length);
    result.bins.forEach((bin, i) => {
      expect(Number.isFinite(bin.binStart) && Number.isFinite(bin.binEnd)).toBe(true);
      expect(bin.binEnd).toBeGreaterThan(bin.binStart);
      if (i) expect(bin.binStart).toBe(result.bins[i - 1].binEnd);
    });
  }
});
