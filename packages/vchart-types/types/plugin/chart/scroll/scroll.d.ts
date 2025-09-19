import type { IGroup } from '@visactor/vrender-core';
import { BasePlugin } from '../../base/base-plugin';
import type { IChartPluginService } from '../interface';
import type { IScrollPlugin } from './interface';
export declare class ScrollPlugin extends BasePlugin implements IScrollPlugin {
    static readonly pluginType: 'chart';
    static readonly type: string;
    readonly type: string;
    private _service;
    private _spec;
    private _scrollLimit;
    private _xScrollComponent;
    private _yScrollComponent;
    constructor();
    onInit(service: IChartPluginService, chartSpec: any): void;
    onLayoutRectUpdate(service: IChartPluginService): void;
    onAfterRender(): void;
    release(): void;
    protected _bindEvent(service: IChartPluginService): void;
    protected getRootMark(): IGroup;
    protected onWheel: (e: WheelEvent) => void;
    private _updateScrollY;
    private _getYScrollComponent;
    private _updateScrollX;
    private _getXScrollComponent;
}
export declare const registerScrollPlugin: () => void;
