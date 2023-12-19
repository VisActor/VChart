import { isValid, radianToDegree } from '@visactor/vutils';
import { BaseChartSpecTransformer } from '../base';
import type { ISunburstChartSpec } from './interface';
import { POLAR_START_ANGLE } from '../../constant';
import type { ISunburstSeriesSpec } from '../../series';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series';

export class SunburstChartSpecTransformer<
  T extends ISunburstChartSpec = ISunburstChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T) {
    // 开始角度默认使用用户配置
    const startAngle = isValid(spec.startAngle) ? spec.startAngle : POLAR_START_ANGLE;
    // 结束角度默认使用用户的配置, 若用户没配置, 默认补成整圆.
    const endAngle = isValid(spec.endAngle) ? spec.endAngle : startAngle + radianToDegree(Math.PI * 2);

    const series: ISunburstSeriesSpec = {
      ...super._getDefaultSeriesSpec(spec),
      categoryField: spec.categoryField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,

      centerX: spec.centerX,
      centerY: spec.centerY,
      offsetX: spec.offsetX,
      offsetY: spec.offsetY,

      startAngle: startAngle,
      endAngle: endAngle,

      innerRadius: spec.innerRadius,
      outerRadius: spec.outerRadius,
      gap: spec.gap,
      labelLayout: spec.labelLayout,
      label: spec.label,
      labelAutoVisible: spec.labelAutoVisible,

      drill: spec.drill,
      drillField: spec.drillField
    };

    const seriesType = SeriesTypeEnum.sunburst;
    series.type = seriesType;
    series[seriesType] = spec[seriesType];

    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach(s => {
        if (!this._isValidSeries(s.type)) {
          return;
        }
        Object.keys(defaultSeriesSpec).forEach(k => {
          if (!(k in s)) {
            s[k] = defaultSeriesSpec[k];
          }
        });
      });
    }
  }
}
