import type { IChartPlugin, IChartPluginService } from './interface';
import { BasePlugin } from '../base/base-plugin';

export class BaseChartPlugin<T extends IChartPluginService = IChartPluginService>
  extends BasePlugin<T>
  implements IChartPlugin<T>
{
  static Name: string;
  static type: 'chartPlugin' = 'chartPlugin';

  constructor(name: string = BaseChartPlugin.Name) {
    super(name);
  }
}
