import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, ILineMarkSpec, IAreaMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IAnimationSpec } from '../../animation/spec';
import type { AreaAppearPreset } from './animation';
import type { IMarkProgressiveConfig } from '../../mark/interface';

export interface IAreaSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<string, AreaAppearPreset>,
    IMarkProgressiveConfig {
  /**
   * 系列类型
   */
  type: 'area';
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
}

export interface IAreaSeriesTheme extends ICartesianSeriesTheme, ILineLikeSeriesTheme {
  [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
