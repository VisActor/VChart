import { quantileSorted } from '@visactor/vutils';
import type { CalibrationCurveSpec } from './types';
import { seriesGroups } from '../../common/validation';
export function computeCalibration(spec: CalibrationCurveSpec) {
  const count = spec.binning?.binCount ?? 5;
  const values: {
    series?: string;
    binStart: number;
    binEnd: number;
    count: number;
    meanPredictedProbability: number;
    observedRate: number;
  }[] = [];
  for (const [series, group] of seriesGroups(spec.data)) {
    const probabilities =
      spec.binning?.strategy === 'quantile' ? group.map(({ row }) => row.probability).sort((a, b) => a - b) : undefined;
    const boundaries = Array.from({ length: count + 1 }, (_, i) =>
      probabilities ? quantileSorted(probabilities, i / count) : i / count
    );
    const bins = Array.from({ length: count }, () => ({ n: 0, positive: 0, sum: 0 }));
    for (const { row } of group) {
      // Lower-bound over internal edges: values exactly on an edge belong to the left bin.
      let lo = 0;
      let hi = count - 1;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (boundaries[mid + 1] < row.probability) lo = mid + 1;
        else hi = mid;
      }
      bins[lo].n++;
      bins[lo].positive += Number(row.actual);
      bins[lo].sum += row.probability;
    }
    bins.forEach((bin, i) => {
      if (bin.n)
        values.push({
          series,
          binStart: boundaries[i],
          binEnd: boundaries[i + 1],
          count: bin.n,
          meanPredictedProbability: bin.sum / bin.n,
          observedRate: bin.positive / bin.n
        });
    });
  }
  return values;
}
