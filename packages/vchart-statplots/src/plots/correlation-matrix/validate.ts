import type { CorrelationMatrixSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkRange, checkUnique, issue } from '../../common/validation';
export function validateCorrelationMatrix(spec: CorrelationMatrixSpec): StatPlotIssue[] {
  const errors = checkUnique(spec.data, row => JSON.stringify([row.row, row.column]));
  const names = new Set(spec.data.flatMap(row => [row.row, row.column]));
  const matrix = new Map(spec.data.map(row => [JSON.stringify([row.row, row.column]), row.correlation]));
  if (matrix.size !== names.size * names.size) {
    errors.push(issue('INVALID_RANGE', '/data', '请提供完整的相关矩阵，包括所有对角单元格'));
  }
  spec.data.forEach((row, i) => {
    if (row.correlation !== null) {
      errors.push(...checkRange(row.correlation, `/data/${i}/correlation`, -1, 1));
      if (row.row === row.column && Math.abs(row.correlation - 1) > 1e-10) {
        errors.push(issue('INVALID_RANGE', `/data/${i}/correlation`, '相关矩阵对角只能为 1 或 null'));
      }
    }
    const inverse = matrix.get(JSON.stringify([row.column, row.row]));
    if (
      inverse === undefined ||
      (row.correlation === null ? inverse !== null : inverse === null || Math.abs(row.correlation - inverse) > 1e-10)
    ) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/correlation`, '相关矩阵必须对称'));
    }
  });
  if (
    spec.variableOrder &&
    (new Set(spec.variableOrder).size !== names.size ||
      spec.variableOrder.length !== names.size ||
      spec.variableOrder.some(name => !names.has(name)))
  ) {
    errors.push(issue('INVALID_RANGE', '/variableOrder', 'variableOrder 必须恰好包含每个变量一次'));
  }
  return errors;
}
