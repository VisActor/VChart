import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface FeatureImportancePlotRow extends SeriesRow {
  feature: string;
  importance: number;
  lower?: number;
  upper?: number;
}
export interface FeatureImportancePlotSpec extends BaseSpec {
  type: 'featureImportancePlot';
  data: FeatureImportancePlotRow[];
  /** 外部计算方法或结果类型说明；本包不重新拟合或估计。 */
  method: string;
  interval?: Interval;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { feature?: string; importance?: string };
}
