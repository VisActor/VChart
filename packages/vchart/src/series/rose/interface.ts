import type { IAnimationSpec } from '../../animation/spec';
import type { ThemeType } from '../../theme';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec';
import type { IArcMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface';
import type { IRoseLikeSeriesSpec, IRoseLikeSeriesTheme } from '../polar/rose-like';
import type { RoseAppearPreset } from './animation';

export type RoseMarks = 'rose';

export interface IRoseSeriesSpec extends IRoseLikeSeriesSpec, IAnimationSpec<RoseMarks, RoseAppearPreset> {
  type: 'rose';
  /**
   * 分类字段
   */
  categoryField: string | string[];
  /**
   * 数值字段
   */
  valueField: string | string[];
  /** 扇区样式 */
  [SeriesMarkNameEnum.rose]?: IMarkSpec<IArcMarkSpec>;
}

export interface IRoseSeriesTheme extends IRoseLikeSeriesTheme, ThemeType<IRoseSeriesSpec> {
  [SeriesMarkNameEnum.rose]?: Partial<IMarkTheme<IArcMarkSpec>>;
}
