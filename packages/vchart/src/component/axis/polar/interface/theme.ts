import type { IDomainLineTheme, ITickTheme, ITitleTheme, ILabelTheme } from '../../interface';
import type { IPolarGridTheme } from './common';

export interface IPolarAxisTheme {
  common?: IPolarAxisCommonTheme;
}

export interface IPolarAxisCommonTheme {
  /** 网格线配置 */
  grid?: IPolarGridTheme;
  /** 子网格线配置 */
  subGrid?: IPolarGridTheme;
  /** 轴线配置 */
  domainLine?: IDomainLineTheme;
  /** 轴标签配置 */
  label?: ILabelTheme;
  /** 轴标题配置 */
  title?: ITitleTheme;
  /** 轴刻度线配置 */
  tick?: ITickTheme;
  /** 轴子刻度线配置 */
  subTick?: ITickTheme;
}
