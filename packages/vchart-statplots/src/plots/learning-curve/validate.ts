import type { LearningCurveSpec } from './types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
import { checkBounds } from '../../common/bounds';
export function validateLearningCurve(spec: LearningCurveSpec) {
  const errors = checkSeries(spec.data);
  spec.data.forEach((row, i) => {
    if (!Number.isInteger(row.trainSize) || row.trainSize <= 0) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/trainSize`, '训练样本数须为正整数'));
    }
  });
  if (spec.input === 'summaries') {
    errors.push(
      ...checkBounds(spec.data, spec.interval),
      ...checkUnique(spec.data, row => JSON.stringify([row.series, row.split, row.trainSize]))
    );
    const previous = new Map<string, number>();
    spec.data.forEach((row, i) => {
      const key = JSON.stringify([row.series, row.split]);
      if (previous.has(key) && row.trainSize <= previous.get(key)!) {
        errors.push(issue('INVALID_ORDER', `/data/${i}/trainSize`, '每系列及 split 内样本数须递增'));
      }
      previous.set(key, row.trainSize);
    });
  } else {
    errors.push(...checkUnique(spec.data, row => JSON.stringify([row.series, row.split, row.trainSize, row.fold])));
    if (spec.spread && spec.spread.multiplier !== undefined && spec.spread.multiplier <= 0) {
      errors.push(issue('INVALID_RANGE', '/spread/multiplier', '标准差带倍数须为正'));
    }
    const folds = new Map<string, { folds: Set<string>; path: string; series?: string; split: string; size: number }>();
    spec.data.forEach((row, i) => {
      if (!row.fold.length) {
        errors.push(issue('INVALID_RANGE', `/data/${i}/fold`, 'fold 不能为空'));
      }
      const key = JSON.stringify([row.series, row.split, row.trainSize]);
      if (!folds.has(key)) {
        folds.set(key, {
          folds: new Set(),
          path: `/data/${i}/fold`,
          series: row.series,
          split: row.split,
          size: row.trainSize
        });
      }
      folds.get(key)!.folds.add(row.fold);
    });
    const bySplit = new Map<string, string>();
    const bySize = new Map<string, string>();
    for (const group of folds.values()) {
      const set = JSON.stringify([...group.folds].sort());
      if (group.folds.size < 2) {
        errors.push(issue('INVALID_RANGE', group.path, '每个训练规模及 split 至少需要两折'));
      }
      for (const [map, key] of [
        [bySplit, JSON.stringify([group.series, group.split])],
        [bySize, JSON.stringify([group.series, group.size])]
      ] as const) {
        if (map.has(key) && map.get(key) !== set) {
          errors.push(issue('INVALID_RANGE', group.path, '训练规模间和两种 split 的 fold 集合须一致'));
        }
        map.set(key, set);
      }
    }
  }
  return errors;
}
