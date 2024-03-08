import type { IMarkTheme, IMarkSpec } from '../../typings';
import type { ILabelSpec, IMultiLabelSpec } from '../../component/label';
import type { ISymbolMarkSpec, IRippleMarkSpec } from '../../typings';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { IPolarSeriesSpec } from '../polar/interface';
import type { IAnimationSpec } from '../../animation/spec';
import type { CorrelationAppearPreset, CorrelationMarks } from './animation';
export interface ICorrelationSeriesSpec extends Omit<IPolarSeriesSpec, 'innerRadius' | 'outerRadius'>, IAnimationSpec<CorrelationMarks, CorrelationAppearPreset> {
    type: 'correlation';
    categoryField: string;
    valueField: string;
    seriesField?: string;
    sizeField?: string;
    sizeRange?: number[];
    centerX?: number;
    centerY?: number;
    innerRadius?: string | number;
    outerRadius?: string | number;
    startAngle?: number;
    endAngle?: number;
    [SeriesMarkNameEnum.centerPoint]?: IMarkSpec<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.ripplePoint]?: IMarkSpec<IRippleMarkSpec>;
    [SeriesMarkNameEnum.centerLabel]?: ILabelSpec & {
        position?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    };
    [SeriesMarkNameEnum.nodePoint]?: IMarkSpec<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.label]?: IMultiLabelSpec<ILabelSpec & {
        position?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    }>;
}
export interface ICorrelationSeriesTheme {
    [SeriesMarkNameEnum.nodePoint]?: IMarkTheme<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.ripplePoint]?: IMarkTheme<IRippleMarkSpec>;
    [SeriesMarkNameEnum.centerPoint]?: IMarkTheme<ISymbolMarkSpec>;
    [SeriesMarkNameEnum.centerLabel]?: ILabelSpec;
    [SeriesMarkNameEnum.label]?: ILabelSpec;
}
