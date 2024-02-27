import type { IBarSeriesSpec, IBar3dSeriesSpec } from '../../series/bar/interface';
import type { IChartExtendsSeriesSpec } from '../../typings/spec/common';
import type { ICartesianChartSpec } from '../cartesian/interface';

export interface IBarChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IBarSeriesSpec> {
  type: 'bar';
  /** 系列配置 */
  series?: IBarSeriesSpec[];
  /**
   * 是否开启自动 bandSize。如果开启，会根据传入的 barWidth 等配置自动计算 bandSize，从而影响轴实际长度
   * @since 1.10.0
   */
  autoBandSize?: {
    /** 计算 bandSize 所需的最小 barWidth  */
    barMinWidth?: number;
    /** 计算 bandSize 所需的最大 barWidth  */
    barMaxWidth?: number;
    /** 计算 bandSize 所需的 barWidth  */
    barWidth?: number;
    /** 计算 bandSize 所需的 barGapInGroup  */
    barGapInGroup?: number;
    /** 设置 bandSize 的在自动计算结果基础上的扩增值，单位为 px */
    extend?: number;
  };
}

export interface IBar3dChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IBar3dSeriesSpec> {
  type: 'bar3d';
  /** 系列配置 */
  series?: IBar3dSeriesSpec[];
}
