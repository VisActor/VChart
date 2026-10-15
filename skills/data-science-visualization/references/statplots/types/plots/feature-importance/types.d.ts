import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
export interface FeatureImportancePlotRow extends SeriesRow {
    feature: string;
    importance: number;
    lower?: number;
    upper?: number;
}
export interface FeatureImportancePlotSpec extends BaseSpec {
    type: 'featureImportancePlot';
    data: FeatureImportancePlotRow[];
    method: string;
    interval?: Interval;
    fieldLabels?: {
        feature?: string;
        importance?: string;
    };
}
