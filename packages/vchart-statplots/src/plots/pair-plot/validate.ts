import type { PairPlotSpec } from './types';
import { checkUnique, checkSeries, issue } from '../../common/validation';
import { collectPairExtents, makePairEdges, pairDomain } from './binning';

export function validatePairPlot(spec: PairPlotSpec) {
  const errors = [
    ...checkUnique(spec.data.observations, row => row.id, '/data/observations'),
    ...checkSeries(spec.data.observations, '/data/observations')
  ];
  if (spec.variables.length < 2 || new Set(spec.variables).size !== spec.variables.length) {
    errors.push(issue('INVALID_RANGE', '/variables', '散点矩阵至少需要两个不重复的变量'));
  }
  spec.data.observations.forEach((row, i) => {
    const keys = Object.keys(row.values);
    if (keys.length !== spec.variables.length || !spec.variables.every(v => keys.includes(v))) {
      errors.push(
        issue(
          'INVALID_RANGE',
          `/data/observations/${i}/values`,
          'values 须包含且仅包含 variables 中的变量，缺失值显式为 null'
        )
      );
    }
  });
  if (errors.length) {
    return errors;
  }
  const diagonal = spec.diagonal;
  const binCount = diagonal?.type === 'none' ? undefined : diagonal?.binning?.binCount;
  for (const extent of collectPairExtents(spec.data.observations, spec.variables)) {
    if (!pairDomain(extent)) {
      errors.push(
        issue(
          'INVALID_RANGE',
          '/data/observations',
          `变量 ${extent.variable} 的轴域无法用有限数值表示，请先转换单位或平移坐标`
        )
      );
    } else if (diagonal?.type !== 'none' && !makePairEdges(extent, binCount)) {
      errors.push(
        issue(
          'INVALID_RANGE',
          '/diagonal/binning/binCount',
          `变量 ${extent.variable} 无法表示指定箱数的不同边界，请减少箱数或转换单位`
        )
      );
    }
  }
  return errors;
}
