import type { IGroupMark, IGrammarBase, IView, IRenderer, InteractionSpec } from '@visactor/vgrammar-core';
import type { Maybe, IPerformanceHook, StringOrNumber } from '../../typings';
import type { IColor, IStage } from '@visactor/vrender-core';
import type { IChart } from '../../chart/interface/chart';
import type { IVChart } from '../../core/interface';
import type { IMorphConfig } from '../../animation/spec';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventSourceType, EventType } from '../../event/interface';
export type CompilerListenerParameters = {
    type: EventType;
    event: Event;
    source: EventSourceType;
    item: any | null;
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
    getVGrammarView: () => IView;
    getModel: () => ICompilerModel;
    getRenderer: () => IRenderer;
    getCanvas: () => HTMLCanvasElement | undefined;
    getStage: () => IStage | undefined;
    compile: (ctx: {
        chart: IChart;
        vChart: IVChart;
    }, option: any) => void;
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
    addGrammarItem: (grammarItem: IGrammarItem) => void;
    removeGrammarItem: (grammarItem: IGrammarItem, reserveVGrammarModel?: boolean) => void;
    addInteraction: (interaction: InteractionSpec & {
        seriesId?: number;
        regionId?: number;
    }) => void;
    removeInteraction: (seriesId: number) => void;
    updateDepend: (items?: IGrammarItem[]) => boolean;
}
export interface ICompilable {
    getCompiler: () => ICompiler;
    getVGrammarView: () => IView;
    compile: () => void;
    compileMarks?: (group?: string | IGroupMark) => void;
    compileData?: () => void;
    compileSignal?: () => void;
    clear?: () => void;
    afterCompile?: () => void;
    release: () => void;
}
export interface ICompilableInitOption {
    getCompiler: () => ICompiler;
    performanceHook?: IPerformanceHook;
}
export declare enum GrammarType {
    data = "data",
    signal = "signal",
    mark = "mark"
}
export interface IGrammarItem extends ICompilable {
    id: number;
    grammarType: GrammarType;
    getProduct: () => Maybe<IGrammarBase>;
    generateProductId: () => string;
    getProductId: () => string;
    removeProduct: (reserveVGrammarModel?: boolean) => void;
    getDepend: () => IGrammarItem[];
    setDepend: (...depend: IGrammarItem[]) => void;
    updateDepend: () => boolean;
}
export type GrammarItemInitOption = ICompilableInitOption;
export type GrammarItemCompileOption = Record<string, any>;
