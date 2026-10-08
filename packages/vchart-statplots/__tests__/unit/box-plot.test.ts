import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';
import type { BoxPlotSpec } from '../../src/types';
import type { ICommonChartSpec, IDataValues, IBoxPlotSeriesSpec } from '@visactor/vchart';

const chart = (spec: BoxPlotSpec) => compileStatPlot(spec) as ICommonChartSpec;
const rows = (spec: BoxPlotSpec) =>
  ((chart(spec).series![0] as IBoxPlotSeriesSpec).data as IDataValues).values as {
    category: string;
    series?: string;
    q1: number;
    median: number;
    q3: number;
    whiskerLower: number;
    whiskerUpper: number;
    outliers: number[];
  }[];
const spec = (values: number[], options: Record<string, unknown> = {}) =>
  ({ type: 'boxPlot', data: values.map(value => ({ category: 'A', value })), ...options } as unknown as BoxPlotSpec);
const five = (values: number[], options: Record<string, unknown> = {}) => {
  const row = rows(spec(values, options))[0];
  return [row.whiskerLower, row.q1, row.median, row.q3, row.whiskerUpper];
};

test('原始无序样本生成插值四分位和实际须，不把围栏当须', () => {
  expect(rows(spec([100, 0, 1, 2, 3, 4, 5, 6, 7]))).toEqual([
    { category: 'A', q1: 2, median: 4, q3: 6, whiskerLower: 0, whiskerUpper: 7, outliers: [100] }
  ]);
  expect(rows(spec([100, 0, 1, 2, 3, 4, 5, 6, 7], { whiskers: {} }))).toEqual(
    rows(spec([0, 1, 2, 3, 4, 5, 6, 7, 100]))
  );
  expect(five([0, 10])).toEqual([0, 2.5, 5, 7.5, 10]);
});

test('围栏端点包含在须内，重复观测和重复异常值保留权重', () => {
  expect(rows(spec([-2, 1, 1, 2, 2, 3, 3, 4, 6]))[0]).toMatchObject({
    whiskerLower: -2,
    whiskerUpper: 6,
    outliers: []
  });
  expect(rows(spec([0, 1, 2, 3, 4, 5, 6, 7, 100, 100]))[0]).toMatchObject({
    q1: 2.25,
    median: 4.5,
    q3: 6.75,
    whiskerLower: 0,
    whiskerUpper: 7,
    outliers: [100, 100]
  });
});

test('小样本须候选落入箱体时停在四分位数', () => {
  expect(five([0, 100, 100, 100])).toEqual([75, 75, 100, 100, 100]);
  expect(rows(spec([0, 100, 100, 100]))[0].outliers).toEqual([0]);
  expect(five([0, 0, 0, 100])).toEqual([0, 0, 0, 25, 25]);
  expect(rows(spec([0, 0, 0, 100]))[0].outliers).toEqual([100]);
  expect(five([0, 10], { whiskers: { iqrMultiplier: 0 } })).toEqual([2.5, 2.5, 5, 7.5, 7.5]);
  expect(rows(spec([0, 10], { whiskers: { iqrMultiplier: 0 } }))[0].outliers).toEqual([0, 10]);
});

test('IQR 倍数真正影响须和异常值，允许零与非整数', () => {
  const values = [0, 1, 2, 3, 4, 5, 6, 7, 100];
  expect(rows(spec(values, { whiskers: { iqrMultiplier: 0 } }))[0]).toMatchObject({
    whiskerLower: 2,
    whiskerUpper: 6,
    outliers: [0, 1, 7, 100]
  });
  expect(rows(spec(values, { whiskers: { iqrMultiplier: 0.25 } }))[0]).toMatchObject({
    whiskerLower: 1,
    whiskerUpper: 7,
    outliers: [0, 100]
  });
  expect(rows(spec(values, { whiskers: { iqrMultiplier: 30 } }))[0]).toMatchObject({ whiskerUpper: 100, outliers: [] });
  expect(rows(spec(values, { whiskers: { iqrMultiplier: Number.MAX_VALUE } }))[0].outliers).toEqual([]);
});

test('单样本、常数和零 IQR 保持实际语义，空表沿用空态', () => {
  expect(five([5])).toEqual([5, 5, 5, 5, 5]);
  expect(five([5, 5, 5, 5])).toEqual([5, 5, 5, 5, 5]);
  expect(rows(spec([5, 5, 5, 5, 100]))[0]).toMatchObject({
    q1: 5,
    median: 5,
    q3: 5,
    whiskerLower: 5,
    whiskerUpper: 5,
    outliers: [100]
  });
  expect(rows(spec([]))).toEqual([]);
  expect(chart(spec([5])).title).toMatchObject({ visible: false, subtext: '' });
  expect(chart(spec([])).title).toMatchObject({ subtext: '暂无可绘制数据' });
});

test('category + series 独立分组，不补空箱，名称不产生组合键碰撞', () => {
  const input = {
    type: 'boxPlot',
    data: [
      { category: 'A', series: 'X', value: 0 },
      { category: 'A', series: 'Y', value: 100 },
      { category: 'B', series: 'X', value: 20 },
      { category: 'A', series: 'X', value: 10 },
      { category: 'A', series: 'Y', value: 110 }
    ]
  } as unknown as BoxPlotSpec;
  expect(rows(input)).toEqual([
    { category: 'A', series: 'X', q1: 2.5, median: 5, q3: 7.5, whiskerLower: 0, whiskerUpper: 10, outliers: [] },
    {
      category: 'A',
      series: 'Y',
      q1: 102.5,
      median: 105,
      q3: 107.5,
      whiskerLower: 100,
      whiskerUpper: 110,
      outliers: []
    },
    { category: 'B', series: 'X', q1: 20, median: 20, q3: 20, whiskerLower: 20, whiskerUpper: 20, outliers: [] }
  ]);
  expect(chart(input).legends).toMatchObject({ visible: true });
  expect((chart(input).series![0] as IBoxPlotSeriesSpec).xField).toEqual(['category', 'series']);
  expect(
    rows({
      type: 'boxPlot',
      data: [
        { category: 'a|b', series: 'c', value: 1 },
        { category: 'a', series: 'b|c', value: 2 }
      ]
    } as unknown as BoxPlotSpec)
  ).toHaveLength(2);
  expect((chart(spec([0, 1])).series![0] as IBoxPlotSeriesSpec).seriesField).toBeUndefined();
});

test('统计不修改调用方原始数据与配置', () => {
  const input = spec([100, 0, 1, 2, 3, 4, 5, 6, 7], { whiskers: Object.freeze({ iqrMultiplier: 1.5 }) });
  input.data.forEach(Object.freeze);
  Object.freeze(input.data);
  Object.freeze(input);
  const before = JSON.stringify(input);
  rows(input);
  expect(JSON.stringify(input)).toBe(before);
});

test.each([
  { data: [{ category: 'A', value: NaN }], path: '/data/0/value' },
  { data: [{ category: 'A', value: Infinity }], path: '/data/0/value' },
  { data: [{ category: 'A', value: -Infinity }], path: '/data/0/value' },
  { data: [{ category: 'A', value: null }], path: '/data/0/value' },
  { data: [{ category: 'A', value: '1' }], path: '/data/0/value' },
  { data: [{ category: 'A', value: 1, q1: 0 }], path: '/data/0/q1' },
  { data: [{ category: 'A', value: 1, outliers: [] }], path: '/data/0/outliers' },
  { whiskerRule: '1.5×IQR', path: '/whiskerRule' },
  { whiskers: { iqrMultiplier: -1 }, path: '/whiskers/iqrMultiplier' },
  { whiskers: { iqrMultiplier: NaN }, path: '/whiskers/iqrMultiplier' },
  { whiskers: { iqrMultiplier: Infinity }, path: '/whiskers/iqrMultiplier' },
  {
    data: [
      { category: 'A', value: 1, series: 'X' },
      { category: 'A', value: 2 }
    ],
    path: '/data/1/series'
  },
  {
    data: [
      { category: 'A', value: -Number.MAX_VALUE },
      { category: 'A', value: Number.MAX_VALUE }
    ],
    path: '/data'
  }
])('非法输入保留准确错误路径 $path', ({ path, ...options }) => {
  const input = spec([1], options);
  expect(validateStatPlot(input).errors).toEqual(expect.arrayContaining([expect.objectContaining({ path })]));
  expect(() => chart(input)).toThrow(StatPlotValidationError);
});

test('旧五数摘要明确拒绝', () => {
  expect(
    validateStatPlot({
      type: 'boxPlot',
      data: [{ category: 'A', q1: 1, median: 2, q3: 3, whiskerLower: 0, whiskerUpper: 4, outliers: [10] }]
    }).valid
  ).toBe(false);
});
