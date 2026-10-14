import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { BoxPlotSpec } from '../../src/types';
import type {
  ICommonChartSpec,
  IBoxPlotSeriesSpec,
  IBarSeriesSpec,
  IDataValues,
  ILineSeriesSpec
} from '@visactor/vchart';

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
  it('箱线图从原始样本计算，异常值不会成为须端点', () => {
    const spec: BoxPlotSpec = {
      type: 'boxPlot',
      data: [0, 1, 2, 3, 4, 5, 6, 7, 100].map(value => ({ category: 'A', value }))
    };
    const values = (((compileStatPlot(spec) as ICommonChartSpec).series![0] as IBoxPlotSeriesSpec).data as IDataValues)
      .values;
    expect(values[0]).toMatchObject({ whiskerLower: 0, whiskerUpper: 7, outliers: [100] });
  });
});
