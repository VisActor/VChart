import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';
import type { ViolinPlotSpec } from '../../src/types';
import type { ICommonChartSpec, IDataValues, IAreaSeriesSpec } from '@visactor/vchart';

const chart = (spec: ViolinPlotSpec) => compileStatPlot(spec) as ICommonChartSpec;
const rows = (spec: ViolinPlotSpec) =>
  ((chart(spec).series![0] as IAreaSeriesSpec).data as IDataValues).values as {
    category: string;
    series?: string;
    value: number;
    density: number;
    __violinGroup: string;
    __densityWidth: number;
  }[];
const base: ViolinPlotSpec = {
  type: 'violinPlot',
  data: [{ category: 'A', value: 0 }],
  estimation: { bandwidth: 1 },
  sampling: { points: 3 }
};

test('原始单样本计算高斯密度，峰值等宽，轴包含核尾部', () => {
  const result = rows(base);
  expect(result.map(row => row.value)).toEqual([-3, 0, 3]);
  expect(result[1].density).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 14);
  expect(result[0].density).toBeCloseTo(Math.exp(-4.5) / Math.sqrt(2 * Math.PI), 14);
  expect(result[1].__densityWidth).toBe(1);
  expect(result[0].__densityWidth).toBeCloseTo(Math.exp(-4.5), 14);
  expect(chart(base).axes![1]).toMatchObject({ min: -3, max: 3, nice: false });
});

test('Epanechnikov 紧支撑，密度不被轮廓归一化改变', () => {
  const spec: ViolinPlotSpec = { ...base, estimation: { bandwidth: 1, kernel: 'epanechnikov' } };
  expect(rows(spec).map(({ value, density, __densityWidth }) => ({ value, density, __densityWidth }))).toEqual([
    { value: -1, density: 0, __densityWidth: 0 },
    { value: 0, density: 0.75, __densityWidth: 1 },
    { value: 1, density: 0, __densityWidth: 0 }
  ]);
});

test.each(['gaussian', 'epanechnikov'] as const)('与 kdePlot 共享 %s 网格及重复观测权重', kernel => {
  const spec: ViolinPlotSpec = {
    ...base,
    data: [1, 0, 0].map(value => ({ category: 'A', value })),
    estimation: { kernel, bandwidth: 1 },
    sampling: { points: 8 }
  };
  const curve = rows(spec).map(({ value, density }) => ({ value, density }));
  const kde = compileStatPlot({
    type: 'kdePlot',
    data: spec.data.map(({ value }) => ({ value })),
    estimation: spec.estimation,
    sampling: spec.sampling
  }) as ICommonChartSpec;
  expect(curve).toEqual(((kde.series![0] as IAreaSeriesSpec).data as IDataValues).values);
  if (kernel === 'gaussian') {
    expect(curve.find(row => row.value === 0)!.density).toBeCloseTo(
      (2 + Math.exp(-0.5)) / (3 * Math.sqrt(2 * Math.PI)),
      14
    );
  }
});

test('Scott 和 Silverman 使用总体标准差，采样数不改变统计模型', () => {
  const spec: ViolinPlotSpec = {
    ...base,
    estimation: undefined,
    data: [-1, 0, 1].map(value => ({ category: 'A', value }))
  };
  const h = Math.sqrt(2 / 3) * Math.pow(3, -1 / 5);
  expect(rows(spec)[0].value).toBeCloseTo(-1 - 3 * h, 14);
  expect(rows({ ...spec, estimation: { bandwidth: 'scott' } })).toEqual(rows(spec));
  expect(rows({ ...spec, estimation: { bandwidth: 'silverman' } })[0].value).toBeCloseTo(
    -1 - 3 * h * Math.pow(4 / 3, 1 / 5),
    14
  );
  expect(rows({ ...spec, sampling: { points: 5 } }).filter((_, i) => i % 2 === 0)).toEqual(rows(spec));
});

test('分类与系列独立统计，组合键无碰撞，不补不存在的组合', () => {
  const spec: ViolinPlotSpec = {
    ...base,
    data: [
      { category: 'A|B', series: 'X', value: 10 },
      { category: 'A', series: 'B|X', value: 20 },
      { category: 'A|B', series: 'X', value: 10 },
      { category: 'C', series: 'X', value: 30 }
    ]
  };
  const result = rows(spec);
  expect(result.map(row => row.value)).toEqual([7, 10, 13, 17, 20, 23, 27, 30, 33]);
  expect(new Set(result.map(row => row.__violinGroup)).size).toBe(3);
  expect(result[1].density).toBeCloseTo(result[4].density, 14);
  expect(chart(spec).axes![1]).toMatchObject({ min: 7, max: 33, nice: false });
  expect(chart(spec).legends).toMatchObject({ visible: true });
});

test('width 等最大宽度，area 等绘制面积，均不修改概率密度', () => {
  const spec: ViolinPlotSpec = {
    type: 'violinPlot',
    sampling: { points: 65 },
    data: [
      ...[-1, 0, 1].map(value => ({ category: 'A', value })),
      ...[-2, 0, 2].map(value => ({ category: 'B', value }))
    ]
  };
  const width = rows(spec),
    area = rows({ ...spec, densityNormalization: 'area' });
  expect(width[32].__densityWidth).toBe(1);
  expect(width[97].__densityWidth).toBe(1);
  expect(area[32].__densityWidth).toBe(1);
  expect(area[97].__densityWidth).toBeCloseTo(0.5, 14);
  expect(area.map(row => row.density)).toEqual(width.map(row => row.density));
  const integral = (points: typeof area) =>
    points
      .slice(1)
      .reduce(
        (sum, row, i) => sum + ((row.value - points[i].value) * (row.__densityWidth + points[i].__densityWidth)) / 2,
        0
      );
  expect(integral(area.slice(0, 65))).toBeCloseTo(integral(area.slice(65)), 12);
  expect(integral(width.slice(65))).toBeCloseTo(2 * integral(width.slice(0, 65)), 12);
});

test('默认 256 点，冻结乱序输入不变，空表合法', () => {
  const spec: ViolinPlotSpec = {
    type: 'violinPlot',
    data: [1, 0, -1].map(value => Object.freeze({ category: 'A', value }))
  };
  Object.freeze(spec.data);
  Object.freeze(spec);
  expect(rows(spec)).toHaveLength(256);
  expect(spec.data.map(row => row.value)).toEqual([1, 0, -1]);
  expect(rows({ type: 'violinPlot', data: [] })).toEqual([]);
  expect(chart({ type: 'violinPlot', data: [] }).title).toMatchObject({ subtext: '暂无可绘制数据' });
});

test.each([{ samples: [0] }, { samples: [2, 2, 2] }])('常数组 $samples 须显式指定带宽', ({ samples }) => {
  const spec: ViolinPlotSpec = { type: 'violinPlot', data: samples.map(value => ({ category: 'A', value })) };
  expect(validateStatPlot(spec).errors).toEqual([
    expect.objectContaining({ path: '/data/0/value', code: 'INVALID_RANGE' })
  ]);
  expect(() => compileStatPlot(spec)).toThrow(StatPlotValidationError);
  expect(validateStatPlot({ ...spec, estimation: { bandwidth: 1 } }).valid).toBe(true);
});

test.each([
  { data: [{ category: 'A', value: 0, density: 1 }], path: '/data/0/density' },
  { data: [{ category: 'A', value: NaN }], path: '/data/0/value' },
  { data: [{ category: 'A', value: Infinity }], path: '/data/0/value' },
  { data: [{ category: 'A', value: null }], path: '/data/0/value' },
  { data: [{ category: 'A', value: '1' }], path: '/data/0/value' },
  {
    data: [
      { category: 'A', series: 'X', value: 0 },
      { category: 'B', value: 1 }
    ],
    path: '/data/1/series'
  },
  { estimation: { bandwidth: 0 }, path: '/estimation/bandwidth' },
  { estimation: { bandwidth: -1 }, path: '/estimation/bandwidth' },
  { estimation: { bandwidth: Infinity }, path: '/estimation/bandwidth' },
  { estimation: { kernel: 'unknown' }, path: '/estimation/kernel' },
  { sampling: { points: 1 }, path: '/sampling/points' },
  { sampling: { points: 2.5 }, path: '/sampling/points' },
  { sampling: { points: 2049 }, path: '/sampling/points' },
  {
    data: [
      { category: 'A', value: 1e16 },
      { category: 'A', value: 1e16 + 16 }
    ],
    sampling: { points: 256 },
    path: '/sampling/points'
  }
])('非法契约给出准确路径 $path', ({ path, ...options }) => {
  const spec = { ...base, ...options };
  expect(validateStatPlot(spec).errors).toEqual(expect.arrayContaining([expect.objectContaining({ path })]));
  expect(() => compileStatPlot(spec as ViolinPlotSpec)).toThrow(StatPlotValidationError);
});

test('采样漏掉核支撑时编译拒绝零面积，不补造密度', () => {
  const spec: ViolinPlotSpec = {
    ...base,
    estimation: { bandwidth: 1, kernel: 'epanechnikov' },
    sampling: { points: 2 }
  };
  expect(validateStatPlot(spec).valid).toBe(true);
  expect(() => compileStatPlot(spec)).toThrow(StatPlotValidationError);
  try {
    compileStatPlot(spec);
  } catch (error) {
    expect((error as StatPlotValidationError).issues).toEqual([
      expect.objectContaining({ path: '/sampling/points', code: 'INVALID_RANGE' })
    ]);
  }
});
