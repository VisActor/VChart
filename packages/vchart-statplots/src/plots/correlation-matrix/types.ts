import type { BaseSpec } from '../../common/types';
import type { NumericObservation } from '../../common/observation-table-types';
export interface CorrelationMatrixSpec extends BaseSpec {
  type: 'correlationMatrix';
  variables: string[];
  data: { observations: NumericObservation[] };
  /** 默认 pearson；kendall 为 tau-b。 */
  method?: 'pearson' | 'spearman' | 'kendall';
  /** 最少有效配对数，默认 2。
   * @TJS-type integer
   * @minimum 2
   */
  minSamples?: number;
  triangle?: 'full' | 'lower' | 'upper';
  fieldLabels?: { row?: string; column?: string; correlation?: string };
}
