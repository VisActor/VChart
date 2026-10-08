import type { BaseSpec, SeriesRow } from '../../common/types';

export interface ViolinPlotRow extends SeriesRow {
  category: string;
  value: number;
  /** 已计算的概率密度，不是样本数量。 */
  density: number;
}

export interface ViolinPlotSpec extends BaseSpec {
  type: 'violinPlot';
  data: ViolinPlotRow[];
  /** 密度轮廓归一化：width 等最大宽度（默认），area 等面积。 */
  densityNormalization?: 'width' | 'area';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; value?: string; density?: string };
}
