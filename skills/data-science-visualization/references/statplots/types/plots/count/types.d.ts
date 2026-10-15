import type { BaseSpec, SeriesRow } from '../../common/types';
export interface CountPlotRow extends SeriesRow {
    category: string;
}
export interface CountPlotSpec extends BaseSpec {
    type: 'countPlot';
    data: CountPlotRow[];
    statistic?: 'count' | 'proportion';
    normalizationScope?: 'all' | 'series';
    fieldLabels?: {
        category?: string;
        count?: string;
        proportion?: string;
    };
}
