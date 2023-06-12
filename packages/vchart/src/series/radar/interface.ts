import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IAreaMarkSpec, ILineMarkSpec, ISymbolMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IRoseLikeSeriesSpec, IRoseLikeSeriesTheme } from '../polar/rose-like';
import type { RadarAppearPreset } from './animation';

type RadarMarks = 'point' | 'line' | 'area';

export interface IRadarSeriesSpec
  extends IRoseLikeSeriesSpec,
    IAnimationSpec<RadarMarks, RadarAppearPreset>,
    IMarkProgressiveConfig {
  type: 'radar';

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

export interface IRadarSeriesTheme extends IRoseLikeSeriesTheme, ILineLikeSeriesTheme {
  [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
