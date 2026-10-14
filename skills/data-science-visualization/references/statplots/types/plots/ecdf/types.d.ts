import type { BaseSpec, SeriesRow } from '../../common/types';
export interface EcdfPlotRow extends SeriesRow {
    value: number;
}
export interface EcdfPlotSpec extends BaseSpec {
    type: 'ecdfPlot';
    data: EcdfPlotRow[];
    fieldLabels?: {
        value?: string;
        cumulativeProbability?: string;
    };
}
