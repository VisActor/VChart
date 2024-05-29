import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IRect3dMarkSpec, IRectMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { BarAppearPreset } from './animation';
import type { ILabelSpec, IMultiLabelSpec } from '../../component/label';
import type { IDataSamping, IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { Functional } from '@visactor/vrender-components';
type BarMarks = 'bar';
export interface IBarSeriesSpec extends ICartesianSeriesSpec, IAnimationSpec<BarMarks, BarAppearPreset>, IMarkProgressiveConfig, IDataSamping {
    type: 'bar';
    xField?: string | string[];
    yField?: string | string[];
    [SeriesMarkNameEnum.bar]?: IMarkSpec<IRectMarkSpec>;
    [SeriesMarkNameEnum.barBackground]?: IMarkSpec<IRectMarkSpec> & IBarBackgroundSpec;
    [SeriesMarkNameEnum.label]?: IMultiLabelSpec<Omit<ILabelSpec, 'position'> & {
        position?: Functional<'outside' | 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'inside-top' | 'inside-bottom' | 'inside-right' | 'inside-left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>;
    }>;
    barWidth?: number | string;
    barMinWidth?: number | string;
    barMaxWidth?: number | string;
    barGapInGroup?: number | string | (number | string)[];
    barMinHeight?: number;
    stackCornerRadius?: number | number[];
}
export interface IBarBackgroundSpec {
    fieldLevel?: number;
}
export interface IBarSeriesTheme extends ICartesianSeriesTheme {
    [SeriesMarkNameEnum.bar]?: Partial<IMarkTheme<IRectMarkSpec>>;
    [SeriesMarkNameEnum.barBackground]?: Partial<IMarkTheme<IRectMarkSpec>> & IBarBackgroundSpec;
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
export { };
