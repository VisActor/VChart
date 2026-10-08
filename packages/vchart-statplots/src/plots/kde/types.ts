import type { BaseSpec, SeriesRow } from '../../common/types';
export interface KdePlotRow extends SeriesRow {
  /** 原始观测；重复值分别参与估计。 */
  value: number;
}
export interface KdeEstimationSpec {
  /** 默认 gaussian。 */
  kernel?: 'gaussian' | 'epanechnikov';
  /** 正数为固定带宽，单位与 value 相同；默认 scott，各系列独立估计。 */
  bandwidth?: number | 'scott' | 'silverman';
}
export interface KdeSamplingSpec {
  /** 每系列等距绘制点数，默认 256；仅控制曲线离散精度。
   * @TJS-type integer
   * @minimum 2
   * @maximum 2048
   */
  points?: number;
}
export interface KdePlotSpec extends BaseSpec {
  type: 'kdePlot';
  data: KdePlotRow[];
  /** 编译阶段的核密度估计配置。单样本和常数系列须显式提供正带宽。 */
  estimation?: KdeEstimationSpec;
  /** 绘制采样配置；不改变估计方法和带宽。 */
  sampling?: KdeSamplingSpec;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; density?: string };
}
