import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkOverlap, IMarkProgressiveConfig } from '../../mark/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IAreaMarkSpec, ILineMarkSpec, ISymbolMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILineLikeLabelSpec, ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IRoseLikeSeriesSpec, IRoseLikeSeriesTheme } from '../polar/rose-like';
import type { RadarAppearPreset } from './animation';
type RadarMarks = 'point' | 'line' | 'area';
export interface IRadarSeriesSpec extends IRoseLikeSeriesSpec, IAnimationSpec<RadarMarks, RadarAppearPreset>, IMarkProgressiveConfig, IMarkOverlap {
    type: 'radar';
    [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
    [SeriesMarkNameEnum.area]?: IMarkSpec<IAreaMarkSpec>;
    [SeriesMarkNameEnum.label]?: ILineLikeLabelSpec;
    seriesMark?: 'point' | 'line' | 'area';
    activePoint?: boolean;
}
export interface IRadarSeriesTheme extends IRoseLikeSeriesTheme, ILineLikeSeriesTheme {
    [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
export {};
