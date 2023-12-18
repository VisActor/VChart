import type { IComponentPlugin, IComponentPluginService } from './interface';
import { BasePlugin } from '../base/base-plugin';

export class BaseComponentPlugin<T extends IComponentPluginService = IComponentPluginService>
  extends BasePlugin<T>
  implements IComponentPlugin<T>
{
  Name: string;

  constructor(name: string = BaseComponentPlugin.Name) {
    super(name);
  }
}
