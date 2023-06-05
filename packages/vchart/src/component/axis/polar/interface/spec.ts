import type { IPolarOrientType } from '../../../../typings';
import type { IBandAxisSpec, IDomainLine, ILinearAxisSpec, ITitle, ILabel, ICommonAxisSpec } from '../../interface';
import type { IPolarGrid } from './common';

/** spec */
export type IPolarAxisSpec = IPolarLinearAxisSpec | IPolarBandAxisSpec;

export type IPolarAxisCommonSpec = ICommonAxisSpec & {
  /**
   * 当配置了 innerRadius 时，可以通过设置 inside: true，将坐标轴展示在内圆。
   * @default false
   */
  inside?: boolean;
  /**
   * 轴位置，枚举类型，支持：`'radius'` 和 `'angle'`
   * - `'radius'` 代表半径轴
   * - `'angle'` 代表角度轴
   */
  orient: IPolarOrientType;
  /**
   * 网格线配置
   */
  grid?: IPolarGrid;
  /**
   * 轴的外半径，数值范围 0 -1
   */
  radius?: number;
  /**
   * 子网格线配置
   */
  subGrid?: IPolarGrid;
  /**
   * 轴线配置
   */
  domainLine?: IDomainLine;
  /**
   * 轴标签配置
   */
  label?: ILabel;
  /**
   * 轴标题配置
   */
  title?: ITitle;
};

export type IPolarLinearAxisSpec = IPolarAxisCommonSpec & ILinearAxisSpec;

export type IPolarBandAxisSpec = IPolarAxisCommonSpec & IBandAxisSpec;
