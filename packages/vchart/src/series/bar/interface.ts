import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IRect3dMarkSpec, IRectMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { BarAppearPreset } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface';

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
   * 2. string 类型，百分比用法，如 '10%'，该值为每个柱子的宽度（即每个分组的总宽度减去 barGapInGroup 后的宽度处于组内个数）的占比
   */
  barWidth?: number | string;
  /**
   * 柱体最小宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为每个柱子的宽度（即每个分组的总宽度减去 barGapInGroup 后的宽度处于组内个数）的占比
   */
  barMinWidth?: number | string;
  /**
   * 柱体最大宽度，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为每个柱子的宽度（即每个分组的总宽度减去 barGapInGroup 后的宽度处于组内个数）的占比
   */
  barMaxWidth?: number | string;
  /**
   * 分组柱图中各个分组内的柱子间距，可以设置绝对的像素值，也可以使用百分比（如 '10%'）
   * 1. number 类型，表示像素值
   * 2. string 类型，百分比用法，如 '10%'，该值为每个分组的总宽度占比
   * @since 1.2.0
   */
  barGapInGroup?: number | string;
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
