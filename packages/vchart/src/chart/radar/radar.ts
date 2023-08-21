import { SeriesTypeEnum } from '../../series/interface';
import { array, merge } from '../../util';
import { ChartTypeEnum } from '../interface';
import { RoseLikeChart } from '../polar/rose-like';
import { VChart } from '../../core/vchart';
import { RadarSeries } from '../../series';
VChart.useSeries([RadarSeries]);

export class RadarChart extends RoseLikeChart {
  static readonly type: string = ChartTypeEnum.radar;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.radar;
  readonly seriesType: string = SeriesTypeEnum.radar;

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      seriesField: spec.seriesField,
      invalidType: spec.invalidType || 'break',
      line: spec.line,
      point: spec.point,
      stack: spec.stack,
      percent: spec.percent,
      area: merge(
        {
          visible: false
        },
        spec.area
      ),
      seriesMark: spec.seriesMark ?? 'area',
      activePoint: spec.activePoint
    };
  }

  transformSpec(spec: any) {
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
      return merge(
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
