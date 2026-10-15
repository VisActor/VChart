import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import fs from 'fs';
import path from 'path';

const time = (day: number) => `2026-01-${String(day).padStart(2, '0')}T00:00:00Z`;
const rows = (spec: any) => (compileStatPlot(spec) as any).series.find((s: any) => s.id === 'observations').data.values;
const base = { type: 'timeSeriesPlot', input: 'observations' };

test('raw samples aggregate equivalent instants, sort, and retain declared null gaps without mutating input', () => {
  const data = [
    { time: time(3), value: 9 },
    { time: time(1), value: 1 },
    { time: '2026-01-01T08:00:00+08:00', value: 5 },
    { time: time(2), value: null },
    { time: time(1), value: null }
  ];
  data.forEach(Object.freeze);
  Object.freeze(data);
  const result = rows({ ...base, data, errorBar: { kind: 'range' } });
  expect(result.map((r: any) => [r.value, r.lower, r.upper, r.sampleCount])).toEqual([
    [3, 1, 5, 2],
    [null, null, null, 0],
    [9, 9, 9, 1]
  ]);
  expect(result[0].time).toBe('2026-01-01T00:00:00.000Z');
});

test('default CI is deterministic, singleton CI is unavailable, direct mode keeps stable ties', () => {
  const spec = { ...base, data: [1, 2, 4].map(value => ({ time: time(1), value })) };
  expect(rows(spec)).toEqual(rows(spec));
  expect(rows(spec)[0]).toMatchObject({ sampleCount: 3, value: 7 / 3 });
  expect(rows({ ...base, data: [{ time: time(1), value: 3 }] })[0]).toMatchObject({
    value: 3,
    lower: null,
    upper: null
  });
  const direct = {
    ...base,
    estimator: false,
    data: [
      { time: time(2), value: 8 },
      { time: time(1), value: 3 },
      { time: time(1), value: null }
    ]
  };
  expect(rows(direct).map((r: any) => r.value)).toEqual([3, null, 8]);
  expect(rows(direct)[0].sampleCount).toBeUndefined();
  expect(validateStatPlot({ ...direct, errorBar: { kind: 'range' } }).valid).toBe(false);
});

test('external estimates accept unordered unique instants and reject aliases and inert raw options', () => {
  expect(
    rows({
      type: 'timeSeriesPlot',
      input: 'estimates',
      data: [
        { time: time(2), value: 2 },
        { time: time(1), value: 1 }
      ]
    }).map((r: any) => r.value)
  ).toEqual([1, 2]);
  expect(
    validateStatPlot({
      type: 'timeSeriesPlot',
      input: 'estimates',
      data: [
        { time: time(1), value: 1 },
        { time: '2026-01-01T08:00:00+08:00', value: 2 }
      ]
    }).valid
  ).toBe(false);
  expect(validateStatPlot({ ...base, interval: { kind: 'range' }, data: [] }).valid).toBe(false);
});

test.each([
  ['confidence', null, null],
  ['standardError', null, null],
  ['standardDeviation', null, null],
  ['range', 5, 5],
  ['percentile', 5, 5]
])('singleton interval: %s', (kind, lower, upper) => {
  expect(rows({ ...base, errorBar: { kind }, data: [{ time: time(1), value: 5 }] })[0]).toMatchObject({
    value: 5,
    lower,
    upper,
    sampleCount: 1
  });
});

test('constant samples yield a zero-width CI; median percentile estimates and series grouping are independent', () => {
  expect(rows({ ...base, data: [5, 5].map(value => ({ time: time(1), value })) })[0]).toMatchObject({
    lower: 5,
    upper: 5
  });
  const result = rows({
    ...base,
    estimator: 'median',
    errorBar: { kind: 'range' },
    data: [1, 2, 100]
      .map(value => ({ time: time(1), value, series: 'A' }))
      .concat([{ time: time(1), value: 9, series: 'B' }])
  });
  expect(result.map((r: any) => [r.series, r.value, r.sampleCount])).toEqual([
    ['A', 2, 3],
    ['B', 9, 1]
  ]);
  expect(validateStatPlot({ ...base, estimator: 'median', errorBar: { kind: 'standardError' }, data: [] }).valid).toBe(
    false
  );
  expect(validateStatPlot({ ...base, errorBar: { kind: 'confidence', resamples: 99 }, data: [] }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ path: '/errorBar/resamples' })])
  );
});

test('NumPy mean, median and sample SE/SD references match time aggregation', () => {
  const reference = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../fixtures/time-kde-python-reference.json'), 'utf8')
  ).timeSeries;
  const data = reference.values.map((value: number) => ({ time: time(1), value }));
  for (const kind of ['standardError', 'standardDeviation']) {
    const row = rows({ ...base, data, errorBar: { kind } })[0];
    expect(row.value).toBeCloseTo(reference.mean, 12);
    expect(row.upper - row.value).toBeCloseTo(reference[kind], 12);
  }
  expect(rows({ ...base, data, estimator: 'median', errorBar: false })[0].value).toBe(reference.median);
});
