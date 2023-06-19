import type { IAnimationSpec } from '../../../animation/spec';
import type { IMarkSpec, IMarkTheme } from '../../../typings/spec/common';
import type { IProgressArcMarkSpec } from '../../../typings/visual';
import type { ProgressLikeAppearPreset } from '../../polar/progress-like/animation';
import type { IProgressSeriesSpec } from '../interface';
import type { IProgressLikeSeriesSpec, IProgressLikeSeriesTheme } from '../../polar/progress-like/interface';
import type { SeriesMarkNameEnum } from '../../interface';

export type CircularProgressMarks = 'progress' | 'track';

export interface ICircularProgressSeriesSpec
  extends IProgressSeriesSpec,
    IProgressLikeSeriesSpec,
    IAnimationSpec<CircularProgressMarks, ProgressLikeAppearPreset> {
  type: 'circularProgress';

  /** 分类字段 */
  categoryField?: string | string[];

  radiusField?: string;

  /** 数据最大值，默认为 1 */
  maxValue?: number;

  /** 进度条样式 */
  [SeriesMarkNameEnum.progress]?: IMarkSpec<IProgressArcMarkSpec>;

  /** 背景样式 */
  [SeriesMarkNameEnum.track]?: IMarkSpec<IProgressArcMarkSpec>;
}

export interface ICircularProgressSeriesTheme extends IProgressLikeSeriesTheme {
  [SeriesMarkNameEnum.progress]?: Partial<IMarkTheme<IProgressArcMarkSpec>>;
  [SeriesMarkNameEnum.track]?: Partial<IMarkTheme<IProgressArcMarkSpec>>;
}
