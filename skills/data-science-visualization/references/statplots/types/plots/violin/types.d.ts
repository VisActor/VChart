import type { BaseSpec, SeriesRow } from '../../common/types';
import type { KdeEstimationSpec, KdeSamplingSpec } from '../../common/kde-types';
export interface ViolinPlotRow extends SeriesRow {
    category: string;
    value: number;
}
export interface ViolinPlotSpec extends BaseSpec {
    type: 'violinPlot';
    data: ViolinPlotRow[];
    estimation?: KdeEstimationSpec;
    sampling?: KdeSamplingSpec;
    densityNormalization?: 'width' | 'area' | 'count';
    normalizationScope?: 'all' | 'series';
    fieldLabels?: {
        category?: string;
        value?: string;
        density?: string;
    };
}
