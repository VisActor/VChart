export interface KdeEstimationSpec {
  /** 默认 gaussian。 */
  kernel?: 'gaussian' | 'epanechnikov';
  /** 正数为固定带宽，单位与 value 相同；默认 scott，各分布组独立估计。 */
  bandwidth?: number | 'scott' | 'silverman';
}
export interface KdeSamplingSpec {
  /** 每组等距绘制点数，默认 256；仅控制曲线离散精度。
   * @TJS-type integer
   * @minimum 2
   * @maximum 2048
   */
  points?: number;
}
