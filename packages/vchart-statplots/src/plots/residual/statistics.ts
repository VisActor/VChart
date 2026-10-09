import type { ResidualPlotSpec } from './types';
import { StatPlotValidationError } from '../../errors';
import { issue } from '../../common/validation';
export function buildResidualRows(spec: ResidualPlotSpec) {
  const kind = spec.input === 'predictions' ? 'raw' : spec.residualKind;
  const label = { raw: '原始残差', standardized: '标准化残差', studentized: '学生化残差' }[kind];
  if (spec.input === 'residuals') {
    return spec.data.map(row => ({ ...row, residualKind: label }));
  }
  return spec.data.map((row, i) => {
    const residual = row.actual - row.fittedValue;
    if (!Number.isFinite(residual)) {
      throw new StatPlotValidationError([
        issue('INVALID_RANGE', `/data/${i}/actual`, '真实值与拟合值之差无法用有限数值表示')
      ]);
    }
    return { ...row, residual, residualKind: label };
  });
}
