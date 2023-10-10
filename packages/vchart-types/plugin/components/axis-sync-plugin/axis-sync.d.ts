import { BasicComponentPlugin } from '../basic-plugin';
import type { IComponentPlugin, IComponentPluginService } from '../interface';
import type { CartesianAxis, ILinearAxisSync } from '../../../component/axis/cartesian';
export declare class AxisSyncPlugin extends BasicComponentPlugin implements IComponentPlugin {
  Name: string;
  constructor();
  protected _checkEnableSync(axis: CartesianAxis): ILinearAxisSync | false;
  private _getTargetAxis;
  onInit(service: IComponentPluginService, axis: CartesianAxis): void;
  onDidCompile(service: IComponentPluginService, axis: CartesianAxis): void;
}
