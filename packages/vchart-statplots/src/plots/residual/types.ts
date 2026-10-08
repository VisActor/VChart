import type { BaseSpec, SeriesRow } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface ResidualPlotRow extends SeriesRow {
  id: string;
  /** 外部模型给出的拟合值，与 residual 对应。 */
  fittedValue: number;
  residual: number;
}
export interface ResidualPlotSpec extends BaseSpec {
  type: 'residualPlot';
  data: ResidualPlotRow[];
  /** 外部残差的定义；本配置不重新计算或标准化残差。 */
  residualKind: 'raw' | 'standardized' | 'studentized';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { fittedValue?: string; residual?: string };
}
