import type { IBaseScale } from '@visactor/vscale';
import type { Datum, IPolarOrientType, StringOrNumber } from '../../../typings';
import type { IComponent } from '../../interface/common';
import type { ICartesianAxisSpec } from '../cartesian/interface';
import type { ITextGraphicAttribute } from '@visactor/vrender-core';

export interface StatisticsDomain {
  domain: any[];
  index: { [key in StringOrNumber]: number };
}

export interface IAxis extends IComponent {
  valueToPosition: (value: any) => number;
  getScale: () => IBaseScale;
  getScales: () => IBaseScale[];
  getOrient: () => ICartesianAxisSpec['orient'] | IPolarOrientType;
  getInverse: () => boolean;
  visible: boolean;
  // 标记轴的方向，左到右，右到左，上到下，下到上
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
}

export interface IAxisItem<T> {
  visible?: boolean;
  style?: Omit<T, 'visible'>;
}

export interface IAxisItemTheme<T> {
  visible?: boolean;
  style?: Omit<T, 'visible'>;
}
export type AxisAnimationPreset = 'groupFadeIn' | 'fadeIn' | 'grow';

export type ITickCallbackOption = {
  axisLength?: number;
  labelStyle?: ITextGraphicAttribute;
};

export type StyleCallback<T> = (value: any, index: number, datum: Datum, data: Datum[]) => T;
export type AxisType = 'linear' | 'ordinal' | 'band' | 'point' | 'time' | 'log' | 'symlog';

export interface IAxisLocationCfg {
  bandPosition?: number;
  datum?: Datum;
}

export interface ITickCalculationCfg {
  /** tick步长 */
  tickStep?: number;
  /**
   * 期望的连续轴tick数量
   * The desired number of ticks draw on linear axis.
   * @default 5
   * @description 建议的tick数量，并不保证结果一定是配置值
   * @since 1.4.0 后支持函数回调。
   */
  tickCount?: number | ((option: ITickCallbackOption) => number);
  /**
   * 强制设置tick数量
   * The exact number of ticks draw on linear axis. Might lead to decimal step.
   * @default 5
   * @description 强制设置的tick数量，可能由于数据范围导致tick值为小数
   */
  forceTickCount?: number;
  /**
   * 连续轴 tick 生成算法：
   * 'average': 尽可能均分；
   * 'd3'：与 d3 默认逻辑一致，以 [1, 2, 5] 为基数生成；
   * @default 'average'
   * @since 1.3.0
   */
  tickMode?: 'average' | 'd3';
  /**
   * 连续轴，是否避免小数 tick。
   * @default false
   * @description 当配置了 tickStep 或 forceTickCount 时不生效。
   * @since 1.3.0
   */
  noDecimals?: boolean;
}
