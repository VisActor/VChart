import type { IMarkSpec } from '../../typings/spec/common';
import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { ISymbolMarkSpec, ILineMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ISamplingMethod } from '../../typings/sampling';

type LineMarks = 'point' | 'line';

export interface ILineSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<LineMarks, LineAppearPreset>,
    IMarkProgressiveConfig {
  /** 系列类型 */
  type: 'line';
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
  /** 标签配置 */
  label?: ILabelSpec & {
    /** 标签位置 */
    position?:
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center';
  };
  /**
   * 系列主 mark 类型配置，该配置会影响图例的展示
   * @default 'line'
   * @since 1.2.0
   */
  seriesMark?: 'line' | 'point';

  /**
   * 是否使用额外的 activePoint 显示交互点，可以在点隐藏时显示被交互的点
   * @default false
   * @since 1.3.0
   */
  activePoint?: boolean;
  /**
   * 数据采样 - 采样方法
   * @since 1.5.3
   */
  sampling: ISamplingMethod;
  /**
   * 数据采样 - 采样系数
   * @since 1.5.3
   * @default 1
   */
  samplingFactor: number;
  /**
   * 标记点之间的距离，px
   * @since 1.5.3
   */
  pointDis?: number;
  /**
   * 标记点之间的距离， pointSize 的倍数
   * @since 1.5.3
   * @default 1
   */
  pointDisMul?: number;
  /**
   * 是否允许标记图形相互覆盖
   * @since 1.5.3
   * @default false
   */
  markOverlap?: boolean;
}

export interface ILineSeriesTheme extends Omit<ICartesianSeriesTheme, 'label'>, ILineLikeSeriesTheme {
  label?: Partial<ILineSeriesSpec['label']>;
}
