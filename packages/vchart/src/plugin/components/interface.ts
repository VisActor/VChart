import type { IComponent } from '../../component/interface';
import type { IBasePlugin, IBasePluginService, MaybePromise } from '../base/interface';

interface IContext {
  skipLayout: boolean;
}

export type IComponentPlugin<T extends IComponentPluginService = any> = IBasePlugin<T>;

export interface IComponentPluginConstructor {
  readonly pluginType: 'component';
  readonly specKey?: string;
  readonly type: string;
  new (): IComponentPlugin;
}

export interface IComponentPluginService<T extends IComponentPlugin = any> extends IBasePluginService<T> {
  component: IComponent;
}
