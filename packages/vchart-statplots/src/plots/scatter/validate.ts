import type { ScatterPlotSpec } from './types';
import { checkSeries, issue } from '../../common/validation';
import { checkBounds, checkAscending } from '../../common/bounds';
export function validateScatter(spec: ScatterPlotSpec) {
  const errors = checkSeries(spec.data);
  if (spec.fit) {
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
