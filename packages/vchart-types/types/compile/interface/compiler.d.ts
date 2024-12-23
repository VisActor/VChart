import type { Hooks } from '@visactor/vgrammar-core';
import type { IColor, IStageParams, IStage, ILayer } from '@visactor/vrender-core';
import type { RenderMode } from '../../typings/spec/common';
import type { IBoundsLike } from '@visactor/vutils';
import type { StringOrNumber } from '../../typings';
export interface IRenderContainer {
    dom?: HTMLElement | 'none';
    canvas?: HTMLCanvasElement | string;
}
export type IOptimizeType = {
    skipRenderWithOutRange?: boolean;
    disableCheckGraphicWidthOutRange?: boolean;
};
export interface GestureConfig {
    press?: {
        time?: number;
        threshold?: number;
    };
    swipe?: {
        threshold?: number;
        velocity?: number;
    };
    tap?: {
        interval?: number;
    };
}
export interface IRenderOption {
    mode?: RenderMode;
    gestureConfig?: GestureConfig;
    modeParams?: {
        tooltipCanvasId?: StringOrNumber;
        [key: string]: any;
    } | unknown;
    autoRefreshDpr?: boolean;
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
    optimize?: IOptimizeType;
    enableHtmlAttribute?: boolean;
    supportsTouchEvents?: boolean;
    supportsPointerEvents?: boolean;
    ReactDOM?: any;
    clickInterval?: number;
    autoPreventDefault?: boolean;
    performanceHook?: Hooks;
}
