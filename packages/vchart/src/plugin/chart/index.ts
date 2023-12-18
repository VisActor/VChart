import { Factory } from '../../core';
import type { IChartPluginConstructor } from './interface';

export * from './media-query';

export const registerChartPlugin = (plugin: IChartPluginConstructor) => {
  Factory.registerChartPlugin(plugin.Name, plugin);
};
