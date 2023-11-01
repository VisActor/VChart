import { registerSunBurstSeries } from './../../series/sunburst/sunburst';
import { isValid, radianToDegree } from '@visactor/vutils';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ISunburstSeriesSpec } from '../../series/sunburst/interface';
import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import type { ISunburstChartSpec } from './interface';
import { POLAR_START_ANGLE } from '../../constant';
import { Factory } from '../../core/factory';

export class SunburstChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.sunburst;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.sunburst;
  readonly seriesType: string = SeriesTypeEnum.sunburst;

  protected getDefaultSeriesSpec(spec: ISunburstChartSpec) {
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

  transformSpec(spec: ISunburstChartSpec): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this.getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach(s => {
        if (!this.isValidSeries(s.type)) {
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

export const registerSunburstChart = () => {
  registerSunBurstSeries();
  Factory.registerChart(SunburstChart.type, SunburstChart);
};
