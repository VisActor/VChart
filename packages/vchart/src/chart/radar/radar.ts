import { registerRadarSeries } from '../../series/radar/radar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { array, mergeSpec } from '../../util';
import { ChartTypeEnum } from '../interface/type';
import { RoseLikeChart } from '../polar/rose-like';
import { Factory } from '../../core/factory';
import type { IRoseChartSpec } from '../rose';

export class RadarChart<T extends IRoseChartSpec = IRoseChartSpec> extends RoseLikeChart<T> {
  static readonly type: string = ChartTypeEnum.radar;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.radar;
  readonly seriesType: string = SeriesTypeEnum.radar;

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      seriesField: spec.seriesField,
      line: spec.line,
      point: spec.point,
      stack: spec.stack,
      percent: spec.percent,
      area: mergeSpec(
        {
          visible: false
        },
        spec.area
      ),
      seriesMark: spec.seriesMark ?? 'area',
      activePoint: spec.activePoint,
      pointDis: spec.pointDis,
      pointDisMul: spec.pointDisMul,
      markOverlap: spec.markOverlap
    };
  }

  transformSpec(spec: T) {
    super.transformSpec(spec);
    //默认不显示轴的domainLine和Tick
    (spec.axes ?? []).forEach((axis: any) => {
      if (axis.orient === 'radius') {
        ['domainLine', 'label', 'tick'].forEach(configName => {
          if (!axis[configName]) {
            axis[configName] = { visible: false };
          }
        });
        if (!axis.grid) {
          axis.grid = { visible: true, smooth: true };
        }
      }
    });

    // set default config for crosshair
    spec.crosshair = array(spec.crosshair || {}).map(crosshairCfg => {
      return mergeSpec(
        {
          categoryField: {
            visible: true,
            line: {
              visible: true,
              type: 'line'
            }
          }
        },
        crosshairCfg
      );
    });
  }
}

export const registerRadarChart = () => {
  registerRadarSeries();
  Factory.registerChart(RadarChart.type, RadarChart);
};
