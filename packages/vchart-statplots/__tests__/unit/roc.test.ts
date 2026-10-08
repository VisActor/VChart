import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';

const data = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.08, tpr: 0.72 },
  { fpr: 1, tpr: 1 }
];

describe('rocCurve', () => {
  it('指出概率越界字段', () => {
    expect(validateStatPlot({ type: 'rocCurve', data: [{ fpr: 1.2, tpr: 0.7 }] }).errors).toContainEqual(
      expect.objectContaining({ path: '/data/0/fpr', code: 'INVALID_RANGE' })
    );
  });
  it('拒绝猜测字段名、未知选项和非 JSON 数值', () => {
    for (const input of [
      { type: 'rocCurve', data: [{ x: 0.1, y: 0.8 }] },
      { type: 'rocCurve', data, xField: 'fpr' },
      { type: 'rocCurve', data: [{ fpr: NaN, tpr: 0.8 }] },
      { type: 'rocCurve', data: [{ fpr: 0, tpr: 1, threshold: Infinity }] }
    ]) {
      expect(validateStatPlot(input).valid).toBe(false);
    }
  });
  it('每条曲线检查顺序且不修改输入', () => {
    const spec = { type: 'rocCurve' as const, data };
    const before = JSON.stringify(spec);
    const native = compileStatPlot(spec);
    expect(JSON.stringify(spec)).toBe(before);
    expect(native.type).toBe('common');
    expect(validateStatPlot({ type: 'rocCurve', data: [...data].reverse() }).valid).toBe(false);
  });
  it('编译入口执行相同校验', () => {
    expect(() => compileStatPlot({ type: 'rocCurve', data: [{ fpr: -1, tpr: 0 }] })).toThrow(StatPlotValidationError);
  });
});
