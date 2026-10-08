import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { BoxPlotSpec } from '../../src/types';
import type { IBarSeriesSpec, IDataValues, ILineSeriesSpec } from '@visactor/vchart';

describe('distributions', () => {
  it('原始分箱按面积表示概率密度', () => {
    const native = compileStatPlot({
      type: 'histogram',
      statistic: 'density',
      binning: { binCount: 2 },
      data: [0, 1, 2, 3, 4].map(value => ({ value }))
    });
    const values = ((native.series![0] as IBarSeriesSpec).data as IDataValues).values as { height: number }[];
    expect(values.map(row => row.height)).toEqual([0.2, 0.3]);
    expect(values.reduce((area, row) => area + row.height * 2, 0)).toBe(1);
  });
  it('ECDF 从原始重复观测计算右连续阶梯', () => {
    const native = compileStatPlot({
      type: 'ecdfPlot',
      data: [{ value: 1 }, { value: 2 }]
    });
    expect((native.series![0] as ILineSeriesSpec).line?.style?.curveType).toBe('stepAfter');
    expect(
      validateStatPlot({
        type: 'ecdfPlot',
        data: [{ value: 1 }, { value: 1 }]
      }).valid
    ).toBe(true);
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
