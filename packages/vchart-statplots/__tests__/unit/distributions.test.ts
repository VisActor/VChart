import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { HistogramSpec, BoxPlotSpec } from '../../src/types';
import type { IBarSeriesSpec, IDataValues, ILineSeriesSpec } from '@visactor/vchart';

describe('distributions', () => {
  const bins = [
    { binStart: 0, binEnd: 1, count: 2 },
    { binStart: 1, binEnd: 3, count: 2 }
  ];
  it('不等宽箱的面积而不是高度表示概率', () => {
    expect(validateStatPlot({ type: 'histogram', data: bins }).valid).toBe(false);
    const native = compileStatPlot({ type: 'histogram', statistic: 'density', data: bins });
    const values = ((native.series![0] as IBarSeriesSpec).data as IDataValues).values as { height: number }[];
    expect(values.map(row => row.height)).toEqual([0.5, 0.25]);
    expect(values[0].height + values[1].height * 2).toBe(1);
  });
  it('拒绝负计数、小数计数、重叠箱', () => {
    for (const data of [
      [{ binStart: 0, binEnd: 1, count: -1 }],
      [{ binStart: 0, binEnd: 1, count: 1.5 }],
      [
        { binStart: 0, binEnd: 2, count: 1 },
        { binStart: 1, binEnd: 3, count: 2 }
      ]
    ]) {
      expect(validateStatPlot({ type: 'histogram', data } as HistogramSpec).valid).toBe(false);
    }
  });
  it('ECDF 保持右连续阶梯并拒绝重复采样位置', () => {
    const native = compileStatPlot({
      type: 'ecdfPlot',
      data: [
        { value: 1, cumulativeProbability: 0.5 },
        { value: 2, cumulativeProbability: 1 }
      ]
    });
    expect((native.series![0] as ILineSeriesSpec).line?.style?.curveType).toBe('stepAfter');
    expect(
      validateStatPlot({
        type: 'ecdfPlot',
        data: [
          { value: 1, cumulativeProbability: 0.5 },
          { value: 1, cumulativeProbability: 1 }
        ]
      }).valid
    ).toBe(false);
  });
  it('箱线次序明确，异常点不能改变须端点', () => {
    const spec: BoxPlotSpec = {
      type: 'boxPlot',
      whiskerRule: '1.5×IQR',
      data: [{ category: 'A', whiskerLower: 0, q1: 1, median: 2, q3: 3, whiskerUpper: 4, outliers: [-10, 9] }]
    };
    expect(validateStatPlot(spec).valid).toBe(true);
    expect(validateStatPlot({ ...spec, data: [{ ...spec.data[0], median: 5 }] }).valid).toBe(false);
  });
});
