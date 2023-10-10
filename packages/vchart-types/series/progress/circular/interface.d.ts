import type { IAnimationSpec } from '../../../animation/spec';
import type { IMarkSpec, IMarkTheme } from '../../../typings/spec/common';
import type { IProgressArcMarkSpec } from '../../../typings/visual';
import type { ProgressLikeAppearPreset } from '../../polar/progress-like/animation';
import type { IProgressSeriesSpec } from '../interface';
import type { IProgressLikeSeriesSpec, IProgressLikeSeriesTheme } from '../../polar/progress-like/interface';
import type { SeriesMarkNameEnum } from '../../interface/type';
export type CircularProgressMarks = 'progress' | 'track';
export interface ICircularProgressSeriesSpec
  extends IProgressSeriesSpec,
    IProgressLikeSeriesSpec,
    IAnimationSpec<CircularProgressMarks, ProgressLikeAppearPreset> {
  type: 'circularProgress';
  categoryField?: string | string[];
  radiusField?: string;
  maxValue?: number;
  [SeriesMarkNameEnum.progress]?: IMarkSpec<IProgressArcMarkSpec>;
  [SeriesMarkNameEnum.track]?: IMarkSpec<IProgressArcMarkSpec>;
}
export interface ICircularProgressSeriesTheme extends IProgressLikeSeriesTheme {
  [SeriesMarkNameEnum.progress]?: Partial<IMarkTheme<IProgressArcMarkSpec>>;
  [SeriesMarkNameEnum.track]?: Partial<IMarkTheme<IProgressArcMarkSpec>>;
}
