import type { BaseSpec, SeriesRow } from '../../common/types';
export interface QqPlotRow extends SeriesRow {
    value: number;
}
export interface QqPlotSpec extends BaseSpec {
    type: 'qqPlot';
    data: QqPlotRow[];
    distribution?: {
        type: 'normal';
        mean?: number;
        standardDeviation?: number;
    };
    referenceLine?: 'none' | 'identity' | 'quartiles' | 'regression';
    fieldLabels?: {
        theoreticalQuantile?: string;
        sampleQuantile?: string;
    };
}
