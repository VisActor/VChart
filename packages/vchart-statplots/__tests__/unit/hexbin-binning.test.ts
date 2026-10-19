import { binHexagons } from '../../src/plots/hexbin/binning';
import { hexbinPoints } from '../fixtures/hexbin';

const anchors = [
  { x: 0, y: 0 },
  { x: 1, y: 1 }
];
const center = { x: 0.5, y: Math.sqrt(3) / 6 };

test.each([
  [center, '1:0'],
  [{ x: 0, y: Math.sqrt(3) / 3 }, '0:1'],
  [{ x: 0.25, y: Math.sqrt(3) / 12 }, '0:0'],
  [{ x: 0.25 - center.x * 1e-8, y: Math.sqrt(3) / 12 - center.y * 1e-8 }, '0:0'],
  [{ x: 0.25 + center.x * 1e-8, y: Math.sqrt(3) / 12 + center.y * 1e-8 }, '1:0']
])('assigns a lattice center or shared edge deterministically: %j', (point, id) => {
  const before = binHexagons(anchors, 2);
  const after = binHexagons([...anchors, point as { x: number; y: number }], 2);
  const previous = new Map(before.bins.map(bin => [bin.id, bin.count]));
  expect(after.bins.filter(bin => bin.count > (previous.get(bin.id) ?? 0)).map(bin => bin.id)).toEqual([id]);
});

test('duplicates count as observations, extrema and vertices are assigned exactly once', () => {
  const data = [...anchors, center, center, { x: 1 / 3, y: 0 }, { x: 0, y: 1 }];
  const result = binHexagons(data, 2);
  expect(result.bins.find(bin => bin.id === '1:0')!.count).toBe(2);
  expect(result.bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(data.length);
  expect(result.bins.every(bin => bin.count > 0)).toBe(true);
});

test.each(
  [
    [],
    [{ x: 2, y: -3 }],
    Array.from({ length: 8 }, () => ({ x: 2, y: -3 })),
    [
      { x: 0, y: -4 },
      { x: 0, y: 4 }
    ],
    [
      { x: -1e-100, y: 1e100 },
      { x: 1e-100, y: 2e100 }
    ],
    [
      { x: 1e12, y: -1e12 },
      { x: 1e12 + 100, y: -1e12 + 100 }
    ]
  ].map(data => [data])
)('handles empty, constant and different units: %j', data => {
  const result = binHexagons(data, 30);
  expect(result.bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(data.length);
  expect(Number.isFinite(result.normalizedAspect)).toBe(true);
  expect(result.normalizedAspect).toBeGreaterThan(0);
  expect([...result.xDomain, ...result.yDomain]).toEqual(expect.arrayContaining([expect.any(Number)]));
  for (const bin of result.bins) {
    expect(bin.vertices).toHaveLength(6);
    expect(bin.vertices.every(v => Number.isFinite(v.x) && Number.isFinite(v.y))).toBe(true);
  }
  if (!data.length) expect(result).toEqual({ bins: [], xDomain: [0, 1], yDomain: [0, 1], normalizedAspect: 1 });
});

test('does not mutate input and yields the same sorted bins after permutations', () => {
  const data = Object.freeze(hexbinPoints().map(point => Object.freeze(point)));
  const result = binHexagons(data, 30);
  expect(binHexagons([...data].reverse(), 30)).toEqual(result);
  expect(binHexagons([...data.slice(97), ...data.slice(0, 97)], 30)).toEqual(result);
  expect(result.bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(data.length);
  for (let i = 1; i < result.bins.length; i++) {
    const a = result.bins[i - 1],
      b = result.bins[i];
    expect(a.q < b.q || (a.q === b.q && a.s < b.s)).toBe(true);
  }
});

test('vertices form regular hexagons in normalized space and domains include the complete shapes', () => {
  const data = [...anchors, center];
  const result = binHexagons(data, 2);
  for (const bin of result.bins) {
    const sides = bin.vertices.map((v, i) => {
      const next = bin.vertices[(i + 1) % 6];
      return Math.hypot(v.x - next.x, v.y - next.y);
    });
    sides.forEach(side => expect(side).toBeCloseTo(1 / 3, 12));
    bin.vertices.forEach((v, i) => {
      const prev = bin.vertices[(i + 5) % 6],
        next = bin.vertices[(i + 1) % 6];
      const dot = (prev.x - v.x) * (next.x - v.x) + (prev.y - v.y) * (next.y - v.y);
      expect(dot / (sides[i] * sides[(i + 5) % 6])).toBeCloseTo(-0.5, 12);
      expect(v.x).toBeGreaterThanOrEqual(result.xDomain[0]);
      expect(v.x).toBeLessThanOrEqual(result.xDomain[1]);
      expect(v.y).toBeGreaterThanOrEqual(result.yDomain[0]);
      expect(v.y).toBeLessThanOrEqual(result.yDomain[1]);
    });
  }
  expect(result.normalizedAspect).toBeCloseTo(
    (result.xDomain[1] - result.xDomain[0]) / (result.yDomain[1] - result.yDomain[0]),
    12
  );
});
