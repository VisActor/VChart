import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { IAreaSeriesSpec, IDataValues } from '@visactor/vchart';

describe('violinPlot', () => {
  it('拒绝负密度、退化曲线、乱序采样', () => {
    for (const data of [
      [
        { category: 'A', value: 0, density: 0 },
        { category: 'A', value: 1, density: -0.2 }
      ],
      [
        { category: 'A', value: 0, density: 0 },
        { category: 'A', value: 1, density: 0 }
      ],
      [
        { category: 'A', value: 1, density: 0.5 },
        { category: 'A', value: 0, density: 0 }
      ]
    ]) {
      expect(validateStatPlot({ type: 'violinPlot', data }).valid).toBe(false);
    }
  });
  it('面积归一化的两组使用同一全局宽度系数', () => {
    const native = compileStatPlot({
      type: 'violinPlot',
      densityNormalization: 'area',
      data: [
        { category: 'A', value: 0, density: 0 },
        { category: 'A', value: 1, density: 1 },
        { category: 'A', value: 2, density: 0 },
        { category: 'B', value: 0, density: 0 },
        { category: 'B', value: 2, density: 1 },
        { category: 'B', value: 4, density: 0 }
      ]
    });
    const values = ((native.series![0] as IAreaSeriesSpec).data as IDataValues).values as { __densityWidth: number }[];
    expect(values[1].__densityWidth).toBe(1);
    expect(values[4].__densityWidth).toBe(0.5);
  });
});
