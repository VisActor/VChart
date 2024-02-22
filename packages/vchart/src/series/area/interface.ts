import type { ICartesianSeriesSpec } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, ILineMarkSpec, IAreaMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILineLikeLabelSpec, ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IAnimationSpec } from '../../animation/spec';
import type { AreaAppearPreset } from './animation';
import type { IDataSamping, IMarkOverlap, IMarkProgressiveConfig } from '../../mark/interface';
import type { ILabelSpec } from '../../component';
import { IMultiLabelSpec } from '../../component/label';
export interface IAreaSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<string, AreaAppearPreset>,
    IMarkProgressiveConfig,
    IDataSamping,
    IMarkOverlap {
  /**
   * 系列类型
   */
  type: 'area';
  /**
   * x轴字段
   */
  xField?: string | string[];
  /**
   * y轴字段
   */
  yField?: string | string[];
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
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<ILineLikeLabelSpec>;
  /**
   * 面积图元标签配置
   * @since 1.7.0
   */
  [SeriesMarkNameEnum.areaLabel]?: Omit<ILabelSpec, 'position'> & {
    position?: 'start' | 'end';
  };
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
}

export interface IAreaSeriesTheme extends ILineLikeSeriesTheme {
  [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
