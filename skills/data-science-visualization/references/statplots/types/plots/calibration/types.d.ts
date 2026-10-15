import type { BaseSpec, SeriesRow } from '../../common/types';
export interface CalibrationCurveRow extends SeriesRow {
    actual: boolean;
    probability: number;
}
export interface CalibrationCurveSpec extends BaseSpec {
    type: 'calibrationCurve';
    data: CalibrationCurveRow[];
    binning?: {
        binCount?: number;
        strategy?: 'uniform' | 'quantile';
    };
    fieldLabels?: {
        meanPredictedProbability?: string;
        observedRate?: string;
    };
}
