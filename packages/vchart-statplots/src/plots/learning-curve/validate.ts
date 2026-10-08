import type { LearningCurveSpec } from './types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
import { checkBounds } from '../../common/bounds';
export function validateLearningCurve(spec: LearningCurveSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkBounds(spec.data, spec.interval),
    ...checkUnique(spec.data, row => JSON.stringify([row.series, row.split, row.trainSize]))
  ];
  const previous = new Map<string, number>();
  spec.data.forEach((row, i) => {
    const key = JSON.stringify([row.series, row.split]);
    if (!Number.isInteger(row.trainSize) || row.trainSize <= 0) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/trainSize`, '训练样本数须为正整数'));
    }
    if (previous.has(key) && row.trainSize <= previous.get(key)!) {
      errors.push(issue('INVALID_ORDER', `/data/${i}/trainSize`, '每个系列及 split 内样本数须递增'));
    }
    previous.set(key, row.trainSize);
  });
  return errors;
}
