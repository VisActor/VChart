import type { BaseSpec, SeriesRow } from '../../common/types';
export interface AutocorrelationPlotRow extends SeriesRow {
    value: number;
}
export interface AutocorrelationPlotSpec extends BaseSpec {
    type: 'autocorrelationPlot';
    data: AutocorrelationPlotRow[];
    method?: 'acf' | 'pacf';
    maxLag?: number;
    confidence?: false | {
        level?: number;
    };
    fieldLabels?: {
        lag?: string;
        correlation?: string;
    };
}
