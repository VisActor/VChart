import type { BaseSpec, SeriesRow } from '../../common/types';
export interface PairPlotObservation extends SeriesRow {
  id: string;
  values: { [variable: string]: number | null };
}
export interface PairPlotBinningSpec {
  /** 每个非恒定变量的等宽箱数；省略时按有效观测数选择。
   * @TJS-type integer
   * @minimum 1
   * @maximum 200
   */
  binCount?: number;
}
export type PairPlotDiagonalSpec = { type?: 'histogram'; binning?: PairPlotBinningSpec } | { type: 'none' };
export interface PairPlotSpec extends BaseSpec {
  type: 'pairPlot';
  variables: string[];
  data: { observations: PairPlotObservation[] };
  diagonal?: PairPlotDiagonalSpec;
}
