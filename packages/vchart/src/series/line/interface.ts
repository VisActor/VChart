import type { IMarkSpec } from '../../typings/spec/common';
import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { ISymbolMarkSpec, ILineMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { Functional } from '@visactor/vrender-components';

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
  [SeriesMarkNameEnum.label]?: Omit<ILabelSpec, 'position'> & {
    /** 标签位置
     * @since 1.6.0，支持以函数形式配置
     */
    position?: Functional<
      'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
    >;
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
}

export interface ILineSeriesTheme extends Omit<ICartesianSeriesTheme, 'label'>, ILineLikeSeriesTheme {
  label?: Partial<ILineSeriesSpec['label']>;
}
