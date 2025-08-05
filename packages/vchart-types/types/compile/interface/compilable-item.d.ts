import type { StringOrNumber } from '../../typings';
import type { IColor, IGroup, IStage } from '@visactor/vrender-core';
import type { IChart } from '../../chart/interface/chart';
import type { IVChart, IVChartRenderOption } from '../../core/interface';
import type { IMorphConfig } from '../../animation/spec';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventSourceType, EventType } from '../../event/interface';
import type { IMark, IMarkGraphic } from '../../mark/interface';
import type { LayoutState } from '../interface/compiler';
export type CompilerListenerParameters = {
    type: EventType;
    event: Event;
    source: EventSourceType;
    item: IMarkGraphic | null;
    datum: any | null;
    markId: number | null;
    modelId: number | null;
    markUserId: StringOrNumber | null;
    modelUserId: StringOrNumber | null;
};
export interface IProductMap<T extends IGrammarItem> {
    [productId: string]: IGrammarItemMap<T>;
}
export interface IGrammarItemMap<T extends IGrammarItem> {
    [id: number]: T;
}
export type ICompilerModel = Record<GrammarType, IProductMap<IGrammarItem>>;
export interface ICompiler {
    isInited?: boolean;
    getCanvas: () => HTMLCanvasElement | undefined;
    getStage: () => IStage | undefined;
    compile: (ctx: {
        chart: IChart;
        vChart: IVChart;
    }, option?: IVChartRenderOption) => void;
    clear: (ctx: {
        chart: IChart;
        vChart: IVChart;
    }, removeGraphicItems?: boolean) => void;
    renderNextTick: (morphConfig?: IMorphConfig) => void;
    render: (morphConfig?: IMorphConfig) => void;
    updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => void;
    resize: (width: number, height: number, reRender?: boolean) => void;
    setBackground: (color: IColor) => void;
    setSize: (width: number, height: number) => void;
    setViewBox: (viewBox: IBoundsLike, reRender?: boolean) => void;
    addEventListener: (source: EventSourceType, type: string, callback: (params: CompilerListenerParameters) => void) => void;
    removeEventListener: (source: EventSourceType, type: string, callback: (params: CompilerListenerParameters) => void) => void;
    release: () => void;
    releaseGrammar: (removeGraphicItems: boolean) => void;
    addRootMark: (mark: IMark) => any;
    removeRootMark: (mark: IMark) => any;
    getRootMarks: () => IMark[];
    updateLayoutTag: () => void;
    getLayoutState: () => LayoutState;
    getRootGroup: () => IGroup;
}
export interface ICompilable {
    getCompiler: () => ICompiler;
    getStage: () => IStage;
    compile: () => void;
    compileMarks?: (group?: IGroup) => void;
    compileData?: () => void;
    clear?: () => void;
    afterCompile?: () => void;
    release: () => void;
}
export interface ICompilableInitOption {
    getCompiler: () => ICompiler;
}
export declare enum GrammarType {
    data = "data",
    mark = "mark"
}
export interface ITransformSpec {
    type: string;
    [key: string]: any;
}
export interface IGrammarItem extends ICompilable {
    id: number;
    generateProductId: () => string;
    getProductId: () => string;
    removeProduct: () => void;
    setTransform: (transform: ITransformSpec[]) => void;
}
export type GrammarItemInitOption = ICompilableInitOption;
export type GrammarItemCompileOption = Record<string, any>;
export type StateValueMap = Record<string, unknown>;
