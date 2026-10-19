import type { CalibrationCurveSpec } from './types';
import { checkSeries, checkRange, issue } from '../../common/validation';
export function validateCalibration(spec: CalibrationCurveSpec) {
  const errors = checkSeries(spec.data);
  spec.data.forEach((row, index) => errors.push(...checkRange(row.probability, `/data/${index}/probability`, 0, 1)));
  const count = spec.binning?.binCount ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 512)
    errors.push(issue('INVALID_RANGE', '/binning/binCount', '箱数须为 1–512 的整数'));
  return errors;
}
