import type { BaseSpec } from '../../common/types';
export interface HistogramRow {
    value: number;
}
export interface HistogramBinningSpec {
    binCount?: number;
}
export interface HistogramSpec extends BaseSpec {
    type: 'histogram';
    data: HistogramRow[];
    binning?: HistogramBinningSpec;
    statistic?: 'count' | 'proportion' | 'density';
    fieldLabels?: {
        value?: string;
        count?: string;
        proportion?: string;
        density?: string;
    };
}
