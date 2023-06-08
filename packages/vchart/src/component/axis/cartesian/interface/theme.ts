import type { ITick, ILabel, IGrid } from '../../interface';
import type { ICartesianDomainLine, ICartesianTitle } from './common';
import type { ICartesianAxisCommonSpec } from './spec';

export interface ICartesianAxisCommonTheme {
  /** 网格线配置 */
  grid?: IGrid;
  /** 网格线配置 */
  subGrid?: IGrid;
  /** 轴线配置 */
  domainLine?: ICartesianDomainLine;
  /** 轴标签配置 */
  label?: ILabel;
  /** 轴标题配置 */
  title?: ICartesianTitle;
  /** 轴刻度线配置 */
  tick?: ITick;
  /** 轴刻度线配置 */
  subTick?: ITick;
  /**
   * 轴背景配置
   */
  background?: ICartesianAxisCommonSpec['background'];
}
