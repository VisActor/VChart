import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IRect3dMarkSpec, IRectMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { BarAppearPreset } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface';
import type { MaybeArray } from '../../typings';

type BarMarks = 'bar';

export interface IBarSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<BarMarks, BarAppearPreset>,
    IMarkProgressiveConfig {
  /**
   *  系列类型
   */
  type: 'bar';
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.bar]?: IMarkSpec<IRectMarkSpec>;
  /** 标签配置*/
  [SeriesMarkNameEnum.label]?: ILabelSpec & {
    /** 标签位置 */
    position?:
      | 'outside'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'inside'
      | 'inside-top'
      | 'inside-bottom'
      | 'inside-right'
      | 'inside-left';
  };
  /**
   * 柱体宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   */
  barWidth?: number | string;
  /**
   * 柱体最小宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   */
  barMinWidth?: number | string;
  /**
   * 柱体最大宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   */
  barMaxWidth?: number | string;
  /**
   * 分组柱图中各个分组内的柱子间距，可以设置绝对的像素值，也可以使用百分比（如 '10%'）。
   * 当存在多层分组时，可以使用数组来设置不同层级的间距，如 [10, '20%']，表示第一层分组的间距为 10px，第二层分组的间距为 '20%'。
   * 如果 barGapInGroup 的数组个数小于分组层数，则后面的分组间距使用最后一个值。
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为对应最后一个分组字段对应的 scale 的 bandWidth 占比(因为柱子是等宽的，所以采用最后一层分组的 scale)
   * @since 1.2.0
   */
  barGapInGroup?: MaybeArray<number | string>;
}

export interface IBarSeriesTheme extends ICartesianSeriesTheme {
  [SeriesMarkNameEnum.bar]?: Partial<IMarkTheme<IRectMarkSpec>>;
  /**
   * 柱体宽度
   */
  barWidth?: number;
  /**
   * 柱体最小宽度
   */
  barMinWidth?: number;
  /**
   * 柱体最大宽度
   */
  barMaxWidth?: number;
}

export type IBar3dSeriesSpec = {
  type: 'bar3d';
} & Omit<IBarSeriesSpec, 'type'> &
  ICartesianSeriesSpec &
  IAnimationSpec<BarMarks, BarAppearPreset>;

export interface IBar3dSeriesTheme extends ICartesianSeriesTheme {
  [SeriesMarkNameEnum.bar3d]?: Partial<IMarkTheme<IRect3dMarkSpec>>;
}
