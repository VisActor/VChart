import type { IGroup, IRectGraphicAttribute } from '@visactor/vrender-core';
import { BasePlugin } from '../../base/base-plugin';
import type { IChartPluginService } from '../interface';
import type { IScrollPlugin } from './interface';
export declare class ScrollPlugin extends BasePlugin implements IScrollPlugin {
    static readonly pluginType: 'chart';
    static readonly type: string;
    readonly type: string;
    readonly name: string;
    private _service;
    private _spec;
    private _lastScrollX;
    private _lastScrollY;
    private _scrollLimit;
    private _xScrollComponent;
    private _yScrollComponent;
    private _event;
    constructor();
    onInit(service: IChartPluginService, chartSpec: any): void;
    onLayoutRectUpdate(service: IChartPluginService): void;
    onAfterRender(): void;
    release(): void;
    protected _bindEvent(service: IChartPluginService): void;
    protected getRootMark(): IGroup;
    protected onWheel: (e: WheelEvent) => void;
    private _computeFinalScrollY;
    private _computeFinalScrollX;
    private _updateScrollY;
    private _getYScrollComponent;
    private _updateScrollX;
    private _getXScrollComponent;
    scrollTo({ x, y }: {
        x?: number;
        y?: number;
    }): void;
}
export declare const registerScrollPlugin: (theme?: {
    size?: number;
    railStyle?: Omit<IRectGraphicAttribute, 'width' | 'height'>;
    sliderStyle?: Omit<IRectGraphicAttribute, 'width' | 'height'>;
}) => void;
