export interface KdeEstimationSpec {
  /** 默认 gaussian。 */
  kernel?: 'gaussian' | 'epanechnikov';
  /** 正数为固定带宽，单位与 value 相同；默认 scott，各分布组独立估计。 */
  bandwidth?: number | 'scott' | 'silverman';
  /** 自动带宽的标准差约定，默认 sample；固定数值带宽时不能配置。 */
  standardDeviation?: 'sample' | 'population';
  /** 正的带宽倍率，默认 1，同时作用于固定和自动带宽。 */
  bandwidthAdjust?: number;
}
export interface KdeSamplingSpec {
  /** 每组等距绘制点数，默认 256；仅控制曲线离散精度。
   * @TJS-type integer
   * @minimum 2
   * @maximum 2048
   */
  points?: number;
  /** 从观测极值向外扩展的带宽倍数；KDE 高斯默认 3，violin 高斯默认 2，Epanechnikov 默认 1。 */
  cut?: number;
}
