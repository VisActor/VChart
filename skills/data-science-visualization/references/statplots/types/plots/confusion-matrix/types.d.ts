import type { BaseSpec } from '../../common/types';
export interface ConfusionMatrixRow {
    actual: string;
    predicted: string;
}
export interface ConfusionMatrixSpec extends BaseSpec {
    type: 'confusionMatrix';
    data: ConfusionMatrixRow[];
    classOrder?: string[];
    normalization?: 'none' | 'actual' | 'predicted' | 'all';
    fieldLabels?: {
        actual?: string;
        predicted?: string;
        count?: string;
        proportion?: string;
    };
}
