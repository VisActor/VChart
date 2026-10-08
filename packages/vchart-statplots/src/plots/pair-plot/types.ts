import type { BaseSpec, SeriesRow } from '../../common/types';
export interface PairPlotObservation extends SeriesRow {
  id: string;
  values: { [variable: string]: number | null };
}
export interface PairPlotBin extends SeriesRow {
  binStart: number;
  binEnd: number;
  count: number;
}
export interface PairPlotSpec extends BaseSpec {
  type: 'pairPlot';
  variables: string[];
  data: { observations: PairPlotObservation[]; diagonal: { variable: string; bins: PairPlotBin[] }[] };
}
