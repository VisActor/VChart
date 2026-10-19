import type { BaseSpec, SeriesRow } from '../../common/types';
import type { KdeEstimationSpec, KdeSamplingSpec } from '../../common/kde-types';

export interface ViolinPlotRow extends SeriesRow {
  category: string;
  /** 原始观测；允许乱序，重复值分别参与估计。 */
  value: number;
}

export interface ViolinPlotSpec extends BaseSpec {
  type: 'violinPlot';
  data: ViolinPlotRow[];
  /** 各 category + series 独立计算 KDE；单样本和常数组须显式提供正带宽。 */
  estimation?: KdeEstimationSpec;
  /** 每组轮廓的绘制采样配置，不改变估计方法和带宽。 */
  sampling?: KdeSamplingSpec;
  /** 默认 area 等面积；count 最大宽度按样本数缩放；width 等最大宽度。 */
  densityNormalization?: 'width' | 'area' | 'count';
  /** 默认 series，同系列跨分类共享归一化尺度；all 所有分布组共享。 */
  normalizationScope?: 'all' | 'series';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; value?: string; density?: string };
}
