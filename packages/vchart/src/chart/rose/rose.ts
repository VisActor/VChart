import { RoseSeries } from './../../series/rose/rose';
import type { IPolarAxis } from '../../component/axis/polar/interface';
import { POLAR_DEFAULT_RADIUS } from '../../constant';
import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { RoseLikeChart } from '../polar/rose-like';
import { VChart } from '../../core/vchart';
import { array, mergeSpec } from '../../util';
VChart.useSeries([RoseSeries]);

export class RoseChart extends RoseLikeChart {
  static readonly type: string = ChartTypeEnum.rose;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.rose;
  readonly seriesType: string = SeriesTypeEnum.rose;

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      radius: spec.radius ?? POLAR_DEFAULT_RADIUS,
      outerRadius: spec.outerRadius ?? POLAR_DEFAULT_RADIUS,
      innerRadius: spec.innerRadius ?? 0,
      seriesField: spec.seriesField,
      stack: spec.stack,
      percent: spec.percent
      // startAngle: radians(spec.startAngle || 0),
    };
  }

  transformSpec(spec: any) {
    super.transformSpec(spec);
    //默认不显示轴
    (spec.axes ?? []).forEach((axis: IPolarAxis) => {
      ['domainLine', 'grid', 'label', 'tick'].forEach(configName => {
        if (!axis[configName]) {
          axis[configName] = { visible: false };
        }
      });
    });

    // set default config for crosshair
    spec.crosshair = array(spec.crosshair || {}).map(crosshairCfg => {
      return mergeSpec(
        {
          categoryField: {
            visible: true,
            line: {
              visible: true,
              type: 'rect'
            }
          }
        },
        crosshairCfg
      );
    });
  }
}
