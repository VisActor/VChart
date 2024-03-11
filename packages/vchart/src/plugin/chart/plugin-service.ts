import type { IChartPlugin, IChartPluginService } from './interface';
import type { IVChart } from '../../core';
import { BasePluginService } from '../base/base-plugin-service';
import type { VChartRenderActionSource } from '../../core/interface';

export class ChartPluginService<T extends IChartPlugin = IChartPlugin>
  extends BasePluginService<T>
  implements IChartPluginService<T>
{
  globalInstance: IVChart;

  constructor(globalInstance: IVChart) {
    super();
    this.globalInstance = globalInstance;
  }

  onInit(chartSpec: any) {
    this._plugins.forEach(plugin => {
      plugin.onInit && plugin.onInit(this, chartSpec);
    });
  }

  onBeforeResize(width: number, height: number) {
    this._plugins.forEach(plugin => {
      plugin.onBeforeResize && plugin.onBeforeResize(this, width, height);
    });
  }

  onAfterChartSpecTransform(chartSpec: any, actionSource: VChartRenderActionSource) {
    this._plugins.forEach(plugin => {
      plugin.onAfterChartSpecTransform && plugin.onAfterChartSpecTransform(this, chartSpec, actionSource);
    });
  }

  onBeforeInitChart(chartSpec: any, actionSource: VChartRenderActionSource) {
    this._plugins.forEach(plugin => {
      plugin.onBeforeInitChart && plugin.onBeforeInitChart(this, chartSpec, actionSource);
    });
  }

  releaseAll(): void {
    super.releaseAll();
    this.globalInstance = null;
  }
}
