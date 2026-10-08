import type { BaseSpec, SeriesRow } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface SeasonalPlotRow extends SeriesRow {
  /** 完整周期编号，例如年份。 */
  cycle: string;
  /** 周期内位置，例如月份或季度。 */
  phase: string;
  value: number;
}
export interface SeasonalPlotSpec extends BaseSpec {
  type: 'seasonalPlot';
  data: SeasonalPlotRow[];
  /** 非空、无重复，覆盖输入的周期；可声明无观测的位置。 */
  cycleOrder: string[];
  /** 非空、无重复，覆盖输入的周期内位置；可声明无观测的位置。 */
  phaseOrder: string[];
  /** 默认 overlay；subseries 按 phase 分面、横轴为 cycle。 */
  layout?: 'overlay' | 'subseries';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { cycle?: string; phase?: string; value?: string };
}
