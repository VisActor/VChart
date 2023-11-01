import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, ILineMarkSpec, IAreaMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IAnimationSpec } from '../../animation/spec';
import type { AreaAppearPreset } from './animation';
import type { IMarkProgressiveConfig } from '../../mark/interface';
export interface IAreaSeriesSpec extends ICartesianSeriesSpec, IAnimationSpec<string, AreaAppearPreset>, IMarkProgressiveConfig {
    type: 'area';
    xField: string | string[];
    yField: string | string[];
    [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
    [SeriesMarkNameEnum.area]?: IMarkSpec<IAreaMarkSpec>;
    seriesMark?: 'point' | 'line' | 'area';
    activePoint?: boolean;
}
export interface IAreaSeriesTheme extends ICartesianSeriesTheme, ILineLikeSeriesTheme {
    [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
