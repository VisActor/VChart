import type { RocCurveSpec } from './types';
import { buildBinaryThresholds } from '../../common/binary-classification';
export function computeRoc(spec: RocCurveSpec) {
  return buildBinaryThresholds(spec.data).flatMap(group => {
    const values = [
      { fpr: 0, tpr: 0, threshold: undefined as number | undefined },
      ...group.counts.map(row => ({
        fpr: row.fp / group.negativeCount,
        tpr: row.tp / group.positiveCount,
        threshold: row.threshold
      }))
    ];
    let auc = 0;
    for (let i = 1; i < values.length; i++) {
      auc += ((values[i].fpr - values[i - 1].fpr) * (values[i].tpr + values[i - 1].tpr)) / 2;
    }
    return values.map(row => ({ ...row, series: group.series, auc, sampleCount: group.sampleCount }));
  });
}
