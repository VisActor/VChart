import type { BaseSpec } from '../../common/types';
import type { BinaryScoreRow } from '../roc/types';
export type PrecisionRecallCurveRow = BinaryScoreRow;
export interface PrecisionRecallCurveSpec extends BaseSpec {
    type: 'precisionRecallCurve';
    data: PrecisionRecallCurveRow[];
    baseline?: boolean;
    fieldLabels?: {
        recall?: string;
        precision?: string;
    };
}
