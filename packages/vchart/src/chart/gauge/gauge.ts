import { isNil } from '@visactor/vutils';
import type { IPolarAxisSpec, IPolarLinearAxisSpec } from '../../component/axis/polar/interface';
import { type IGaugeSeriesSpec, registerGaugePointerSeries, registerGaugeSeries } from '../../series/gauge';
import type { ISeries } from '../../series/interface';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ICircularProgressSeriesSpec } from '../../series/progress/circular/interface';
import { ChartTypeEnum } from '../interface';
import { ProgressLikeChart } from '../polar/progress-like';
import { Factory } from '../../core/factory';
import { LayoutZIndex } from '../../constant';

export class GaugeChart extends ProgressLikeChart {
  static readonly type: string = ChartTypeEnum.gauge;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.gauge;
  readonly seriesType: string = SeriesTypeEnum.gaugePointer;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series = super._getDefaultSeriesSpec(spec);
    return {
      ...series,
      radiusField: spec.radiusField,

      pin: spec.pin,
      pinBackground: spec.pinBackground,
      pointer: spec.pointer
    };
  }

  protected _getDefaultCircularProgressSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      type: SeriesTypeEnum.circularProgress
    };
    return series;
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);

    /** 充当仪表图非指针部分的系列 */
    let backgroundSeries: ICircularProgressSeriesSpec | IGaugeSeriesSpec = spec.series?.find(
      (series: ISeries) => series.type === SeriesTypeEnum.gauge || series.type === SeriesTypeEnum.circularProgress
    );
    if (isNil(backgroundSeries)) {
      backgroundSeries = spec.gauge ?? this._getDefaultCircularProgressSeriesSpec(spec);

      // 补充可能缺失的属性
      if (backgroundSeries.type === 'circularProgress') {
        if (isNil(backgroundSeries.radiusField) && isNil(backgroundSeries.categoryField)) {
          backgroundSeries.radiusField = spec.radiusField ?? spec.categoryField ?? spec.seriesField;
        }
        if (isNil(backgroundSeries.valueField) && isNil(backgroundSeries.angleField)) {
          backgroundSeries.valueField = spec.valueField ?? spec.angleField;
        }
      }

      if (spec.series.length === 1) {
        spec.series.push(backgroundSeries);
      } else {
        spec.series.forEach((s: ISeries) => {
          if (s.type !== backgroundSeries.type) {
            return;
          }
          Object.keys(backgroundSeries).forEach(k => {
            if (!(k in s)) {
              s[k] = backgroundSeries[k];
            }
          });
        });
      }
    }

    if (backgroundSeries.type === SeriesTypeEnum.circularProgress) {
      this._transformProgressAxisSpec(
        spec,
        {
          orient: 'angle',
          visible: true,
          domainLine: {
            visible: false
          },
          grid: {
            visible: false
          }
        },
        {
          orient: 'radius',
          visible: false
        },
        {
          zIndex: LayoutZIndex.Region + 50 // 仪表图特例：轴在 region 上层
        }
      );
    } else {
      this._transformGaugeAxisSpec(spec);
    }
  }

  protected _transformGaugeAxisSpec(spec: any): void {
    if (!spec.axes) {
      spec.axes = [];
    }
    const axesPtr: {
      radius: IPolarLinearAxisSpec | null;
      angle: IPolarLinearAxisSpec | null;
    } = { radius: null, angle: null };
    (spec.axes ?? []).forEach((axis: IPolarAxisSpec) => {
      const { orient } = axis;
      if (orient === 'radius') {
        axesPtr.radius = axis;
      }
      if (orient === 'angle') {
        axesPtr.angle = axis;
      }
    });
    if (!axesPtr.angle) {
      axesPtr.angle = {
        orient: 'angle',
        visible: true
      };
      spec.axes.push(axesPtr.angle);
    }
    if (!axesPtr.radius) {
      axesPtr.radius = {
        orient: 'radius',
        visible: false
      };
      spec.axes.push(axesPtr.radius);
    }

    // 自动补充缺失的配置
    if (isNil(axesPtr.angle.type)) {
      axesPtr.angle.type = 'linear';
    }
    if (isNil(axesPtr.radius.type)) {
      axesPtr.radius.type = 'linear';
    }
    if (isNil(axesPtr.angle.zIndex)) {
      axesPtr.angle.zIndex = LayoutZIndex.Region + 50; // 仪表图特例：轴在 region 上层
    }
  }
}

export const registerGaugeChart = () => {
  registerGaugePointerSeries();
  registerGaugeSeries();
  Factory.registerChart(GaugeChart.type, GaugeChart);
};
