import type { IColor, IStageParams, IStage, ILayer } from '@visactor/vrender-core';
import type { EventSourceType, EventType } from '../../event/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { IBoundsLike } from '@visactor/vutils';
import type { GrammarType, IGrammarItem } from './compilable-item';
import type { StringOrNumber } from '../../typings';
export interface IRenderContainer {
    dom?: HTMLElement | 'none';
    canvas?: HTMLCanvasElement | string;
}
export interface IRenderOption {
    mode?: RenderMode;
    modeParams?: {
        tooltipCanvasId?: StringOrNumber;
        [key: string]: any;
    } | unknown;
    dpr?: number;
    interactive?: boolean;
    viewBox?: IBoundsLike;
    canvasControled?: boolean;
    stage?: IStage;
    layer?: ILayer;
    beforeRender?: IStageParams['beforeRender'];
    afterRender?: IStageParams['afterRender'];
    background?: IColor;
    logLevel?: number;
    onError?: (...args: any[]) => void;
    disableDirtyBounds?: boolean;
    enableView3dTransform?: boolean;
    pluginList?: string[];
}
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
export type CompilerModel = Record<GrammarType, IProductMap<IGrammarItem>>;
export interface IProductMap<T extends IGrammarItem> {
    [productId: string]: IGrammarItemMap<T>;
}
export interface IGrammarItemMap<T extends IGrammarItem> {
    [id: number]: T;
}
