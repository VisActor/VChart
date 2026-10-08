import type { PairPlotSpec } from './types';
import { checkUnique, checkSeries, issue, seriesGroups } from '../../common/validation';
import { validateHistogram } from '../histogram/validate';
export function validatePairPlot(spec: PairPlotSpec) {
  const errors = [
    ...checkUnique(spec.data.observations, row => row.id, '/data/observations'),
    ...checkSeries(spec.data.observations, '/data/observations'),
    ...checkUnique(spec.data.diagonal, row => row.variable, '/data/diagonal')
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
  if (
    spec.data.diagonal.length !== spec.variables.length ||
    !spec.variables.every(v => spec.data.diagonal.some(d => d.variable === v))
  ) {
    errors.push(issue('INVALID_RANGE', '/data/diagonal', '每个变量须提供一份直方图分箱'));
  }
  const groups = seriesGroups(spec.data.observations);
  spec.data.diagonal.forEach((diagonal, index) => {
    errors.push(
      ...validateHistogram({ type: 'histogram', statistic: 'density', data: diagonal.bins }).map(error => ({
        ...error,
        path: error.path.replace('/data', `/data/diagonal/${index}/bins`)
      }))
    );
    const bins = seriesGroups(diagonal.bins);
    bins.forEach((_, series) => {
      if (!groups.has(series)) {
        errors.push(issue('INCONSISTENT_SERIES', `/data/diagonal/${index}/bins`, '分箱包含未知系列'));
      }
    });
    groups.forEach((rows, series) => {
      const group = bins.get(series) ?? [];
      const observations = rows.filter(({ row }) => row.values[diagonal.variable] !== null);
      const count = group.reduce((sum, { row }) => sum + row.count, 0);
      if (count !== observations.length) {
        errors.push(issue('INVALID_RANGE', `/data/diagonal/${index}/bins`, '分箱计数之和须等于该变量有效观测数'));
      }
      // 二分查箱：验证数据与预分箱的对应关系，不重新生成分箱边界。
      const actual = new Array(group.length).fill(0);
      observations.forEach(({ row }) => {
        const value = row.values[diagonal.variable]!;
        let lo = 0,
          hi = group.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (group[mid].row.binEnd < value || (group[mid].row.binEnd === value && mid < group.length - 1)) {
            lo = mid + 1;
          } else {
            hi = mid;
          }
        }
        if (lo >= group.length || value < group[lo].row.binStart) {
          errors.push(issue('INVALID_RANGE', `/data/diagonal/${index}/bins`, '分箱范围未覆盖有效观测'));
        } else {
          actual[lo]++;
        }
      });
      if (group.some(({ row }, i) => row.count !== actual[i])) {
        errors.push(
          issue(
            'INVALID_RANGE',
            `/data/diagonal/${index}/bins`,
            '分箱计数与 [start,end)（最后一箱含 end）中的观测不一致'
          )
        );
      }
    });
  });
  return errors;
}
