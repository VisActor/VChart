import type { EcdfPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkRange, checkSeries, issue, seriesGroups } from '../../common/validation';
export function validateEcdf(spec: EcdfPlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  for (const points of seriesGroups(spec.data).values()) {
    points.forEach(({ row, index }, i) => {
      errors.push(...checkRange(row.cumulativeProbability, `/data/${index}/cumulativeProbability`, 0, 1));
      if (
        i &&
        (row.value <= points[i - 1].row.value || row.cumulativeProbability < points[i - 1].row.cumulativeProbability)
      ) {
        errors.push(issue('INVALID_ORDER', `/data/${index}`, 'value 必须严格递增，cumulativeProbability 必须单调不减'));
      }
    });
  }
  return errors;
}
