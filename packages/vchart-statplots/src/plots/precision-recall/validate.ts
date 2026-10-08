import type { PrecisionRecallCurveSpec } from './types';
import { checkSeries, checkUnique, checkRange, issue } from '../../common/validation';
import { checkAscending } from '../../common/bounds';
export function validatePrecisionRecall(spec: PrecisionRecallCurveSpec) {
  const errors = [...checkSeries(spec.data), ...checkAscending(spec.data, 'recall', false)];
  spec.data.forEach((row, i) => {
    errors.push(
      ...checkRange(row.recall, `/data/${i}/recall`, 0, 1),
      ...checkRange(row.precision, `/data/${i}/precision`, 0, 1)
    );
  });
  if (spec.positiveRate !== undefined) {
    errors.push(...checkRange(spec.positiveRate, '/positiveRate', 0, 1));
  }
  if (spec.metrics) {
    errors.push(...checkUnique(spec.metrics, row => row.series ?? '', '/metrics'));
    const groups = new Set(spec.data.map(row => row.series));
    spec.metrics.forEach((row, i) => {
      errors.push(...checkRange(row.averagePrecision, `/metrics/${i}/averagePrecision`, 0, 1));
      if (!groups.has(row.series)) {
        errors.push(issue('INCONSISTENT_SERIES', `/metrics/${i}/series`, 'AP 须对应曲线系列'));
      }
    });
  }
  return errors;
}
