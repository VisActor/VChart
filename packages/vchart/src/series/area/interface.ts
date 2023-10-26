import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, ILineMarkSpec, IAreaMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IAnimationSpec } from '../../animation/spec';
import type { AreaAppearPreset } from './animation';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { ISamplingMethod } from '../../typings/sampling';

export interface IAreaSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<string, AreaAppearPreset>,
    IMarkProgressiveConfig {
  /**
   * 系列类型
   */
  type: 'area';
  /**
   * x轴字段
   */
  xField: string | string[];
  /**
   * y轴字段
   */
  yField: string | string[];
  /**
   * 点图元配置
   */
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 线图元配置
   */
  [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
  /**
   * 面积图元配置
   */
  [SeriesMarkNameEnum.area]?: IMarkSpec<IAreaMarkSpec>;
  /**
   * 系列主 mark 类型配置，该配置会影响图例的展示
   * @default 'area'
   * @since 1.2.0
   */
  seriesMark?: 'point' | 'line' | 'area';

  /**
   * 是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点
   * @default false
   * @since 1.3.0
   */
  activePoint?: boolean;
  /**
   * 数据采样 - 采样方法
   * @since 1.6.0
   */
  sampling?: ISamplingMethod;
  /**
   * 数据采样 - 采样系数
   * @since 1.6.0
   * @default 1
   */
  samplingFactor?: number;
  /**
   * 标记点之间的距离，px
   * @since 1.6.0
   */
  pointDis?: number;
  /**
   * 标记点之间的距离， pointSize 的倍数
   * @since 1.6.0
   * @default 1
   */
  pointDisMul?: number;
  /**
   * 是否允许标记图形相互覆盖
   * @since 1.6.0
   * @default false
   */
  markOverlap?: boolean;
}

export interface IAreaSeriesTheme extends ICartesianSeriesTheme, ILineLikeSeriesTheme {
  [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
