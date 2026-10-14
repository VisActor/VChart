import type { BaseSpec, SeriesRow } from '../../common/types';
export interface PairPlotObservation extends SeriesRow {
    id: string;
    values: {
        [variable: string]: number | null;
    };
}
export interface PairPlotBinningSpec {
    binCount?: number;
}
export type PairPlotDiagonalSpec = {
    type?: 'histogram';
    binning?: PairPlotBinningSpec;
} | {
    type: 'none';
};
export interface PairPlotSpec extends BaseSpec {
    type: 'pairPlot';
    variables: string[];
    data: {
        observations: PairPlotObservation[];
    };
    diagonal?: PairPlotDiagonalSpec;
}
