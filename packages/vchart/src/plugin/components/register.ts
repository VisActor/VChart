import { Factory } from '../../core';
import type { IComponentPluginConstructor } from './interface';

export const registerComponentPlugin = (plugin: IComponentPluginConstructor) => {
  Factory.registerComponentPlugin(plugin.type, plugin);
};
