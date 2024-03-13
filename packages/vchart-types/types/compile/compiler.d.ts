import type { InteractionSpec, IView } from '@visactor/vgrammar-core';
import type { CompilerListenerParameters, CompilerModel, IGrammarItem, IRenderContainer, IRenderOption } from './interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventSourceType } from '../event/interface';
import type { IChart } from '../chart/interface';
import { VChart } from '../core/vchart';
import type { IColor, Stage } from '@visactor/vrender-core';
import type { IMorphConfig } from '../animation/spec';
type EventListener = {
    type: string;
    callback: (...args: any[]) => void;
};
export declare class Compiler {
    protected _view: IView;
    getVGrammarView(): IView;
    protected _viewListeners: Map<(...args: any[]) => any, EventListener>;
    protected _windowListeners: Map<(...args: any[]) => any, EventListener>;
    protected _canvasListeners: Map<(...args: any[]) => any, EventListener>;
    isInited: boolean;
    private _isRunning;
    private _nextRafId;
    protected _width: number;
    protected _height: number;
    protected _container: IRenderContainer;
    protected _option: IRenderOption;
    protected _model: CompilerModel;
    protected _interactions: (InteractionSpec & {
        seriesId?: number;
        regionId?: number;
    })[];
    getModel(): CompilerModel;
    private _compileChart;
    constructor(container: IRenderContainer, option: IRenderOption);
    getRenderer(): import("@visactor/vgrammar-core").IRenderer;
    getCanvas(): HTMLCanvasElement | undefined;
    getStage(): Stage | undefined;
    initView(): void;
    handleStageRender: () => void;
    private _setCanvasStyle;
    compileInteractions(): void;
    compile(ctx: {
        chart: IChart;
        vChart: VChart;
    }, option: any): void;
    clear(ctx: {
        chart: IChart;
        vChart: VChart;
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
