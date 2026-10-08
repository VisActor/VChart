import type { BoxPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
export function validateBoxPlot(spec: BoxPlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  errors.push(...checkUnique(spec.data, row => JSON.stringify([row.category, row.series])));
  spec.data.forEach((row, i) => {
    if (!(row.whiskerLower <= row.q1 && row.q1 <= row.median && row.median <= row.q3 && row.q3 <= row.whiskerUpper)) {
      errors.push(issue('INVALID_ORDER', `/data/${i}`, '须下端、Q1、中位数、Q3、须上端必须依次非递减'));
    }
  });
  return errors;
}
