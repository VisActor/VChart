import { array, isValid, isNil } from '@visactor/vutils';
import type { IIndicatorSpec } from '../../component/indicator/interface';
import type { ISeries } from '../../series/interface';
import { BaseChart } from '../base-chart';
import type { IDataZoomSpec } from '../../component/data-zoom';
import { IFilterMode } from '../../component/data-zoom/interface';

export class PolarChart extends BaseChart {
  readonly seriesType: string;

  protected isValidSeries(type: string): boolean {
    return this.seriesType ? type === this.seriesType : true;
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),

      /**
       * 旧的radius写法, 仅做兼容
       * @deprecated use outerRadius instead
       */
      radius: spec.radius,
      outerRadius: spec.outerRadius,
      innerRadius: spec.innerRadius,

      startAngle: spec.startAngle,
      endAngle: spec.endAngle
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }

  protected getIndicatorSpec(spec: any): IIndicatorSpec[] {
    const indicatorSpec = array(spec.indicator) as IIndicatorSpec[];
    const limitRatio = spec.innerRadius ?? spec.series?.[0]?.innerRadius;
    if (isValid(limitRatio)) {
      indicatorSpec.forEach(indicator => {
        if (isNil(indicator.limitRatio)) {
          indicator.limitRatio = limitRatio;
        }
      });
    }
    return indicatorSpec;
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    /** 处理极坐标系下的 datazoom */
    if (spec.dataZoom && spec.dataZoom.length > 0) {
      spec.dataZoom.forEach((zoom: IDataZoomSpec) => {
        // 极坐标系下 datazoom 目前只支持数据过滤
        // 理想效果：角度轴不支持 axis， 径向轴均支持（通过 group.clip 自定义 clipPath 支持）
        if (zoom.filterMode === 'axis') {
          zoom.filterMode = IFilterMode.filter;
        }
      });
    }
    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeries) => {
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

    /* 处理 indicator 配置 */
    if (isValid(spec.indicator)) {
      spec.indicator = this.getIndicatorSpec(spec);
    }
  }
}
