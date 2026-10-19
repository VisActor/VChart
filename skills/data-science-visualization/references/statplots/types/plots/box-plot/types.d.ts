import type { BaseSpec, SeriesRow } from '../../common/types';
export interface BoxPlotRow extends SeriesRow {
    category: string;
    value: number;
}
export interface BoxPlotWhiskersSpec {
    iqrMultiplier?: number;
}
export interface BoxPlotSpec extends BaseSpec {
    type: 'boxPlot';
    data: BoxPlotRow[];
    whiskers?: BoxPlotWhiskersSpec;
    fieldLabels?: {
        category?: string;
        value?: string;
    };
}
