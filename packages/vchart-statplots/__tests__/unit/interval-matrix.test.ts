import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
import type { PointIntervalPlotSpec, CorrelationMatrixSpec } from '../../src/types';

describe('interval-matrix', () => {
  const spec: PointIntervalPlotSpec = {
    type: 'pointIntervalPlot',
    interval: { kind: 'confidence', level: 0.95 },
    data: [{ category: 'A', estimate: 0, lower: 1, upper: 2 }]
  };
  it('估计值不强制落在区间内，但区间含义必须完整', () => {
    expect(validateStatPlot(spec).valid).toBe(true);
    expect(validateStatPlot({ ...spec, interval: { kind: 'confidence' } }).valid).toBe(false);
    expect(validateStatPlot({ ...spec, interval: { kind: 'range', level: 0.95 } }).valid).toBe(false);
    expect(validateStatPlot({ ...spec, valueScale: 'log' }).valid).toBe(false);
  });
  it('默认不添加参考线', () => {
    expect('markLine' in compileStatPlot(spec)).toBe(false);
  });
  it('要求完整对称矩阵，null 不替换为零', () => {
    const matrix: CorrelationMatrixSpec = {
      type: 'correlationMatrix',
      method: 'pearson',
      data: [
        { row: 'A', column: 'A', correlation: 1 },
        { row: 'A', column: 'B', correlation: null },
        { row: 'B', column: 'A', correlation: null },
        { row: 'B', column: 'B', correlation: null }
      ]
    };
    expect(validateStatPlot(matrix).valid).toBe(true);
    expect(validateStatPlot({ ...matrix, data: matrix.data.slice(0, 3) }).valid).toBe(false);
    const native = compileStatPlot(matrix);
    const domain = native.scales![0].domain as number[];
    expect([domain[0], domain[(domain.length - 1) / 2], domain[domain.length - 1]]).toEqual([-1, 0, 1]);
  });
});
