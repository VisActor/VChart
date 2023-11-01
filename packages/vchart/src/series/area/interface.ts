import type { ICartesianSeriesSpec } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, ILineMarkSpec, IAreaMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILineLikeLabelSpec, ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IAnimationSpec } from '../../animation/spec';
import type { AreaAppearPreset } from './animation';
import type { IDataSamping, IMarkOverlap, IMarkProgressiveConfig } from '../../mark/interface';
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
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: ILineLikeLabelSpec;
  /**
   * 系列主 mark 类型配置，该配置会影响图例的展示
   * @default 'area'
   * @since 1.2.0
   */
  seriesMark?: 'point' | 'line' | 'area';
}

export interface IAreaSeriesTheme extends ILineLikeSeriesTheme {
  [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
