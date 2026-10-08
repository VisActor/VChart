import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';
import type { EcdfPlotSpec } from '../../src/types';
import type { ICommonChartSpec, IDataValues, ILineSeriesSpec } from '@visactor/vchart';

const chart = (spec: EcdfPlotSpec) => compileStatPlot(spec) as ICommonChartSpec;
const rows = (spec: EcdfPlotSpec) =>
  ((chart(spec).series![0] as ILineSeriesSpec).data as IDataValues).values as {
    value: number;
    cumulativeProbability: number;
    series?: string;
  }[];

test('ECDF 保留无序、重复样本的真实跳点和左右平台', () => {
  const spec: EcdfPlotSpec = { type: 'ecdfPlot', data: [4, 1, 0, 1].map(value => ({ value })) };
  expect(rows(spec)).toEqual([
    { value: -0.2, cumulativeProbability: 0 },
    { value: 0, cumulativeProbability: 0.25 },
    { value: 1, cumulativeProbability: 0.75 },
    { value: 4, cumulativeProbability: 1 },
    { value: 4.2, cumulativeProbability: 1 }
  ]);
});

test.each([{ samples: [2] }, { samples: [2, 2, 2] }])('常数和单样本 $samples 从真实位置跳到 1', ({ samples }) => {
  const spec: EcdfPlotSpec = { type: 'ecdfPlot', data: samples.map(value => ({ value })) };
  expect(rows(spec)).toEqual([
    { value: 1.5, cumulativeProbability: 0 },
    { value: 2, cumulativeProbability: 1 },
    { value: 2.5, cumulativeProbability: 1 }
  ]);
  const native = chart(spec);
  expect(native.axes![1]).toMatchObject({ min: 0, max: 1 });
  expect((native.series![0] as ILineSeriesSpec).line!.style!.curveType).toBe('stepAfter');
  expect((native.series![0] as ILineSeriesSpec).point!.visible).toBe(false);
});

test('每系列独立归一化，共享轴域并按首次出现顺序排列', () => {
  const spec: EcdfPlotSpec = {
    type: 'ecdfPlot',
    data: [
      { value: 4, series: 'B' },
      { value: 1, series: 'A' },
      { value: 0, series: 'B' },
      { value: 1, series: 'A' },
      { value: 2, series: 'A' }
    ]
  };
  const result = rows(spec);
  expect(result.filter(row => row.series === 'B').map(row => row.cumulativeProbability)).toEqual([0, 0.5, 1, 1]);
  expect(result.filter(row => row.series === 'A').map(row => row.cumulativeProbability)).toEqual([0, 2 / 3, 1, 1]);
  expect(result.filter(row => row.series === 'A').map(row => row.value)).toEqual([-0.2, 1, 2, 4.2]);
  expect(chart(spec).legends).toMatchObject({ visible: true });
});

test('输入冻结后仍可排序计算，空数据保留显式空状态和字段名称', () => {
  const spec: EcdfPlotSpec = {
    type: 'ecdfPlot',
    data: [4, 1, 0, 1].map(value => Object.freeze({ value })),
    fieldLabels: { value: '时长', cumulativeProbability: '完成比例' }
  };
  Object.freeze(spec.data);
  Object.freeze(spec.fieldLabels);
  Object.freeze(spec);
  const before = JSON.stringify(spec);
  const native = chart(spec);
  expect(JSON.stringify(spec)).toBe(before);
  expect(native.axes![0]).toMatchObject({ title: { text: '时长' }, min: -0.2, max: 4.2, nice: false });
  expect(native.axes![1]).toMatchObject({ title: { text: '完成比例' } });
  expect(rows({ type: 'ecdfPlot', data: [] })).toEqual([]);
  expect(chart({ type: 'ecdfPlot', data: [] }).title).toMatchObject({ subtext: '暂无可绘制数据' });
});

test.each([
  { data: [{ value: 0, cumulativeProbability: 1 }], path: '/data/0/cumulativeProbability' },
  { data: [{ value: 0, probability: 1 }], path: '/data/0/probability' },
  { data: [{ value: NaN }], path: '/data/0/value' },
  { data: [{ value: Infinity }], path: '/data/0/value' },
  { data: [{ value: -Infinity }], path: '/data/0/value' },
  { data: [{ value: '1' }], path: '/data/0/value' },
  { data: [{ value: null }], path: '/data/0/value' },
  { data: [{ value: 1, series: 'A' }, { value: 2 }], path: '/data/1/series' },
  { data: [{ value: 1, series: '' }], path: '/data/0/series' },
  { data: [{ value: Number.MAX_VALUE }], path: '/data' },
  { data: [{ value: -Number.MAX_VALUE }, { value: Number.MAX_VALUE }], path: '/data' }
])('拒绝非法 ECDF 契约并保留错误路径 $path', ({ data, path }) => {
  const spec = { type: 'ecdfPlot', data };
  expect(validateStatPlot(spec).errors).toEqual(expect.arrayContaining([expect.objectContaining({ path })]));
  expect(() => compileStatPlot(spec as EcdfPlotSpec)).toThrow(StatPlotValidationError);
});
