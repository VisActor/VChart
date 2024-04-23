import { array } from '../../util';
import { RoseLikeChartSpecTransformer } from '../polar';
import type { IRoseChartSpec } from '../rose';
import { mergeSpec } from '@visactor/vutils-extension';

export class RadarChartSpecTransformer<
  T extends IRoseChartSpec = IRoseChartSpec
> extends RoseLikeChartSpecTransformer<T> {
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
