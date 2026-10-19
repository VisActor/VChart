import type { MissingValueMatrixSpec } from './types';
export function buildMissingnessCells(spec: MissingValueMatrixSpec) {
  return spec.data.observations.flatMap(row =>
    spec.variables.map(variable => ({
      observationId: row.id,
      variable,
      isMissing: row.values[variable] === null,
      status: row.values[variable] === null ? '缺失' : '已观测'
    }))
  );
}
