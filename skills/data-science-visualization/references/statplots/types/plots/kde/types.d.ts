import type { BaseSpec, SeriesRow } from '../../common/types';
import type { KdeEstimationSpec, KdeSamplingSpec } from '../../common/kde-types';
export type { KdeEstimationSpec, KdeSamplingSpec } from '../../common/kde-types';
export interface KdePlotRow extends SeriesRow {
    value: number;
}
export interface KdePlotSpec extends BaseSpec {
    type: 'kdePlot';
    data: KdePlotRow[];
    estimation?: KdeEstimationSpec;
    sampling?: KdeSamplingSpec;
    normalizationScope?: 'all' | 'series';
    fieldLabels?: {
        value?: string;
        density?: string;
    };
}
