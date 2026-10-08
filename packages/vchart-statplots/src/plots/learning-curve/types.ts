import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface LearningCurveRow extends SeriesRow {
  /** 训练样本数，正整数；不是训练轮次 epoch。 */
  trainSize: number;
  /** 训练集或验证集分数来源。 */
  split: 'train' | 'validation';
  score: number;
  lower?: number;
  upper?: number;
}
export interface LearningCurveSpec extends BaseSpec {
  type: 'learningCurve';
  data: LearningCurveRow[];
  /** 外部计算的评价指标名称，例如 Accuracy 或 MSE。 */
  metric: string;
  interval?: Interval;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { trainSize?: string; score?: string };
}
