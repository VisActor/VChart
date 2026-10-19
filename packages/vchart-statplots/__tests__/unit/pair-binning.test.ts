import {
  collectPairExtents,
  makePairEdges,
  pairDomain,
  preparePairDistributions
} from '../../src/plots/pair-plot/binning';
import { pairObservations, groupedPairObservations } from '../fixtures/pair-plot';

test('internal boundaries belong to the right bin and maximum belongs to the final bin', () => {
  const [x, y] = preparePairDistributions(pairObservations, ['x', 'y'], { enabled: true, binCount: 2 });
  expect(x).toEqual({
    variable: 'x',
    domain: [0, 4],
    sampleSize: 5,
    bins: [
      { binStart: 0, binEnd: 2, count: 2 },
      { binStart: 2, binEnd: 4, count: 3 }
    ]
  });
  expect(y.sampleSize).toBe(5);
  expect(y.domain).toEqual([1, 5]);
  expect(y.bins.map(b => b.count)).toEqual([2, 3]);
});

test('groups share boundaries, retain zero bins, and exclude null per variable', () => {
  const [x, y] = preparePairDistributions(groupedPairObservations, ['x', 'y'], { enabled: true, binCount: 2 });
  expect(x.bins).toEqual([
    { series: 'A', binStart: 0, binEnd: 2, count: 2 },
    { series: 'A', binStart: 2, binEnd: 4, count: 0 },
    { series: 'B', binStart: 0, binEnd: 2, count: 0 },
    { series: 'B', binStart: 2, binEnd: 4, count: 3 }
  ]);
  expect(y.bins.filter(b => b.series === 'C').map(b => b.count)).toEqual([0, 1]);
  expect(y.sampleSize).toBe(5);
});

test('Sturges uses valid observations from all groups', () => {
  const [x] = preparePairDistributions(groupedPairObservations, ['x'], { enabled: true });
  expect(x.bins.filter(b => b.series === 'A')).toHaveLength(4);
  expect(x.bins.reduce((sum, b) => sum + b.count, 0)).toBe(5);
});

test('empty, entirely missing and constant variables have explicit domains', () => {
  expect(preparePairDistributions([], ['x'], { enabled: true })).toEqual([
    { variable: 'x', domain: [0, 1], sampleSize: 0, bins: [] }
  ]);
  const rows = [0, 1, 2].map(i => ({ id: String(i), values: { x: 1e12, y: null } }));
  const [x, y] = preparePairDistributions(rows, ['x', 'y'], { enabled: true, binCount: 200 });
  expect(x.domain).toEqual([5e11, 1.5e12]);
  expect(x.bins).toEqual([{ binStart: 5e11, binEnd: 1.5e12, count: 3 }]);
  expect(y.bins).toEqual([]);
  expect(y.sampleSize).toBe(0);
  expect(preparePairDistributions([{ id: 's', values: { x: 0 } }], ['x'], { enabled: true })[0].domain).toEqual([
    -0.5, 0.5
  ]);
});

test('automatic edges merge rounding duplicates; explicit bin counts reject them', () => {
  const [extent] = collectPairExtents(
    [
      { id: 'a', values: { x: 1 } },
      { id: 'b', values: { x: 1 + Number.EPSILON } }
    ],
    ['x']
  );
  expect(makePairEdges(extent)?.edges).toEqual([1, 1 + Number.EPSILON]);
  expect(makePairEdges(extent, 2)).toBeNull();
  expect(makePairEdges(extent, 1)?.edges).toEqual([1, 1 + Number.EPSILON]);
});

test('overflowing spans and unrepresentable constant domains are boundary errors', () => {
  const [extent] = collectPairExtents(
    [
      { id: 'a', values: { x: -Number.MAX_VALUE } },
      { id: 'b', values: { x: Number.MAX_VALUE } }
    ],
    ['x']
  );
  expect(pairDomain(extent)).toBeNull();
  expect(makePairEdges(extent)).toBeNull();
  const [constant] = collectPairExtents([{ id: 'a', values: { x: Number.MAX_VALUE } }], ['x']);
  expect(pairDomain(constant)).toBeNull();
});

test('none prepares shared domains without histogram arrays', () => {
  const [x] = preparePairDistributions(pairObservations, ['x'], { enabled: false });
  expect(x).toEqual({ variable: 'x', domain: [0, 4], sampleSize: 5, bins: [] });
});

test('duplicates are counted independently and immutable input reordering preserves counts', () => {
  const rows = [-4, -4, -2, 0, 2, 4, 4].map((x, i) => Object.freeze({ id: String(i), values: Object.freeze({ x }) }));
  Object.freeze(rows);
  const a = preparePairDistributions(rows, ['x'], { enabled: true, binCount: 4 });
  expect(a[0].bins.map(b => b.count)).toEqual([2, 1, 1, 3]);
  expect(preparePairDistributions(rows.slice().reverse(), ['x'], { enabled: true, binCount: 4 })).toEqual(a);
});

test.each([1, 2, 20, 200])('finite endpoints and count conservation for %s bins', binCount => {
  const rows = Array.from({ length: 10001 }, (_, i) => ({ id: String(i), values: { x: 1e12 + (i % 997) / 10 } }));
  const [result] = preparePairDistributions(rows, ['x'], { enabled: true, binCount });
  expect(result.bins).toHaveLength(binCount);
  expect(result.bins.reduce((sum, b) => sum + b.count, 0)).toBe(rows.length);
  result.bins.forEach((b, i) => {
    expect(Number.isFinite(b.binStart) && Number.isFinite(b.binEnd)).toBe(true);
    expect(b.binEnd).toBeGreaterThan(b.binStart);
    if (i) expect(b.binStart).toBe(result.bins[i - 1].binEnd);
  });
});
