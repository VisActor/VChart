import type { CalibrationCurveSpec } from './types';
import { checkSeries, checkCount, checkRange, issue, seriesGroups } from '../../common/validation';
import { checkBounds, checkAscending } from '../../common/bounds';
export function validateCalibration(spec: CalibrationCurveSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkBounds(spec.data, spec.interval),
    ...checkAscending(spec.data, 'binStart')
  ];
  spec.data.forEach((row, i) => {
    for (const key of ['binStart', 'binEnd', 'meanPredictedProbability', 'observedRate', 'lower', 'upper'] as const) {
      if (row[key] !== undefined) {
        errors.push(...checkRange(row[key]!, `/data/${i}/${key}`, 0, 1));
      }
    }
    errors.push(...checkCount(row.count, `/data/${i}/count`));
    if (
      !row.count ||
      row.binStart >= row.binEnd ||
      row.meanPredictedProbability < row.binStart ||
      row.meanPredictedProbability > row.binEnd
    ) {
      errors.push(issue('INVALID_RANGE', `/data/${i}`, '校准箱须非空，均值位于有序箱边界内'));
    }
  });
  seriesGroups(spec.data).forEach(group =>
    group.forEach(({ row, index }, i) => {
      if (i && row.binStart < group[i - 1].row.binEnd) {
        errors.push(issue('INVALID_RANGE', `/data/${index}/binStart`, '校准箱不能重叠'));
      }
    })
  );
  return errors;
}
