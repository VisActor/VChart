import type { BaseSpec } from '../../common/types';
export interface ShapBeeswarmPlotRow {
    id: string;
    feature: string;
    shapValue: number;
    featureValue: number | null;
}
export interface ShapBeeswarmPlotSpec extends BaseSpec {
    type: 'shapBeeswarmPlot';
    data: ShapBeeswarmPlotRow[];
    featureOrder: string[];
    fieldLabels?: {
        feature?: string;
        shapValue?: string;
        featureValue?: string;
    };
}
