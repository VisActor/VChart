import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';

const rows = (spec: object) => (compileStatPlot(spec as any) as any).series[0].data.values;
const data = [
  ...['A', 'A', 'A', 'B'].map(category => ({ category, series: 'X' })),
  ...['A', 'B'].map(category => ({ category, series: 'Y' }))
];
test('counts every observation and uses explicit proportion denominators', () => {
  const all = rows({ type: 'countPlot', data, statistic: 'proportion' });
  expect(all.map((r: any) => r.count)).toEqual([3, 1, 1, 1]);
  expect(all.map((r: any) => r.proportion)).toEqual([3 / 6, 1 / 6, 1 / 6, 1 / 6]);
  const grouped = rows({ type: 'countPlot', data, statistic: 'proportion', normalizationScope: 'series' });
  expect(grouped.map((r: any) => r.proportion)).toEqual([3 / 4, 1 / 4, 1 / 2, 1 / 2]);
});
test('fills missing category/series combinations without inventing observations', () => {
  expect(
    rows({
      type: 'countPlot',
      data: [
        { category: 'A', series: 'X' },
        { category: 'B', series: 'Y' }
      ]
    })
  ).toEqual([
    { category: 'A', series: 'X', count: 1, proportion: 0.5 },
    { category: 'B', series: 'X', count: 0, proportion: 0 },
    { category: 'A', series: 'Y', count: 0, proportion: 0 },
    { category: 'B', series: 'Y', count: 1, proportion: 0.5 }
  ]);
});
test('accepts repeated frozen observations and an empty table', () => {
  const data = Object.freeze([Object.freeze({ category: 'A' }), Object.freeze({ category: 'A' })]);
  expect(rows({ type: 'countPlot', data })[0].count).toBe(2);
  expect(rows({ type: 'countPlot', data: [] })).toEqual([]);
});
test.each([
  { type: 'countPlot', data: [{ category: 'A', count: 2 }] },
  { type: 'countPlot', data: [{ category: 'A' }], normalizationScope: 'series' },
  { type: 'countPlot', data: [{ category: 'A', series: 'X' }, { category: 'B' }] }
])('rejects ambiguous or legacy count input', spec => expect(validateStatPlot(spec).valid).toBe(false));
