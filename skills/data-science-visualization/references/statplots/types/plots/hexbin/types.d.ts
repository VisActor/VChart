import type { BaseSpec } from '../../common/types';
export interface HexbinPlotRow {
    x: number;
    y: number;
}
export interface HexbinBinningSpec {
    xBins?: number;
}
export interface HexbinPlotSpec extends BaseSpec {
    type: 'hexbinPlot';
    data: HexbinPlotRow[];
    binning?: HexbinBinningSpec;
    fieldLabels?: {
        x?: string;
        y?: string;
        count?: string;
    };
}
