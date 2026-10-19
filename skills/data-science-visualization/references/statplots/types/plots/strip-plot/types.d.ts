import type { BaseSpec, SeriesRow } from '../../common/types';
export interface StripPlotRow extends SeriesRow {
    id: string;
    category: string;
    value: number;
}
export interface StripPlotSpec extends BaseSpec {
    type: 'stripPlot';
    data: StripPlotRow[];
    layout?: 'strip' | 'jitter' | 'swarm';
    jitterRatio?: number;
    fieldLabels?: {
        category?: string;
        value?: string;
    };
}
