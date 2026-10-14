import type { BaseSpec } from '../../common/types';
export interface ScreePlotRow {
    component: number;
    explainedVarianceRatio: number;
}
export interface ScreePlotSpec extends BaseSpec {
    type: 'screePlot';
    data: ScreePlotRow[];
    showCumulative?: boolean;
    fieldLabels?: {
        component?: string;
        explainedVarianceRatio?: string;
    };
}
