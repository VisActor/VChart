import type { ScatterPlotSpec } from './types';
import { checkSeries, issue } from '../../common/validation';
import { checkBounds, checkAscending } from '../../common/bounds';
import {
  checkRegressionOptions,
  checkRegressionObservations,
  checkRegressionConfidence
} from '../../common/regression';
export function validateScatter(spec: ScatterPlotSpec) {
  const errors = checkSeries(spec.data);
  if (spec.fit?.input === 'observations') {
    const fit = spec.fit;
    errors.push(...checkRegressionOptions(fit, '/fit'), ...checkRegressionObservations(spec.data, fit));
    if (fit.method !== 'lowess') {
      errors.push(...checkRegressionConfidence(fit.confidence, '/fit/confidence'));
      const count = fit.sampling?.points;
      if (count !== undefined && (!Number.isInteger(count) || count < 2 || count > 512)) {
        errors.push(issue('INVALID_RANGE', '/fit/sampling/points', '曲线采样点数须为 2–512 整数'));
      }
    }
  } else if (spec.fit) {
    errors.push(
      ...checkSeries(spec.fit.data, '/fit/data'),
      ...checkBounds(spec.fit.data, spec.fit.interval, '/fit/data'),
      ...checkAscending(spec.fit.data, 'x', true, '/fit/data')
    );
    const groups = new Set(spec.data.map(row => row.series));
    spec.fit.data.forEach((row, i) => {
      if (!groups.has(row.series)) {
        errors.push(issue('INCONSISTENT_SERIES', `/fit/data/${i}/series`, '拟合曲线须对应观测系列'));
      }
    });
  }
  return errors;
}
