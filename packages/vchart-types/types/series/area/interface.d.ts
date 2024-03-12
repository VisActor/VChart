import type { ICartesianSeriesSpec } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, ILineMarkSpec, IAreaMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILineLikeLabelSpec, ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IAnimationSpec } from '../../animation/spec';
import type { AreaAppearPreset } from './animation';
import type { IDataSamping, IMarkOverlap, IMarkProgressiveConfig } from '../../mark/interface';
import type { ILabelSpec } from '../../component';
import { IMultiLabelSpec } from '../../component/label';
export interface IAreaSeriesSpec extends ICartesianSeriesSpec, IAnimationSpec<string, AreaAppearPreset>, IMarkProgressiveConfig, IDataSamping, IMarkOverlap {
    type: 'area';
    xField?: string | string[];
    yField?: string | string[];
    [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
    [SeriesMarkNameEnum.area]?: IMarkSpec<IAreaMarkSpec>;
    [SeriesMarkNameEnum.label]?: IMultiLabelSpec<ILineLikeLabelSpec>;
    [SeriesMarkNameEnum.areaLabel]?: Omit<ILabelSpec, 'position'> & {
        position?: 'start' | 'end';
    };
    seriesMark?: 'point' | 'line' | 'area';
    activePoint?: boolean;
}
export interface IAreaSeriesTheme extends ILineLikeSeriesTheme {
    [SeriesMarkNameEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
}
