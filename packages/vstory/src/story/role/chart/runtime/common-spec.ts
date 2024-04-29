import { merge } from '@visactor/vutils';
import { RoleChart } from './../role';
import { IChartRoleRuntime } from './interface';

export class CommonSpecRuntime implements IChartRoleRuntime {
  type = 'CommonSpec';

  protected declare _role: RoleChart;

  constructor(role: RoleChart) {
    this._role = role;
  }

  onSpecReady() {
    const rawSpec = this._role.specProcess.getVisSpec();
    const options = this._role.specProcess.getRoleSpec().options;
    if (!options) {
      return;
    }
    merge(rawSpec, { color: options.color, theme: options.theme, padding: options.padding });
  }

  afterInitializeChart() {
    //
  }
  afterVRenderDraw() {}
}
