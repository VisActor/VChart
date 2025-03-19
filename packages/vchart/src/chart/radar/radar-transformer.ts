import { array } from '../../util';
import { RoseLikeChartSpecTransformer } from '../polar';
import type { IRoseChartSpec } from '../rose';
import { mergeSpec } from '@visactor/vutils-extension';

export class RadarChartSpecTransformer<
  T extends IRoseChartSpec = IRoseChartSpec
> extends RoseLikeChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: any): any {
    const series = super._getDefaultSeriesSpec(spec);
    series.line = spec.line;
    series.point = spec.point;
    series.stack = spec.stack;
    series.percent = spec.percent;
    series.area = mergeSpec(
      {
        visible: false
      },
      spec.area
    );
    series.seriesMark = spec.seriesMark ?? 'area';
    series.activePoint = spec.activePoint;
    series.pointDis = spec.pointDis;
    series.pointDisMul = spec.pointDisMul;
    series.markOverlap = spec.markOverlap;
    return series;
  }

  transformSpec(spec: T) {
    super.transformSpec(spec);

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
