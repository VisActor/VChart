import type { BaseSpec, SeriesRow } from '../../common/types';
import type { KdeEstimationSpec, KdeSamplingSpec } from '../../common/kde-types';

export type { KdeEstimationSpec, KdeSamplingSpec } from '../../common/kde-types';

export interface KdePlotRow extends SeriesRow {
  /** 原始观测；重复值分别参与估计。 */
  value: number;
}

export interface KdePlotSpec extends BaseSpec {
  type: 'kdePlot';
  data: KdePlotRow[];
  /** 编译阶段的核密度估计配置。单样本和常数系列须显式提供正带宽。 */
  estimation?: KdeEstimationSpec;
  /** 绘制采样配置；不改变估计方法和带宽。 */
  sampling?: KdeSamplingSpec;
  /** 默认 all 按组样本比例缩放密度；series 各组概率密度独立积分为 1。 */
  normalizationScope?: 'all' | 'series';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; density?: string };
}
