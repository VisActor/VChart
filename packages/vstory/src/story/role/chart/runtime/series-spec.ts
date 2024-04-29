import { merge } from '@visactor/vutils';
import { RoleChart } from './../role';
import { IChartRoleRuntime } from './interface';
import { ChartSpecMatch } from './utils';

export class SeriesSpecRuntime implements IChartRoleRuntime {
  type = 'SeriesSpec';

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
    // 如果原始spec没有series，并且seriesSpec只有一项
    if (!rawSpec.series && options.seriesSpec?.length === 1) {
      merge(rawSpec, options.seriesSpec[0].spec);
      return;
    }
    options.seriesSpec.forEach(seriesSpec => {
      if (!rawSpec.series) {
        rawSpec.series = [{ ...seriesSpec.spec }];
        return;
      } else {
        const s = rawSpec.series.find((a: any, index: number) => {
          return ChartSpecMatch(a, index, seriesSpec.matchInfo);
        });
        if (s) {
          merge(s, seriesSpec.spec);
        } else {
          rawSpec.series.push({ ...seriesSpec.spec });
        }
      }
    });
  }

  afterInitializeChart() {
    //
  }
  afterVRenderDraw() {}
}
