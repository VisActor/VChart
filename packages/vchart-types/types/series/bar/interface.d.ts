import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IRect3dMarkSpec, IRectMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { BarAppearPreset } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
type BarMarks = 'bar';
export interface IBarSeriesSpec extends ICartesianSeriesSpec, IAnimationSpec<BarMarks, BarAppearPreset>, IMarkProgressiveConfig {
    type: 'bar';
    xField: string | string[];
    yField: string | string[];
    [SeriesMarkNameEnum.bar]?: IMarkSpec<IRectMarkSpec>;
    [SeriesMarkNameEnum.barBackground]?: IMarkSpec<IRectMarkSpec>;
    [SeriesMarkNameEnum.label]?: ILabelSpec & {
        position?: 'outside' | 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'inside-top' | 'inside-bottom' | 'inside-right' | 'inside-left';
    };
    barWidth?: number | string;
    barMinWidth?: number | string;
    barMaxWidth?: number | string;
    barGapInGroup?: number | string | (number | string)[];
    barMinHeight?: number;
}
export interface IBarSeriesTheme extends ICartesianSeriesTheme {
    [SeriesMarkNameEnum.bar]?: Partial<IMarkTheme<IRectMarkSpec>>;
    [SeriesMarkNameEnum.barBackground]?: IMarkSpec<IRectMarkSpec>;
    barWidth?: number;
    barMinWidth?: number;
    barMaxWidth?: number;
}
export type IBar3dSeriesSpec = {
    type: 'bar3d';
} & Omit<IBarSeriesSpec, 'type'> & ICartesianSeriesSpec & IAnimationSpec<BarMarks, BarAppearPreset>;
export interface IBar3dSeriesTheme extends ICartesianSeriesTheme {
    [SeriesMarkNameEnum.bar3d]?: Partial<IMarkTheme<IRect3dMarkSpec>>;
}
export {};
