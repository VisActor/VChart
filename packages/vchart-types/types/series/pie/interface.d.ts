import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IArcMarkSpec, ITextMarkSpec, IArc3dMarkSpec, ILineMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../polar/interface';
import type { PieAppearPreset } from './animation/animation';
import type { ILabelSpec, IMultiLabelSpec } from '../../component/label';
export type PieMarks = 'pie' | 'label' | 'labelLine';
export type IBasePieSeriesSpec = Omit<IPieSeriesSpec, 'type'> & {
    type: string;
};
export interface IPieSeriesSpec extends IPolarSeriesSpec, IAnimationSpec<PieMarks, PieAppearPreset> {
    type: 'pie';
    categoryField: string;
    valueField: string;
    centerX?: number;
    centerY?: number;
    centerOffset?: number;
    radius?: number;
    outerRadius?: number;
    innerRadius?: number;
    cornerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    padAngle?: number;
    minAngle?: number;
    [SeriesMarkNameEnum.pie]?: IMarkSpec<IArcMarkSpec>;
    [SeriesMarkNameEnum.label]?: IMultiLabelSpec<IArcLabelSpec>;
    emptyPlaceholder?: {
        showEmptyCircle?: boolean;
        emptyCircle?: IMarkSpec<IArcMarkSpec>;
    };
}
export interface IPieSeriesTheme extends IPolarSeriesTheme {
    [SeriesMarkNameEnum.pie]?: Partial<IMarkTheme<IArcMarkSpec>>;
    [SeriesMarkNameEnum.label]?: IArcLabelSpec;
    innerLabel?: IArcLabelSpec;
    outerLabel?: IArcLabelSpec;
    emptyCircle?: Partial<IMarkTheme<IArcMarkSpec>>;
}
export type IPie3dSeriesSpec = {
    type: 'pie3d';
    angle3d?: number;
} & Omit<IPieSeriesSpec, 'type'>;
export interface IPie3dSeriesTheme extends IPolarSeriesTheme {
    [SeriesMarkNameEnum.pie3d]?: Partial<IMarkTheme<IArc3dMarkSpec>>;
    [SeriesMarkNameEnum.label]?: IArcLabelSpec;
    innerLabel?: IArcLabelSpec;
    outerLabel?: IArcLabelSpec;
}
export interface IArcLabelLineSpec extends IMarkSpec<ILineMarkSpec> {
    visible?: boolean;
    line1MinLength?: number;
    line2MinLength?: number;
    smooth?: boolean;
}
export type ArcLabelAlignType = 'arc' | 'labelLine' | 'edge';
export type ArcLabelStrategyType = 'priority' | 'vertical' | 'none';
export interface IArcLabelLayoutSpec {
    textAlign?: ArcLabelAlignType;
    align?: ArcLabelAlignType;
    strategy?: ArcLabelStrategyType;
    tangentConstraint?: boolean;
}
export type IArcLabelSpec = Omit<ILabelSpec, 'position'> & {
    position?: 'outside' | 'inside';
    showRule?: 'all' | 'max' | 'min' | 'minAndMax' | 'headAndTail';
    coverEnable?: boolean;
    rotate?: boolean;
    spaceWidth?: number;
    layoutArcGap?: number;
    centerOffset?: number;
    style?: ITextMarkSpec;
    line?: IArcLabelLineSpec;
    layout?: IArcLabelLayoutSpec;
};
