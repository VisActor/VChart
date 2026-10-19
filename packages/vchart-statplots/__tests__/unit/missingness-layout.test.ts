import { layoutPixelRows } from '../../src/series/missingness/layout';

const domain = Array.from({ length: 12 }, (_, i) => `row-${i + 1}`);

test.each([1, 1.25, 1.5, 2, 3])('row boundaries share device pixels at DPR %s', dpr => {
  for (const range of [
    [0, 489],
    [489, 0]
  ]) {
    const offset = 57.3;
    const rows = layoutPixelRows(domain, range, offset, dpr, 120.5);
    const ordered = [...rows.values()].sort((a, b) => a.y - b.y);
    let previousBottom: number | undefined;
    for (const row of ordered) {
      const top = row.y - row.size[1] / 2;
      const bottom = row.y + row.size[1] / 2;
      expect(row.size[0]).toBe(120.5);
      for (const boundary of [top, bottom]) {
        const pixel = (boundary + offset) * dpr;
        expect(pixel).toBeCloseTo(Math.round(pixel), 10);
      }
      if (previousBottom !== undefined) {
        expect(top).toBeCloseTo(previousBottom, 10);
      }
      previousBottom = bottom;
    }
    const top = ordered[0].y - ordered[0].size[1] / 2;
    const last = ordered[ordered.length - 1];
    const bottom = last.y + last.size[1] / 2;
    expect(top).toBeCloseTo(Math.round(offset * dpr) / dpr - offset, 10);
    expect(bottom).toBeCloseTo(Math.round((489 + offset) * dpr) / dpr - offset, 10);
    expect(rows.get(domain[0])!.y < rows.get(domain[11])!.y).toBe(range[1] > range[0]);
  }
});

test('dense rows share boundaries without inflating subpixel bands or dropping data', () => {
  const ids = Array.from({ length: 1000 }, (_, i) => String(i));
  const rows = [...layoutPixelRows(ids, [0, 243.6], 57.3, 2, 30).values()];
  expect(rows).toHaveLength(1000);
  expect(rows.every(row => row.size[1] >= 0)).toBe(true);
  expect(rows.some(row => row.size[1] === 0)).toBe(true);
  const height = rows.reduce((sum, row) => sum + row.size[1], 0);
  expect(height).toBeCloseTo((Math.round((243.6 + 57.3) * 2) - Math.round(57.3 * 2)) / 2, 10);
});

test('single and empty domains preserve the pixel partition contract', () => {
  expect([...layoutPixelRows([], [0, 100], 0, 1, 10)]).toEqual([]);
  const row = layoutPixelRows(['only'], [0, 100.3], 0.4, 2, 10).get('only')!;
  expect(row.y).toBeCloseTo(50.1, 10);
  expect(row.size).toEqual([10, 100]);
});
