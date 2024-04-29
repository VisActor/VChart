import { merge, isValid } from '@visactor/vutils';
import { IComponentSpec } from '../../dsl-interface';
import { RoleChart } from './../role';
import { IChartRoleRuntime } from './interface';
import { ChartSpecMatch } from './utils';

export class ComponentSpecRuntime implements IChartRoleRuntime {
  type = 'ComponentSpec';

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
    const componentSpec = options.componentSpec;
    componentSpec?.forEach(cSpec => {
      if (cSpec.specKey === 'axes') {
        this._mergeAxesSpec(rawSpec, cSpec);
      }
    });
  }

  protected _mergeAxesSpec(rawSpec: any, componentSpec: IComponentSpec) {
    if (!rawSpec.axes) {
      rawSpec.axes = [{ ...componentSpec }];
      return;
    } else {
      const s = rawSpec.axes.find((a: any, index: number) => {
        if (ChartSpecMatch(a, index, componentSpec.matchInfo)) {
          return true;
        } else {
          return a.orient === componentSpec.matchInfo.orient;
        }
      });
      if (s) {
        merge(s, componentSpec.spec);
      } else {
        rawSpec.axes.push(componentSpec.spec);
      }
    }
  }

  afterInitializeChart() {
    //
  }
  afterVRenderDraw() {}
}
