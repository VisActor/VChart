import type { CompilerListenerParameters, ICompiler, IRenderContainer, IRenderOption } from './interface';
import { LayoutState } from './interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventSourceType } from '../event/interface';
import type { IChart } from '../chart/interface';
import type { IColor, IGroup, IStage } from '@visactor/vrender-core';
import type { IMorphConfig } from '../animation/spec';
import type { IVChart, IVChartRenderOption } from '../core/interface';
import { type IMark } from '../mark/interface';
import type { Gesture } from '@visactor/vrender-kits';
type EventListener = {
    type: string;
    callback: (...args: any[]) => void;
};
export declare class Compiler implements ICompiler {
    private _count;
    private _cachedMarks;
    private _progressiveMarks?;
    private _progressiveRafId?;
    protected _rootMarks: IMark[];
    protected _stage: IStage;
    protected _rootGroup: IGroup;
    getRootGroup(): IGroup;
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
    private _layoutState?;
    private _compileChart;
    constructor(container: IRenderContainer, option: IRenderOption);
    getChart(): IChart;
    getCanvas(): HTMLCanvasElement | undefined;
    _gestureController?: Gesture;
    getStage(): IStage | undefined;
    initView(): void;
    getLayoutState(): LayoutState;
    updateLayoutTag(): void;
    protected handleLayoutEnd: () => void;
    protected handleStageRender: () => void;
    private _setCanvasStyle;
    compile(ctx: {
        chart: IChart;
        vChart: IVChart;
    }, option?: IVChartRenderOption): void;
    protected clearNextRender(): boolean;
    clear(ctx: {
        chart: IChart;
        vChart: IVChart;
    }): void;
    renderNextTick(morphConfig?: IMorphConfig): void;
    protected _commitedAll(): boolean;
    protected _hasCommitedMark(): boolean;
    private _handleAfterNextRender;
    private _doRender;
    renderMarks(): void;
    reuseOrMorphing(morphConfig?: IMorphConfig): void;
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
    addRootMark(mark: IMark): void;
    getRootMarks(): IMark[];
    removeRootMark(mark: IMark): boolean;
    private _getGlobalThis;
    private _combineIncrementalLayers;
    private findProgressiveMarks;
    private doPreProgressive;
    private handleProgressiveFrame;
    private clearProgressive;
}
export {};
