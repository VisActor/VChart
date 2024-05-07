import type { DataSet } from '@visactor/vdataset';
import type { IParserOptions } from '@visactor/vdataset';
import type { Datum, IDataValues, IInitOption, IMarkStateSpec, IPoint, IRegionQuerier, IShowTooltipOption, ISpec, ITooltipHandler, Maybe, MaybeArray, StringOrNumber } from '../typings';
import type { IMorphConfig } from '../animation/spec';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventCallback, EventParams, EventQuery, EventType } from '../event/interface';
import type { IMark } from '../mark/interface';
import type { ISeries } from '../series/interface/series';
import type { ITheme } from '../theme';
import type { IComponent } from '../component/interface';
import type { LayoutCallBack } from '../layout/interface';
import type { Compiler } from '../compile/compiler';
import type { IChart, IChartSpecInfo } from '../chart/interface';
import type { Stage } from '@visactor/vrender-core';
import type { IContainerSize } from '@visactor/vrender-components';
import type { IBaseScale } from '@visactor/vscale';
export type DataLinkSeries = {
    seriesId?: StringOrNumber;
    seriesIndex?: number;
};
export type DataLinkAxis = {
    axisId?: StringOrNumber;
    axisIndex?: number;
};
export interface IVChartConstructor {
    new (spec: ISpec, options: IInitOption): IVChart;
    useRegisters: (comps: (() => void)[]) => any;
}
export interface IVChart {
    readonly id: number;
    renderSync: (morphConfig?: IMorphConfig, resetMediaQuery?: boolean) => IVChart;
    renderAsync: (morphConfig?: IMorphConfig, resetMediaQuery?: boolean) => Promise<IVChart>;
    updateData: (id: StringOrNumber, data: Datum[] | string, options?: IParserOptions) => Promise<IVChart>;
    updateDataInBatches: (list: {
        id: string;
        data: Datum[];
        options?: IParserOptions;
    }[]) => Promise<IVChart>;
    updateDataSync: (id: StringOrNumber, data: Datum[], options?: IParserOptions) => IVChart;
    updateFullDataSync: (data: IDataValues | IDataValues[], reRender?: boolean) => IVChart;
    updateSpec: (spec: ISpec, forceMerge?: boolean, morphConfig?: IMorphConfig, resetMediaQuery?: boolean) => Promise<IVChart>;
    updateSpecSync: (spec: ISpec, forceMerge?: boolean, morphConfig?: IMorphConfig, resetMediaQuery?: boolean) => void;
    updateModelSpecSync: (filter: string | {
        type: string;
        index: number;
    }, spec: unknown, forceMerge?: boolean, morphConfig?: IMorphConfig) => IVChart;
    updateModelSpec: (filter: string | {
        type: string;
        index: number;
    }, spec: unknown, forceMerge?: boolean, morphConfig?: IMorphConfig) => Promise<IVChart>;
    updateSpecAndRecompile: (spec: ISpec, forceMerge: boolean, option: IVChartRenderOption) => boolean;
    updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => IVChart;
    resize: (width: number, height: number) => Promise<IVChart>;
    release: () => void;
    on: ((eType: EventType, handler: EventCallback<EventParams>) => void) & ((eType: EventType, query: EventQuery, handler: EventCallback<EventParams>) => void);
    off: (eType: EventType, handler?: EventCallback<EventParams>) => void;
    updateState: (state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>, filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean) => void;
    setSelected: (datum: MaybeArray<any> | null, filter?: (series: ISeries, mark: IMark) => boolean, region?: IRegionQuerier) => void;
    setHovered: (datum: MaybeArray<Datum> | null, filter?: (series: ISeries, mark: IMark) => boolean, region?: IRegionQuerier) => void;
    getCurrentTheme: () => ITheme;
    getCurrentThemeName: () => string;
    setCurrentTheme: (name: string) => Promise<IVChart>;
    setTooltipHandler: (tooltipHandler: ITooltipHandler) => void;
    getTooltipHandlerByUser: () => ITooltipHandler | undefined;
    getTooltipHandler: () => ITooltipHandler | undefined;
    showTooltip: (datum: Datum, options: IShowTooltipOption) => boolean;
    hideTooltip: () => boolean;
    getLegendDataById: (id: string) => Datum[];
    getLegendDataByIndex: (index?: number) => Datum[];
    getLegendSelectedDataById: (id: string) => StringOrNumber[];
    getLegendSelectedDataByIndex: (index?: number) => StringOrNumber[];
    setLegendSelectedDataById: (id: string, selectedData: StringOrNumber[]) => void;
    setLegendSelectedDataByIndex: (index: number, selectedData: StringOrNumber[]) => void;
    getDataURL: () => Promise<any>;
    exportImg: (name?: string) => Promise<void>;
    exportCanvas: () => HTMLCanvasElement | undefined;
    getImageBuffer: () => void;
    setLayout: (layout: LayoutCallBack) => void;
    reLayout: () => void;
    getCompiler: () => Compiler;
    getChart: () => Maybe<IChart>;
    getStage: () => Stage;
    getCanvas: () => HTMLCanvasElement | undefined;
    getContainer: () => Maybe<HTMLElement>;
    getComponents: () => IComponent[];
    getDataSet: () => Maybe<DataSet>;
    getScale: (scaleId: string) => IBaseScale | null;
    convertDatumToPosition: (datum: Datum, dataLinkInfo?: DataLinkSeries, isRelativeToCanvas?: boolean, checkInViewData?: boolean) => IPoint | null;
    convertValueToPosition: ((value: StringOrNumber, dataLinkInfo: DataLinkAxis, isRelativeToCanvas?: boolean) => number | null) & ((value: [StringOrNumber, StringOrNumber], dataLinkInfo: DataLinkSeries, isRelativeToCanvas?: boolean) => IPoint | null);
    stopAnimation: () => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    registerFunction: (key: string, fun: Function) => void;
    unregisterFunction: (key: string) => void;
    getFunction: (key: string) => Function | null;
    getFunctionList: () => string[] | null;
    getSpecInfo: () => IChartSpecInfo;
    setRuntimeSpec: (spec: any) => void;
    getSpec: () => any;
    getCurrentSize: () => IContainerSize;
}
export interface IGlobalConfig {
    uniqueTooltip?: boolean;
}
export interface IVChartRenderOption {
    morphConfig?: IMorphConfig;
    transformSpec?: boolean;
    actionSource?: VChartRenderActionSource;
}
export type VChartRenderActionSource = 'render' | 'updateSpec' | 'updateModelSpec' | 'setCurrentTheme' | 'updateSpecAndRecompile';
