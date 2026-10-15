import { correlation } from '@visactor/vutils';
import type { CorrelationMatrixSpec } from './types';
import { StatPlotValidationError } from '../../errors';
import { issue } from '../../common/validation';
export interface CorrelationCell {
  row: string;
  column: string;
  correlation: number | null;
  sampleCount: number;
  undefinedReason: string;
}
export function buildCorrelationCells(spec: CorrelationMatrixSpec): CorrelationCell[] {
  if (!spec.data.observations.length) {
    return [];
  }
  const cells: CorrelationCell[][] = spec.variables.map(() => []);
  for (let i = 0; i < spec.variables.length; i++) {
    for (let j = i; j < spec.variables.length; j++) {
      const x: number[] = [];
      const y: number[] = [];
      for (const observation of spec.data.observations) {
        const a = observation.values[spec.variables[i]];
        const b = observation.values[spec.variables[j]];
        if (a !== null && b !== null) {
          x.push(a);
          y.push(b);
        }
      }
      const insufficient = x.length < (spec.minSamples ?? 2);
      const value = insufficient ? undefined : correlation(x, y, spec.method ?? 'pearson');
      if (value !== undefined && (!Number.isFinite(value) || Math.abs(value) > 1)) {
        throw new StatPlotValidationError([
          issue('INVALID_RANGE', '/data/observations', '相关系数无法用有效有限数值表示')
        ]);
      }
      const cell = {
        row: spec.variables[i],
        column: spec.variables[j],
        correlation: value ?? null,
        sampleCount: x.length,
        undefinedReason: insufficient ? '有效配对样本不足' : value === undefined ? '变量为常量，相关性不可定义' : ''
      };
      cells[i][j] = cell;
      if (i !== j) {
        cells[j][i] = { ...cell, row: cell.column, column: cell.row };
      }
    }
  }
  return cells.flat();
}
