import type { RocCurveSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkRange, checkSeries, issue, seriesGroups } from '../../common/validation';

export function validateRoc(spec: RocCurveSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  const groups = seriesGroups(spec.data);
  for (const points of groups.values()) {
    points.forEach(({ row, index }, i) => {
      errors.push(...checkRange(row.fpr, `/data/${index}/fpr`, 0, 1));
      errors.push(...checkRange(row.tpr, `/data/${index}/tpr`, 0, 1));
      if (i && (row.fpr < points[i - 1].row.fpr || row.tpr < points[i - 1].row.tpr)) {
        errors.push(issue('INVALID_ORDER', `/data/${index}`, '同一条 ROC 曲线的 fpr、tpr 必须单调不减'));
      }
    });
  }
  const metricKeys = new Set<string | undefined>();
  spec.metrics?.forEach((metric, i) => {
    errors.push(...checkRange(metric.auc, `/metrics/${i}/auc`, 0, 1));
    if (!groups.has(metric.series)) {
      errors.push(issue('INCONSISTENT_SERIES', `/metrics/${i}/series`, '指标必须对应已提供的曲线'));
    }
    if (metricKeys.has(metric.series)) {
      errors.push(issue('DUPLICATE_KEY', `/metrics/${i}`, '同一条曲线只能提供一份指标'));
    }
    metricKeys.add(metric.series);
  });
  return errors;
}
