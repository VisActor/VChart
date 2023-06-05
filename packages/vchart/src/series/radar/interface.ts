import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IAreaMarkSpec, ILineMarkSpec, ISymbolMarkSpec } from '../../typings/visual';
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
  point?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 线图元配置
   */
  line?: IMarkSpec<ILineMarkSpec>;
  /**
   * 面积图元配置
   */
  area?: IMarkSpec<IAreaMarkSpec>;
}

export interface IRadarSeriesTheme extends IRoseLikeSeriesTheme, ILineLikeSeriesTheme {
  strokeOpacity: number;
  area?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
