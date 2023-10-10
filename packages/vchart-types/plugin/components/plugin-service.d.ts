import type { IComponentPlugin, IComponentPluginService } from './interface';
import type { IComponent } from '../../component/interface';
export declare class ComponentPluginService implements IComponentPluginService {
  private plugins;
  readonly id: number;
  component: IComponent;
  constructor(component: IComponent);
  add(plugins: IComponentPlugin[]): IComponentPlugin[] | null;
  load(plugins: IComponentPlugin[]): void;
  activate(plugins: IComponentPlugin[]): void;
  get(id: number): IComponentPlugin | undefined;
  getAll(): IComponentPlugin[];
  dispose(pluginsId: number): void;
  disposeAll(): void;
}
