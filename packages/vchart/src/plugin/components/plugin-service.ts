import type { IComponentPlugin, IComponentPluginService } from './interface';
import { createID } from '../../util/id';
import { warn } from '../../util/debug';
import type { IComponent } from '../../component/interface';

export class ComponentPluginService implements IComponentPluginService {
  private plugins: IComponentPlugin[];
  readonly id: number = createID();
  component: IComponent;

  constructor(component: IComponent) {
    this.plugins = [];
    this.component = component;
  }

  add(plugins: IComponentPlugin[]): IComponentPlugin[] | null {
    if (!plugins || plugins.length === 0) {
      return null;
    }
    const unloadedPlugins: IComponentPlugin[] = [];
    plugins.forEach(plugin => {
      const isExist = this.plugins.find(p => p.id === plugin.id);
      if (isExist) {
        warn('不要重复添加相同的plugin');
        return;
      }
      this.plugins.push(plugin);
      unloadedPlugins.push(plugin);
    });

    return unloadedPlugins;
  }

  load(plugins: IComponentPlugin[]): void {
    const unloadedPlugins = this.add(plugins);
    if (!unloadedPlugins || !unloadedPlugins.length) {
      return;
    }

    this.activate(plugins);
  }

  activate(plugins: IComponentPlugin[]): void {
    if (!plugins.length) {
      return;
    }

    plugins.forEach(plugin => {
      plugin.init && plugin.init();
    });
  }

  get(id: number): IComponentPlugin | undefined {
    return this.plugins.find(p => p.id === id);
  }

  getAll(): IComponentPlugin[] {
    return this.plugins.slice();
  }

  dispose(pluginsId: number): void {
    const plugin = this.plugins.find(p => p.id === pluginsId);
    if (!plugin) {
      return;
    }
    plugin.dispose && plugin.dispose(this);
  }

  disposeAll(): void {
    this.plugins.forEach(plugin => {
      plugin.dispose && plugin.dispose(this);
    });
  }
}
