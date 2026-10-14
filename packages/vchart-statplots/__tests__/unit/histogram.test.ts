import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { HistogramSpec } from '../../src/types';
import { histogramObservations } from '../fixtures/histogram';

const fixture = { type: 'histogram', binning: { binCount: 2 }, data: histogramObservations };
const chart = (spec: unknown) => compileStatPlot(spec as HistogramSpec) as any;

test('raw observations compile without series or legends, with a precise continuous domain', () => {
  expect(validateStatPlot(fixture)).toEqual({ valid: true, errors: [] });
  const native = chart(fixture);
  expect(native.series[0].data.values.map((row: any) => row.count)).toEqual([2, 3]);
  expect(native.series[0].seriesField).toBeUndefined();
  expect(native.legends.visible).toBe(false);
  expect(native.axes[0]).toMatchObject({ type: 'linear', min: 0, max: 4, nice: false });
  expect(native.axes[1].zero).toBe(true);
});

test.each([undefined, 1, 200])('binCount=%s is valid', binCount => {
  expect(validateStatPlot({ ...fixture, binning: { binCount } }).valid).toBe(true);
});
test.each([0, -1, 1.5, 201])('binCount=%s is rejected at its own path', binCount => {
  expect(validateStatPlot({ ...fixture, binning: { binCount } }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/binning/binCount' })])
  );
});
const invalidData: unknown[] = [
  [{ binStart: 0, binEnd: 1, count: 2 }],
  [0, 1],
  [{ value: null }],
  [{ value: '1' }],
  [{ value: NaN }],
  [{ value: Infinity }],
  [{ value: -Infinity }],
  ...['series', 'id', 'weight', 'count', 'binStart', 'binEnd'].map(key => [
    { value: 1, [key]: key === 'series' ? 'A' : 1 }
  ])
];
test.each(invalidData.map(data => [data]))('rejects nonstandard input %j', data => {
  expect(validateStatPlot({ type: 'histogram', data }).valid).toBe(false);
});
test('density and proportion preserve probability semantics and zero bins', () => {
  expect(chart({ ...fixture, statistic: 'proportion' }).series[0].data.values.map((row: any) => row.height)).toEqual([
    0.4, 0.6
  ]);
  const density = chart({ ...fixture, statistic: 'density' }).series[0].data.values;
  expect(density.map((row: any) => row.height)).toEqual([0.2, 0.3]);
  expect(density.reduce((area: number, row: any) => area + row.height * (row.binEnd - row.binStart), 0)).toBeCloseTo(1);
  expect(
    chart({ ...fixture, binning: { binCount: 4 }, data: [{ value: 0 }, { value: 4 }] }).series[0].data.values.map(
      (row: any) => row.height
    )
  ).toEqual([1, 0, 0, 1]);
});
test('raw zero values are observations; empty input alone produces an empty state', () => {
  expect(chart({ type: 'histogram', data: [{ value: 0 }, { value: 0 }, { value: 0 }] }).series[0].data.values).toEqual([
    { binStart: -0.5, binEnd: 0.5, count: 3, height: 3 }
  ]);
  expect(chart({ type: 'histogram', data: [] }).title.subtext).toContain('暂无可绘制数据');
});
test('numeric errors distinguish domain, explicit bin resolution and density support', () => {
  for (const data of [[{ value: -Number.MAX_VALUE }, { value: Number.MAX_VALUE }], [{ value: Number.MAX_VALUE }]]) {
    expect(validateStatPlot({ type: 'histogram', data }).errors[0]).toMatchObject({
      code: 'INVALID_RANGE',
      path: '/data'
    });
  }
  expect(validateStatPlot({ ...fixture, data: [{ value: 1 }, { value: 1 + Number.EPSILON }] }).errors[0]).toMatchObject(
    { code: 'INVALID_RANGE', path: '/binning/binCount' }
  );
  const tiny = { type: 'histogram', binning: { binCount: 1 }, data: [{ value: 0 }, { value: 1e-310 }] };
  expect(validateStatPlot(tiny).valid).toBe(true);
  expect(validateStatPlot({ ...tiny, statistic: 'density' }).errors[0]).toMatchObject({
    code: 'INVALID_RANGE',
    path: '/data'
  });
});
test('count tooltip does not repeat the height and value labels name boundaries', () => {
  const native = chart({ ...fixture, fieldLabels: { value: '年龄', count: '样本数' } });
  expect(native.axes[0].title.text).toBe('年龄');
  expect(native.series[0].tooltip.mark.content.map((item: any) => item.key)).toEqual([
    '年龄下界',
    '年龄上界',
    '样本数'
  ]);
});
