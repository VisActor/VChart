import type { IFillMarkSpec, IImageMarkSpec } from '../visual';
import type { LayoutCallBack } from '../../layout/interface';
import type { IElement, srIOption3DType } from '@visactor/vgrammar-core';
import type { DataSet, DataView, ISimplifyOptions, IFieldsOptions, IFilterOptions, IFoldOptions, IDsvParserOptions } from '@visactor/vdataset';
import type { RegionSpec } from '../../region/interface';
import type { IHoverSpec, ISelectSpec, IInteractionSpec } from '../../interaction/interface';
import type { IRenderOption } from '../../compile/interface';
import type { ITooltipSpec } from '../../component/tooltip/interface';
import type { ILayoutSpec } from '../../layout/interface';
import type { ConvertToMarkStyleSpec, IArc3dMarkSpec, IArcMarkSpec, IAreaMarkSpec, IBoxPlotMarkSpec, ICommonSpec, IGroupMarkSpec, ILineMarkSpec, ILinkPathMarkSpec, IPathMarkSpec, IPolygonMarkSpec, IPyramid3dMarkSpec, IRect3dMarkSpec, IRectMarkSpec, IRuleMarkSpec, ISymbolMarkSpec, IRippleMarkSpec, ITextMarkSpec, IVisualSpecScale } from '../visual';
import type { StateValue } from '../../compile/mark';
import type { ISeriesStyle, SeriesType } from '../../series/interface';
import type { Datum, StringOrNumber } from '../common';
import type { IInvalidType } from '../data';
import type { IAnimationSpec, IMorphSeriesSpec } from '../../animation/spec';
import type { IPlayer } from '../../component/player';
import type { IMarkProgressiveConfig, MarkTypeEnum } from '../../mark/interface';
import type { IDataZoomSpec, IScrollBarSpec } from '../../component/data-zoom';
import type { ICrosshairSpec } from '../../component/crosshair/interface';
import type { ITheme } from '../../theme';
import type { ITitleSpec } from '../../component/title/interface';
import type { IBrushSpec } from '../../component/brush';
import type { ITotalLabelSpec } from '../../component/label';
import type { ILegendSpec } from '../../component/legend';
import type { ILayoutOrientPadding, ILayoutPaddingSpec } from '../layout';
import type { IColor, ICustomPath2D, IRichTextCharacter } from '@visactor/vrender-core';
import type { ICommonAxisSpec } from '../../component/axis';
import type { IMediaQuerySpec } from '..';
import type { IModelSpec } from '../../model/interface';
export type IChartPadding = ILayoutOrientPadding | number;
export interface IInitOption extends Omit<IRenderOption, 'pluginList'> {
    dom?: string | HTMLElement;
    renderCanvas?: string | HTMLCanvasElement;
    dataSet?: DataSet;
    autoFit?: boolean;
    performanceHook?: IPerformanceHook;
    animation?: boolean;
    options3d?: srIOption3DType;
    layout?: LayoutCallBack;
    poptip?: boolean;
    onError?: (...args: any[]) => void;
    theme?: string | ITheme;
    disableTriggerEvent?: boolean;
}
export declare enum RenderModeEnum {
    'desktop-browser' = "desktop-browser",
    'mobile-browser' = "mobile-browser",
    'node' = "node",
    'worker' = "worker",
    'miniApp' = "miniApp",
    'wx' = "wx",
    'tt' = "tt",
    'harmony' = "harmony",
    'desktop-miniApp' = "desktop-miniApp",
    'lynx' = "lynx"
}
export type RenderMode = keyof typeof RenderModeEnum;
export interface IChartSpec {
    type: string;
    data?: IData;
    width?: number;
    height?: number;
    autoFit?: boolean;
    padding?: ILayoutPaddingSpec;
    color?: string[] | Omit<IVisualSpecScale<unknown, string>, 'id'>;
    series?: ISeriesSpec[];
    seriesStyle?: ISeriesStyle;
    animationThreshold?: number;
    hover?: boolean | IHoverSpec;
    select?: boolean | ISelectSpec;
    region?: RegionSpec[];
    title?: ITitleSpec;
    layout?: ILayoutSpec;
    legends?: ILegendSpec | ILegendSpec[];
    crosshair?: ICrosshairSpec | ICrosshairSpec[];
    tooltip?: ITooltipSpec;
    player?: IPlayer;
    dataZoom?: IDataZoomSpec | IDataZoomSpec[];
    scrollBar?: IScrollBarSpec | IScrollBarSpec[];
    brush?: IBrushSpec;
    scales?: IVisualSpecScale<unknown, unknown>[];
    customMark?: ICustomMarkSpec<EnableMarkType>[];
    axes?: ICommonAxisSpec[];
    theme?: Omit<ITheme, 'name'> | string;
    background?: IBackgroundSpec;
    stackInverse?: boolean;
    stackSort?: boolean;
    media?: IMediaQuerySpec;
}
export type IBackgroundStyleSpec = ConvertToMarkStyleSpec<Omit<IFillMarkSpec, 'width' | 'height' | 'background'>> & {
    image?: IRectMarkSpec['background'];
    cornerRadius?: IRectMarkSpec['cornerRadius'];
};
export type IBackgroundSpec = IColor | IBackgroundStyleSpec;
export type IDataType = IDataValues | DataView;
export type IData = IDataType | IDataType[];
export type DataKeyType = string | string[] | ((data: Datum, index: number) => string);
export type BuildInTransformOptions = {
    type: 'simplify';
    options: ISimplifyOptions;
} | {
    type: 'fields';
    options: IFieldsOptions;
} | {
    type: 'filter';
    options: IFilterOptions;
} | {
    type: 'fold';
    options: IFoldOptions;
};
export interface IFieldsMeta {
    alias?: string;
    domain?: StringOrNumber[];
    lockStatisticsByDomain?: boolean;
    type?: 'ordinal' | 'linear';
    sortIndex?: number;
    sortReverse?: boolean;
}
export interface SheetParseOptions extends CommonParseOptions {
    type: 'csv' | 'dsv' | 'tsv';
    options?: IDsvParserOptions;
}
export interface CommonParseOptions {
    clone?: boolean;
}
export interface IDataValues {
    id?: StringOrNumber;
    values: Datum[] | string;
    fromDataIndex?: number;
    fromDataId?: StringOrNumber;
    transforms?: BuildInTransformOptions[];
    fields?: Record<string, IFieldsMeta>;
    parser?: SheetParseOptions | CommonParseOptions;
}
export type IHierarchyNodeData = {
    value?: number;
    children?: IHierarchyNodeData[];
} & Datum;
export interface IHierarchyDataValues extends Omit<IDataValues, 'values'> {
    values: IHierarchyNodeData;
}
export type IHierarchyData = DataView | IHierarchyDataValues;
export interface ISeriesSpec extends IInteractionSpec {
    type: SeriesType;
    name?: string;
    id?: StringOrNumber;
    data?: IDataType;
    dataIndex?: number;
    dataId?: StringOrNumber;
    dataKey?: DataKeyType;
    regionIndex?: number;
    regionId?: StringOrNumber;
    seriesField?: string;
    seriesStyle?: ISeriesStyle;
    stack?: boolean;
    stackValue?: StringOrNumber;
    totalLabel?: ITotalLabelSpec;
    percent?: boolean;
    stackOffsetSilhouette?: boolean;
    invalidType?: IInvalidType;
    tooltip?: ITooltipSpec;
    animation?: boolean;
    animationThreshold?: number;
    support3d?: boolean;
    morph?: IMorphSeriesSpec;
    extensionMark?: (IExtensionMarkSpec<Exclude<EnableMarkType, 'group'>> | IExtensionGroupMarkSpec)[];
}
export type IChartExtendsSeriesSpec<T extends ISeriesSpec> = Omit<T, 'data' | 'morph' | 'stackValue'>;
export type AdaptiveSpec<T, K extends keyof any> = {
    [key in Exclude<keyof T, K>]: T[key];
} & {
    [key in K]: any;
};
export type IMarkSpec<T extends ICommonSpec = ICommonSpec> = {
    id?: StringOrNumber;
    interactive?: boolean;
    zIndex?: number;
    visible?: boolean;
    style?: ConvertToMarkStyleSpec<T>;
    state?: Record<StateValue, IMarkStateSpec<T> | IMarkStateStyleSpec<T>>;
    stateSort?: (stateA: string, stateB: string) => number;
    support3d?: boolean;
    customShape?: (datum: any[], attrs: any, path: ICustomPath2D) => ICustomPath2D;
} & IMarkProgressiveConfig;
export type IMarkStateFilter = {
    fields: {
        [key in string]: {
            type: 'ordinal' | 'linear';
            domain: StringOrNumber[];
        };
    };
} | {
    datums: Datum[];
    datumKeys: string[];
} | {
    items: IElement[];
} | ((datum: Datum, options: Record<string, any>) => boolean);
export interface IMarkStateSpec<T> {
    filter?: IMarkStateFilter;
    level?: number | undefined;
    style: ConvertToMarkStyleSpec<T>;
}
export type IMarkStateStyleSpec<T> = ConvertToMarkStyleSpec<T>;
export type IMarkTheme<T> = {
    visible?: boolean;
    style?: T;
    state?: Record<StateValue, T>;
    interactive?: boolean;
};
export interface IPerformanceHook {
    beforeInitializeChart?: () => void;
    afterInitializeChart?: () => void;
    beforeCompileToVGrammar?: () => void;
    afterCompileToVGrammar?: () => void;
    beforeRegionCompile?: () => void;
    afterRegionCompile?: () => void;
    beforeSeriesCompile?: () => void;
    afterSeriesCompile?: () => void;
    beforeComponentCompile?: () => void;
    afterComponentCompile?: () => void;
    beforeResizeWithUpdate?: () => void;
    afterResizeWithUpdate?: () => void;
    beforeLayoutWithSceneGraph?: () => void;
    afterLayoutWithSceneGraph?: () => void;
    beforeParseView?: () => void;
    afterParseView?: () => void;
    beforeCreateRuntime?: () => void;
    afterCreateRuntime?: () => void;
    beforeSrViewEvaluateAsync?: () => void;
    afterSrViewEvaluateAsync?: () => void;
    beforeSrViewRunAsync?: () => void;
    afterSrViewRunAsync?: () => void;
    beforeTransform?: (name: string) => void;
    afterTransform?: (name: string) => void;
    beforeCreateVRenderStage?: () => void;
    afterCreateVRenderStage?: () => void;
    beforeCreateVRenderMark?: () => void;
    afterCreateVRenderMark?: () => void;
    beforeVRenderDraw?: () => void;
    afterVRenderDraw?: () => void;
}
export type IBuildinMarkSpec = {
    group: IGroupMarkSpec;
    symbol: ISymbolMarkSpec;
    rule: IRuleMarkSpec;
    line: ILineMarkSpec;
    text: ITextMarkSpec;
    rect: IRectMarkSpec;
    rect3d: IRect3dMarkSpec;
    image: IImageMarkSpec;
    path: IPathMarkSpec;
    area: IAreaMarkSpec;
    arc: IArcMarkSpec;
    arc3d: IArc3dMarkSpec;
    polygon: IPolygonMarkSpec;
    pyramid3d: IPyramid3dMarkSpec;
    boxPlot: IBoxPlotMarkSpec;
    linkPath: ILinkPathMarkSpec;
    ripple: IRippleMarkSpec;
};
export type EnableMarkType = keyof IBuildinMarkSpec;
export interface ICustomMarkSpec<T extends EnableMarkType> extends IModelSpec, IMarkSpec<IBuildinMarkSpec[T]>, IAnimationSpec<string, string> {
    type: T;
    dataIndex?: number;
    dataKey?: string | ((datum: any) => string);
    dataId?: StringOrNumber;
    componentType?: string;
    animation?: boolean;
}
export interface ICustomMarkGroupSpec extends ICustomMarkSpec<MarkTypeEnum.group> {
    children?: ICustomMarkSpec<EnableMarkType>[];
}
export interface IExtensionMarkSpec<T extends Exclude<EnableMarkType, 'group'>> extends ICustomMarkSpec<T> {
    dataIndex?: number;
    dataKey?: string | ((datum: any) => string);
    dataId?: StringOrNumber;
    componentType?: string;
}
export interface IExtensionGroupMarkSpec extends ICustomMarkSpec<MarkTypeEnum.group> {
    children?: ICustomMarkSpec<EnableMarkType>[];
}
export type ITextFormatMethod<T extends any[]> = (...args: T) => ITextMarkSpec['text'] | {
    type: 'text';
    text: ITextMarkSpec['text'];
};
export type IRichTextFormatMethod<T extends any[]> = (...args: T) => {
    type: 'rich';
    text: IRichTextCharacter[];
} | IRichTextCharacter[];
export type IFormatMethod<T extends any[]> = (...args: T) => ReturnType<ITextFormatMethod<T>> | ReturnType<IRichTextFormatMethod<T>>;
