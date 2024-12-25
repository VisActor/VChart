import type { InteractionSpec, IView } from '@visactor/vgrammar-core';
import type { CompilerListenerParameters, ICompiler, ICompilerModel, IGrammarItem, IRenderContainer, IRenderOption } from './interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventSourceType } from '../event/interface';
import type { IChart } from '../chart/interface';
import type { IColor, IStage } from '@visactor/vrender-core';
import type { IMorphConfig } from '../animation/spec';
import type { IVChart } from '../core/interface';
type EventListener = {
    type: string;
    callback: (...args: any[]) => void;
};
export declare class Compiler implements ICompiler {
    protected _view: IView;
    getVGrammarView(): IView;
    protected _viewListeners: Map<(...args: any[]) => any, EventListener>;
    protected _windowListeners: Map<(...args: any[]) => any, EventListener>;
    protected _canvasListeners: Map<(...args: any[]) => any, EventListener>;
    isInited: boolean;
    private _nextRafId;
    protected _width: number;
    protected _height: number;
    protected _container: IRenderContainer;
    protected _option: IRenderOption;
    private _released;
    protected _model: ICompilerModel;
    protected _interactions: (InteractionSpec & {
        seriesId?: number;
        regionId?: number;
    })[];
    getModel(): ICompilerModel;
    private _compileChart;
    constructor(container: IRenderContainer, option: IRenderOption);
    getRenderer(): import("@visactor/vgrammar-core").IRenderer;
    getCanvas(): HTMLCanvasElement | undefined;
    getStage(): IStage | undefined;
    initView(): void;
    protected handleStageRender: () => void;
    private _setCanvasStyle;
    protected compileInteractions(): void;
    compile(ctx: {
        chart: IChart;
        vChart: IVChart;
    }, option: any): void;
    protected clearNextRender(): boolean;
    clear(ctx: {
        chart: IChart;
        vChart: IVChart;
    }, removeGraphicItems?: boolean): void;
    renderNextTick(morphConfig?: IMorphConfig): void;
    render(morphConfig?: IMorphConfig): void;
    updateViewBox(viewBox: IBoundsLike, reRender?: boolean): void;
    resize(width: number, height: number, reRender?: boolean): void;
    setBackground(color: IColor): void;
    setSize(width: number, height: number): void;
    setViewBox(viewBox: IBoundsLike, reRender?: boolean): void;
    addEventListener(source: EventSourceType, type: string, callback: (params: CompilerListenerParameters) => void): void;
    removeEventListener(source: EventSourceType, type: string, callback: (params: CompilerListenerParameters) => void): void;
    protected releaseEvent(): void;
    release(): void;
    releaseGrammar(removeGraphicItems?: boolean): void;
    protected _releaseModel(): void;
    addGrammarItem(grammarItem: IGrammarItem): void;
    removeGrammarItem(grammarItem: IGrammarItem, reserveVGrammarModel?: boolean): void;
    addInteraction(interaction: InteractionSpec & {
        seriesId?: number;
        regionId?: number;
    }): void;
    removeInteraction(seriesId: number): void;
    updateDepend(items?: IGrammarItem[]): boolean;
    private _getGlobalThis;
}
export {};
