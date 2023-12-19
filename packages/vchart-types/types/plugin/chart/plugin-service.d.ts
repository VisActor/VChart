import type { IChartPlugin, IChartPluginService } from './interface';
import type { IVChart } from '../../core';
import { BasePluginService } from '../base/base-plugin-service';
import type { VChartRenderActionSource } from '../../core/interface';
export declare class ChartPluginService<T extends IChartPlugin = IChartPlugin> extends BasePluginService<T> implements IChartPluginService<T> {
    globalInstance: IVChart;
    constructor(globalInstance: IVChart);
    onInit(chartSpec: any): void;
    onBeforeResize(width: number, height: number): void;
    onAfterChartSpecTransform(chartSpec: any, actionSource: VChartRenderActionSource): void;
    onBeforeInitChart(chartSpec: any, actionSource: VChartRenderActionSource): void;
}
