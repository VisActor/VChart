import type { BaseSpec, SeriesRow } from '../../common/types';
export interface SeasonalPlotRow extends SeriesRow {
    cycle: string;
    phase: string;
    value: number;
}
export interface SeasonalPlotSpec extends BaseSpec {
    type: 'seasonalPlot';
    data: SeasonalPlotRow[];
    cycleOrder: string[];
    phaseOrder: string[];
    layout?: 'overlay' | 'subseries';
    fieldLabels?: {
        cycle?: string;
        phase?: string;
        value?: string;
    };
}
