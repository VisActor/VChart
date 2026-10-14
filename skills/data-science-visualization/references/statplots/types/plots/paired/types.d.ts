import type { BaseSpec, SeriesRow } from '../../common/types';
export interface PairedComparisonPlotRow extends SeriesRow {
    id: string;
    category: string;
    value: number;
}
export interface PairedComparisonPlotSpec extends BaseSpec {
    type: 'pairedComparisonPlot';
    data: PairedComparisonPlotRow[];
    categoryOrder: [string, string];
    fieldLabels?: {
        category?: string;
        value?: string;
    };
}
