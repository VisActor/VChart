import type { ConfusionMatrixSpec } from './types';

export function aggregateConfusionMatrix(spec: ConfusionMatrixSpec) {
  const discovered = new Set<string>();
  const counts = new Map<string, Map<string, number>>();
  const actualTotals = new Map<string, number>();
  const predictedTotals = new Map<string, number>();
  for (const row of spec.data) {
    discovered.add(row.actual).add(row.predicted);
    let actual = counts.get(row.actual);
    if (!actual) {
      actual = new Map();
      counts.set(row.actual, actual);
    }
    actual.set(row.predicted, (actual.get(row.predicted) ?? 0) + 1);
    actualTotals.set(row.actual, (actualTotals.get(row.actual) ?? 0) + 1);
    predictedTotals.set(row.predicted, (predictedTotals.get(row.predicted) ?? 0) + 1);
  }
  const classes = spec.classOrder ?? [...discovered];
  const values: { actual: string; predicted: string; count: number; value: number | null }[] = [];
  if (spec.data.length) {
    for (const actual of classes) {
      for (const predicted of classes) {
        const count = counts.get(actual)?.get(predicted) ?? 0;
        const denominator =
          spec.normalization === 'actual'
            ? actualTotals.get(actual) ?? 0
            : spec.normalization === 'predicted'
            ? predictedTotals.get(predicted) ?? 0
            : spec.data.length;
        values.push({
          actual,
          predicted,
          count,
          value: !spec.normalization || spec.normalization === 'none' ? count : denominator ? count / denominator : null
        });
      }
    }
  }
  return { classes, values };
}
