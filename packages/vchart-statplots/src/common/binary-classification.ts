import type { BinaryScoreRow } from '../plots/roc/types';
import { seriesGroups, checkSeries, issue } from './validation';

export interface BinaryThresholdGroup {
  series?: string;
  sampleCount: number;
  positiveCount: number;
  negativeCount: number;
  counts: { threshold: number; tp: number; fp: number }[];
}

export function validateBinaryScores(rows: readonly BinaryScoreRow[], requireNegative: boolean) {
  const errors = checkSeries(rows);
  for (const group of seriesGroups(rows).values()) {
    const positives = group.reduce((n, { row }) => n + Number(row.actual), 0);
    if (!positives || (requireNegative && positives === group.length)) {
      errors.push(
        issue(
          'INVALID_RANGE',
          `/data/${group[0].index}/actual`,
          requireNegative ? 'ROC 的每个系列须同时含正例与负例' : 'PR 的每个系列须至少有一个正例'
        )
      );
    }
  }
  return errors;
}

export function buildBinaryThresholds(rows: readonly BinaryScoreRow[]): BinaryThresholdGroup[] {
  const results: BinaryThresholdGroup[] = [];
  for (const [series, indexed] of seriesGroups(rows)) {
    const sorted = indexed.map(({ row }) => row).sort((a, b) => b.score - a.score);
    const positiveCount = sorted.reduce((n, row) => n + Number(row.actual), 0);
    const counts: BinaryThresholdGroup['counts'] = [];
    let tp = 0;
    let fp = 0;
    for (let i = 0; i < sorted.length; ) {
      const threshold = sorted[i].score;
      do {
        if (sorted[i].actual) tp++;
        else fp++;
        i++;
      } while (i < sorted.length && sorted[i].score === threshold);
      counts.push({ threshold, tp, fp });
    }
    results.push({
      series,
      sampleCount: sorted.length,
      positiveCount,
      negativeCount: sorted.length - positiveCount,
      counts
    });
  }
  return results;
}
