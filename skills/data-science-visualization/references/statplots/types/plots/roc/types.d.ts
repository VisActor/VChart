import type { BaseSpec, SeriesRow } from '../../common/types';
export interface BinaryScoreRow extends SeriesRow {
    actual: boolean;
    score: number;
}
export type RocCurveRow = BinaryScoreRow;
export interface RocCurveSpec extends BaseSpec {
    type: 'rocCurve';
    data: RocCurveRow[];
    fieldLabels?: {
        fpr?: string;
        tpr?: string;
    };
}
