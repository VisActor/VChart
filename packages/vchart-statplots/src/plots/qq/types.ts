import type { BaseSpec, SeriesRow } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface QqPlotRow extends SeriesRow {
  /** 给定理论分布的分位数，作为横轴；系列内非递减。 */
  theoreticalQuantile: number;
  /** 对应样本分位数，作为纵轴；系列内非递减。 */
  sampleQuantile: number;
}
export interface QqPlotSpec extends BaseSpec {
  type: 'qqPlot';
  data: QqPlotRow[];
  distribution: string;
  /** 显式参考线；数值及统计含义由调用方提供。 */
  referenceLine?: { method: string; intercept: number; slope: number };
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { theoreticalQuantile?: string; sampleQuantile?: string };
}
