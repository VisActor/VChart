import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec';
import type { IArcMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { IRoseLikeSeriesSpec, IRoseLikeSeriesTheme } from '../polar/rose-like';
import type { RoseAppearPreset } from './animation';
import type { IArcLabelSpec } from '../pie/interface';
export type RoseMarks = 'rose';
export interface IRoseSeriesSpec extends IRoseLikeSeriesSpec, IAnimationSpec<RoseMarks, RoseAppearPreset> {
  type: 'rose';
  categoryField: string | string[];
  valueField: string | string[];
  [SeriesMarkNameEnum.rose]?: IMarkSpec<IArcMarkSpec>;
  [SeriesMarkNameEnum.label]?: IArcLabelSpec;
}
export interface IRoseSeriesTheme extends IRoseLikeSeriesTheme {
  [SeriesMarkNameEnum.rose]?: Partial<IMarkTheme<IArcMarkSpec>>;
  [SeriesMarkNameEnum.label]?: IArcLabelSpec;
}
