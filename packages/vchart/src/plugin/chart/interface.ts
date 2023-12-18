import type { IChartSpecInfo } from '../../chart/interface';
import type { IVChart } from '../../core';
import type { VChartRenderActionSource } from '../../core/interface';
import type { IBasePlugin, IBasePluginService, MaybePromise } from '../base/interface';

export interface IChartPlugin<T extends IChartPluginService = any> extends IBasePlugin<T> {
  specKey?: string;
  onInit?: (service: T, chartSpec: any) => MaybePromise<void>;
  onBeforeResize?: (service: T, width: number, height: number) => MaybePromise<void>;
  onAfterChartSpecTransform?: (
    service: T,
    chartSpec: any,
    actionSource: VChartRenderActionSource
  ) => MaybePromise<void>;
  onAfterModelSpecTransform?: (
    service: T,
    chartSpec: any,
    chartSpecInfo: IChartSpecInfo,
    actionSource: VChartRenderActionSource
  ) => MaybePromise<void>;
  onBeforeInitChart?: (service: T, chartSpec: any, actionSource: VChartRenderActionSource) => MaybePromise<void>;
}

export interface IChartPluginConstructor {
  readonly type: 'chartPlugin';
  readonly specKey?: string;
  readonly Name: string;
  new (): IChartPlugin;
}

export interface IChartPluginService<T extends IChartPlugin = any> extends IBasePluginService<T> {
  globalInstance: IVChart;
  onInit?: (chartSpec: any) => MaybePromise<void>;
  onBeforeResize?: (width: number, height: number) => MaybePromise<void>;
  onAfterChartSpecTransform?: (chartSpec: any, actionSource: VChartRenderActionSource) => MaybePromise<void>;
  onAfterModelSpecTransform?: (
    chartSpec: any,
    chartSpecInfo: IChartSpecInfo,
    actionSource: VChartRenderActionSource
  ) => MaybePromise<void>;
  onBeforeInitChart?: (chartSpec: any, actionSource: VChartRenderActionSource) => MaybePromise<void>;
}
