import type { PopTipAttributes } from '@visactor/vrender-components';
import type { DataView } from '@visactor/vdataset';
import type { Cursor } from './cursor';
import type { InterpolateType } from './interpolate';
import type { ScaleType } from './scale';
import type { ShapeType } from './shape';
import type { IPoint } from './coordinate';
import type { IAttributeOpt, IModelMarkAttributeContext } from '../compile/mark';
import type { Datum, StringOrNumber } from './common';
import type { IPadding } from '@visactor/vutils';
import type { IColorKey } from '../theme/color-scheme/interface';
import type { IRepeatType, TextAlignType, TextBaselineType } from '@visactor/vrender-core';
import type { IRichTextCharacter } from '@visactor/vrender-core';
export interface IVisualSpecBase<D, T> {
    type: ScaleType;
    domain: D[];
    range: T[];
    specified?: {
        [key: string]: unknown;
    };
}
export interface IVisualSpecStyle<D, T> extends IVisualSpecBase<D, T> {
    field?: string;
}
export type IDataDomainSpec = {
    dataId: string;
    fields: string[];
};
export interface IVisualSpecScale<D, T> extends Omit<IVisualSpecBase<D, T>, 'domain'> {
    id: string;
    domain: IVisualSpecBase<D, T>['domain'] | IDataDomainSpec[];
}
export type IVisual<D = any, R = any> = IVisualSpecStyle<D, R> | IVisualScale;
export interface IVisualScale {
    scale: string;
    field?: string;
    changeDomain?: 'none' | 'replace' | 'expand';
}
export type FunctionType<T> = (datum: Datum, context: IModelMarkAttributeContext, opt?: IAttributeOpt, source?: DataView) => T;
export type ValueType<T> = T;
export type VisualType<T> = ValueType<T> | FunctionType<T> | IVisual<unknown, T>;
export type TextureType = 'circle' | 'dimond' | 'rect' | 'vertical-line' | 'horizontal-line' | 'bias-lr' | 'bias-rl' | 'grid';
export type ConvertToMarkStyleSpec<T extends Record<string, any>> = {
    [key in keyof T]: VisualType<T[key]>;
};
export interface IBorder {
    distance: number | string;
    stroke?: string | IGradient;
    strokeOpacity?: number;
    lineWidth?: number;
    lineDash?: number[];
    lineDashOffset?: number;
}
export interface ICommonSpec {
    visible?: boolean;
    x?: number;
    y?: number;
    z?: number;
    stroke?: string | IGradient | false | (number | boolean)[] | IColorKey;
    strokeOpacity?: number;
    opacity?: number;
    lineWidth?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    cursor?: Cursor;
    zIndex?: number;
    angle?: number;
    anchor?: [number, number];
    scaleX?: number;
    scaleY?: number;
    scaleCenter?: [number | string, number | string];
    beta?: number;
    alpha?: number;
    anchor3d?: [number, number];
    pickMode?: 'accurate' | 'imprecise' | 'custom';
    boundsMode?: 'accurate' | 'imprecise';
    texture?: TextureType | string;
    textureColor?: string;
    textureSize?: number;
    texturePadding?: number;
    outerBorder?: IBorder;
    innerBorder?: IBorder;
    [key: string]: any;
}
export interface IFillMarkSpec extends ICommonSpec {
    fill?: VisualType<string> | IGradient | false | IColorKey;
    fillOpacity?: number;
    background?: string | HTMLImageElement | HTMLCanvasElement | null;
}
export interface ISymbolMarkSpec extends IFillMarkSpec {
    dx?: number;
    dy?: number;
    size?: number | number[];
    shape?: ShapeType | string;
    symbolType?: ShapeType | string;
    scaleX?: number;
    scaleY?: number;
}
export interface ILineLikeMarkSpec extends IFillMarkSpec {
    curveType?: InterpolateType;
    defined?: boolean;
}
export interface IAreaMarkSpec extends ILineLikeMarkSpec {
    x1?: number;
    y1?: number;
    orient?: 'horizontal' | 'vertical';
}
export interface ILineMarkSpec extends ILineLikeMarkSpec {
    lineCap?: LineStrokeCap;
    lineJoin?: LineStrokeJoin;
    miterLimit?: number;
    strokeBoundsBuffer?: number;
}
export interface IRuleMarkSpec extends ILineMarkSpec {
    x1?: number;
    y1?: number;
}
export interface ITextMarkSpec extends IFillMarkSpec {
    type?: 'html' | 'rich' | 'text';
    text?: StringOrNumber | string[] | IRichTextCharacter[] | Function;
    dx?: number;
    dy?: number;
    fontSize?: number;
    textAlign?: TextAlign;
    textBaseline?: TextBaseLine;
    fontFamily?: string;
    fontWeight?: FontWeight;
    fontStyle?: FontStyle;
    maxLineWidth?: number;
    ellipsis?: string;
    lineBreak?: string;
    underline?: boolean;
    lineThrough?: boolean;
    lineHeight?: number | string;
    poptip?: PopTipAttributes;
    direction?: 'horizontal' | 'vertical';
}
export type IPositionedTextMarkSpec = Omit<ITextMarkSpec, 'align' | 'textAlign' | 'baseline' | 'textBaseline'>;
export interface IRectMarkSpec extends IFillMarkSpec {
    cornerRadius?: number | number[];
    width?: number;
    height?: number;
    x1?: number;
    y1?: number;
}
export interface IRect3dMarkSpec extends IRectMarkSpec {
    length?: number;
}
export interface IBoxPlotMarkSpec extends ICommonSpec {
    lineWidth?: number;
    boxWidth?: number;
    shaftWidth?: number;
    shaftShape?: BoxPlotShaftShape;
    boxFill?: string;
    shaftFillOpacity?: number;
    min?: (datum: Datum) => number;
    q1?: (datum: Datum) => number;
    median?: (datum: Datum) => number;
    q3?: (datum: Datum) => number;
    max?: (datum: Datum) => number;
}
export interface IRippleMarkSpec extends ICommonSpec {
    ripple?: number;
    size?: number;
}
export interface IOutlierMarkSpec {
    fill?: string;
    size?: number;
}
export interface IPathMarkSpec extends IFillMarkSpec {
    path?: string;
    smoothScale?: boolean;
}
export interface ILinkPathMarkSpec extends IFillMarkSpec {
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    thickness?: number;
    curvature?: number;
    round?: boolean;
    ratio?: number;
    align?: 'start' | 'end' | 'center';
    pathType?: 'line' | 'smooth' | 'polyline';
    endArrow?: boolean;
    startArrow?: boolean;
    backgroundStyle?: any;
    direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BL' | 'radial';
}
export interface IArcMarkSpec extends IFillMarkSpec {
    startAngle?: number;
    endAngle?: number;
    padAngle?: number;
    outerRadius?: number;
    innerRadius?: number;
    cornerRadius?: number;
    centerOffset?: number;
    cap?: boolean | [boolean, boolean];
    autoCapConical?: boolean;
}
export interface IArc3dMarkSpec extends IArcMarkSpec {
    height?: number;
}
export interface IProgressArcMarkSpec extends IArcMarkSpec {
    innerPadding?: number;
    outerPadding?: number;
}
export interface ICellMarkSpec extends ISymbolMarkSpec {
    padding?: number | number[] | IPadding;
}
export interface IGroupMarkSpec extends IFillMarkSpec {
    clip?: boolean;
    width?: number;
    height?: number;
    cornerRadius?: number | number[];
}
export interface IPolygonMarkSpec extends ICommonSpec, IFillMarkSpec {
    points?: IPoint[];
    cornerRadius?: number | number[];
    scaleX?: number;
    scaleY?: number;
}
export interface IPyramid3dMarkSpec extends IPolygonMarkSpec {
    points?: IPoint[];
}
export type RepeatType = 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat';
export type RepeatXYType = 'no-repeat' | 'repeat' | 'stretch';
export type ImageOriginType = 'top' | 'bottom';
export type GradientPropValue<T> = ValueType<T> | FunctionType<T>;
export type GradientStop = {
    offset: GradientPropValue<number>;
    color?: GradientPropValue<string>;
    opacity?: number;
};
export interface IGradientLinear {
    x0?: GradientPropValue<number>;
    y0?: GradientPropValue<number>;
    x1?: GradientPropValue<number>;
    y1?: GradientPropValue<number>;
    stops: GradientStop[];
    gradient: 'linear';
}
export interface IGradientRadial {
    r0?: GradientPropValue<number>;
    x0?: GradientPropValue<number>;
    y0?: GradientPropValue<number>;
    x1?: GradientPropValue<number>;
    y1?: GradientPropValue<number>;
    r1?: GradientPropValue<number>;
    stops: GradientStop[];
    gradient: 'radial';
}
export interface IGradientConical {
    x?: GradientPropValue<number>;
    y?: GradientPropValue<number>;
    startAngle?: GradientPropValue<number>;
    endAngle?: GradientPropValue<number>;
    stops: GradientStop[];
    gradient: 'conical';
}
export type GradientType = 'linear' | 'radial' | 'conical';
export type IGradient = IGradientLinear | IGradientRadial | IGradientConical;
export type LineStrokeCap = 'butt' | 'round' | 'square';
export type LineStrokeJoin = 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';
export type BoxPlotShaftShape = 'line' | 'bar';
export interface IThresholdStyle extends IVisualSpecStyle<number, string> {
    domain: number[];
    field: string;
    range: string[];
    type: 'threshold';
}
export interface IUnknownMarkSpec extends ICommonSpec {
    [key: string]: unknown;
}
export interface IImageMarkSpec extends IFillMarkSpec {
    cornerRadius?: number | number[];
    width?: number;
    height?: number;
    repeatX?: IRepeatType;
    repeatY?: IRepeatType;
    image: string | HTMLImageElement | HTMLCanvasElement;
}
export type TextAlign = TextAlignType;
export type TextBaseLine = TextBaselineType;
export type FontStyle = 'normal' | 'italic' | 'oblique' | string;
export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
