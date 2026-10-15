import type { BaseSpec, SeriesRow } from '../../common/types';
/** 原始一维样本，无序和重复值有效。 */
export interface QqPlotRow extends SeriesRow {
  value: number;
}
export interface QqPlotSpec extends BaseSpec {
  type: 'qqPlot';
  data: QqPlotRow[];
  /** 第一版支持正态分布，不自动拟合参数。 */
  distribution?: { type: 'normal'; mean?: number; standardDeviation?: number };
  /** 默认 none；quartiles / regression 按系列独立计算。 */
  referenceLine?: 'none' | 'identity' | 'quartiles' | 'regression';
  fieldLabels?: { theoreticalQuantile?: string; sampleQuantile?: string };
}
