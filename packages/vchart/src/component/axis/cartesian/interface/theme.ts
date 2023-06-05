import type { ITickTheme, ILabelTheme, IGridTheme } from '../../interface';
import type { ICartesianDomainLine, ICartesianTitleTheme } from './common';

export interface ICartesianAxisTheme {
  /** x轴 */
  axisX?: ICartesianAxisCommonTheme;
  /** y轴 */
  axisY?: ICartesianAxisCommonTheme;
  /** 公共配置，优先级低于axisX和axisY */
  common?: ICartesianAxisCommonTheme;
}

export interface ICartesianAxisCommonTheme {
  /** 网格线配置 */
  grid?: IGridTheme;
  /** 网格线配置 */
  subGrid?: IGridTheme;
  /** 轴线配置 */
  domainLine?: ICartesianDomainLine;
  /** 轴标签配置 */
  label?: ILabelTheme;
  /** 轴标题配置 */
  title?: ICartesianTitleTheme;
  /** 轴刻度线配置 */
  tick?: ITickTheme;
  /** 轴刻度线配置 */
  subTick?: ITickTheme;
}
