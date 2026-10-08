import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';
import type { KdePlotSpec } from '../../src/types';
import type { ICommonChartSpec, IDataValues, ILineSeriesSpec } from '@visactor/vchart';

const chart = (spec: KdePlotSpec) => compileStatPlot(spec) as ICommonChartSpec;
const rows = (spec: KdePlotSpec) =>
  ((chart(spec).series![0] as ILineSeriesSpec).data as IDataValues).values as {
    value: number;
    density: number;
    series?: string;
  }[];

test('固定带宽的单样本 KDE 遵循高斯密度且绘制尾部', () => {
  const result = rows({
    type: 'kdePlot',
    data: [{ value: 0 }],
    estimation: { bandwidth: 1 },
    sampling: { points: 3 }
  });
  expect(result.map(row => row.value)).toEqual([-3, 0, 3]);
  expect(result[1].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 14);
  expect(result[0].density).toBeCloseTo(Math.exp(-4.5) / Math.sqrt(2 * Math.PI), 14);
});

test('Epanechnikov 使用紧支撑范围，不二次平滑或截断后归一化', () => {
  const spec: KdePlotSpec = {
    type: 'kdePlot',
    data: [{ value: 0 }],
    estimation: { bandwidth: 1, kernel: 'epanechnikov' },
    sampling: { points: 3 }
  };
  expect(rows(spec)).toEqual([
    { value: -1, density: 0 },
    { value: 0, density: 0.75 },
    { value: 1, density: 0 }
  ]);
  expect((chart(spec).series![0] as ILineSeriesSpec).line!.style!.curveType).toBe('linear');
  expect((chart(spec).series![0] as ILineSeriesSpec).point!.visible).toBe(false);
});

test('重复值分别参与核权重，带宽是真正的计算参数', () => {
  const spec: KdePlotSpec = {
    type: 'kdePlot',
    data: [0, 0, 1].map(value => ({ value })),
    estimation: { bandwidth: 1 },
    sampling: { points: 8 }
  };
  const atZero = rows(spec).find(row => row.value === 0)!;
  expect(atZero.density).toBeCloseTo((2 + Math.exp(-0.5)) / (3 * Math.sqrt(2 * Math.PI)), 14);
  const peak = (bandwidth: number) =>
    rows({ type: 'kdePlot', data: [{ value: 0 }], estimation: { bandwidth }, sampling: { points: 3 } })[1].density;
  expect(peak(0.5)).toBeCloseTo(2 * peak(1), 14);
  expect(peak(0.5)).toBeGreaterThan(peak(1));
});

test('默认 Scott 和 Silverman 沿用 vutils 的总体标准差公式', () => {
  const base: KdePlotSpec = { type: 'kdePlot', data: [-1, 0, 1].map(value => ({ value })), sampling: { points: 3 } };
  const h = Math.sqrt(2 / 3) * Math.pow(3, -1 / 5);
  const scott = rows(base);
  expect(scott[0].value).toBeCloseTo(-1 - 3 * h, 14);
  expect(scott[1].density).toBeCloseTo((1 + 2 * Math.exp(-0.5 / (h * h))) / (3 * h * Math.sqrt(2 * Math.PI)), 14);
  expect(rows({ ...base, estimation: { bandwidth: 'scott' } })).toEqual(scott);
  const silverman = rows({ ...base, estimation: { bandwidth: 'silverman' } });
  expect(silverman[0].value).toBeCloseTo(-1 - 3 * h * Math.pow(4 / 3, 1 / 5), 14);
  expect(silverman[1].density).not.toBe(scott[1].density);
});

test('分组独立归一化，同值不同样本量不改变密度，网格彼此独立', () => {
  const spec: KdePlotSpec = {
    type: 'kdePlot',
    estimation: { bandwidth: 1 },
    sampling: { points: 3 },
    data: [
      { series: 'B', value: 0 },
      { series: 'A', value: 10 },
      { series: 'B', value: 0 },
      { series: 'B', value: 0 }
    ]
  };
  const result = rows(spec);
  expect(result.map(row => row.value)).toEqual([-3, 0, 3, 7, 10, 13]);
  expect(result[1].density).toBeCloseTo(result[4].density, 14);
  expect(chart(spec).axes![0]).toMatchObject({ min: -3, max: 13, nice: false });
  expect(chart(spec).legends).toMatchObject({ visible: true });
  const automatic = rows({
    type: 'kdePlot',
    data: [
      { series: 'A', value: -1 },
      { series: 'A', value: 1 },
      { series: 'B', value: -2 },
      { series: 'B', value: 2 }
    ],
    sampling: { points: 3 }
  });
  expect(automatic[3].value).toBeCloseTo(2 * automatic[0].value, 14);
});

test('绘制分辨率只改变网格，默认每系列 256 点，输入冻结仍可编译', () => {
  const spec: KdePlotSpec = {
    type: 'kdePlot',
    estimation: { bandwidth: 1 },
    data: [1, -1, 0].map(value => Object.freeze({ value }))
  };
  Object.freeze(spec.data);
  Object.freeze(spec.estimation);
  Object.freeze(spec);
  const before = JSON.stringify(spec);
  expect(rows(spec)).toHaveLength(256);
  const coarse = rows({ ...spec, sampling: { points: 3 } });
  const fine = rows({ ...spec, sampling: { points: 5 } });
  expect(fine.filter((_, i) => i % 2 === 0)).toEqual(coarse);
  expect(JSON.stringify(spec)).toBe(before);
  expect(chart({ type: 'kdePlot', data: [] }).title).toMatchObject({ subtext: '暂无可绘制数据' });
  expect(rows({ type: 'kdePlot', data: [] })).toEqual([]);
});

test.each([{ samples: [0] }, { samples: [2, 2, 2] }])('单样本或常数 $samples 要求显式带宽', ({ samples }) => {
  const spec: KdePlotSpec = { type: 'kdePlot', data: samples.map(value => ({ value })) };
  expect(validateStatPlot(spec).errors).toEqual([
    expect.objectContaining({
      code: 'INVALID_RANGE',
      path: '/data/0/value',
      message: expect.stringContaining('estimation.bandwidth')
    })
  ]);
  expect(() => compileStatPlot(spec)).toThrow(StatPlotValidationError);
  expect(validateStatPlot({ ...spec, estimation: { bandwidth: 1 } }).valid).toBe(true);
});

test.each([
  { data: [{ value: 0, density: 1 }], path: '/data/0/density' },
  { data: [{ value: NaN }], path: '/data/0/value' },
  { data: [{ value: Infinity }], path: '/data/0/value' },
  { data: [{ value: -Infinity }], path: '/data/0/value' },
  { data: [{ value: '1' }], path: '/data/0/value' },
  { data: [{ value: null }], path: '/data/0/value' },
  { data: [{ value: 1, series: 'A' }, { value: 2 }], path: '/data/1/series' },
  { estimation: { bandwidth: 0 }, path: '/estimation/bandwidth' },
  { estimation: { bandwidth: -1 }, path: '/estimation/bandwidth' },
  { estimation: { bandwidth: Infinity }, path: '/estimation/bandwidth' },
  { estimation: { bandwidth: Number.MIN_VALUE }, path: '/data/0/value' },
  { estimation: { kernel: 'anything' }, path: '/estimation/kernel' },
  { estimation: { bandwidth: 'anything' }, path: '/estimation/bandwidth' },
  { sampling: { points: 1 }, path: '/sampling/points' },
  { sampling: { points: 2.5 }, path: '/sampling/points' },
  { sampling: { points: 2049 }, path: '/sampling/points' },
  { data: [{ value: Number.MAX_VALUE }], path: '/data/0/value' },
  { data: [{ value: 1e16 }, { value: 1e16 + 16 }], path: '/sampling/points' }
])('拒绝非法 KDE 契约并保留错误路径 $path', ({ path, ...options }) => {
  const spec = { type: 'kdePlot', data: [{ value: 0 }], estimation: { bandwidth: 1 }, ...options };
  expect(validateStatPlot(spec).errors).toEqual(expect.arrayContaining([expect.objectContaining({ path })]));
  expect(() => compileStatPlot(spec as KdePlotSpec)).toThrow(StatPlotValidationError);
});
