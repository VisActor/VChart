import type { IMarkSpec } from '../../typings/spec/common';
import type { ICartesianSeriesSpec } from '../cartesian/interface';
import type { ISymbolMarkSpec, ILineMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import type { ILineLikeLabelSpec, ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { IDataSamping, IMarkOverlap, IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILabelSpec } from '../../component';
type LineMarks = 'point' | 'line';
export interface ILineSeriesSpec extends ICartesianSeriesSpec, IAnimationSpec<LineMarks, LineAppearPreset>, IMarkProgressiveConfig, IDataSamping, IMarkOverlap {
    type: 'line';
    xField?: string | string[];
    yField?: string | string[];
    [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
    [SeriesMarkNameEnum.label]?: ILineLikeLabelSpec;
    [SeriesMarkNameEnum.lineLabel]?: Omit<ILabelSpec, 'position'> & {
        position?: 'start' | 'end';
    };
    seriesMark?: 'line' | 'point';
    activePoint?: boolean;
}
export type ILineSeriesTheme = ILineLikeSeriesTheme;
export {};
