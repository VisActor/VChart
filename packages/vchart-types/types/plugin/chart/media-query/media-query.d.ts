import type { IMediaInfo, IMediaQueryCheckResult, IMediaQuerySpec, IMediaQueryOption, IMediaQueryItem, IMediaQueryActionResult } from './interface';
import type { IChartPlugin, IChartPluginService } from '../interface';
import type { VChartRenderActionSource } from '../../../core/interface';
import { BasePlugin } from '../../base/base-plugin';
export declare class MediaQuery extends BasePlugin implements IChartPlugin {
    static readonly pluginType: 'chart';
    static readonly specKey = "media";
    static readonly type: string;
    readonly type: string;
    protected _spec: IMediaQuerySpec;
    protected _option: IMediaQueryOption;
    protected _baseChartSpec: any;
    protected _currentMediaInfo: Partial<IMediaInfo>;
    readonly currentActiveItems: Set<IMediaQueryItem>;
    protected _initialized: boolean;
    constructor();
    onInit(service: IChartPluginService, chartSpec: any): void;
    onBeforeResize(service: IChartPluginService, width: number, height: number): void;
    onAfterChartSpecTransform(service: IChartPluginService, chartSpec: any, actionSource: VChartRenderActionSource): void;
    onBeforeInitChart(service: IChartPluginService, chartSpec: any, actionSource: VChartRenderActionSource): void;
    changeSize(width: number, height: number, compile?: boolean, render?: boolean): boolean;
    protected _applyQueries(compile?: boolean, render?: boolean): boolean;
    check(item: IMediaQueryItem): IMediaQueryCheckResult;
    apply(item: IMediaQueryItem, chartSpec: any): IMediaQueryActionResult;
    reInit(compile?: boolean, render?: boolean): void;
    dispose(): void;
}
export declare const registerMediaQuery: () => void;
