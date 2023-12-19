import type { ICartesianAxisSpec } from '../../component';
import type { ISeriesSpec } from '../../typings';
import { get, mergeSpec } from '../../util';
import { BaseChartSpecTransformer } from '../base';
import { getTrimPaddingConfig } from '../util';
import type { ICartesianChartSpec } from './interface';

export class CartesianChartSpecTransformer<T extends ICartesianChartSpec> extends BaseChartSpecTransformer<T> {
  protected needAxes(): boolean {
    return true;
  }

  protected _isValidSeries(type: string): boolean {
    return this.seriesType ? type === this.seriesType : true;
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      xField: spec.xField,
      yField: spec.yField,
      zField: spec.zField,
      seriesField: spec.seriesField,
      seriesStyle: spec.seriesStyle,
      direction: spec.direction,
      stack: spec.stack, // 是否堆叠
      percent: spec.percent, // 是否百分比堆叠
      stackOffsetSilhouette: spec.stackOffsetSilhouette, // 是否围绕中心轴偏移轮廓,
      totalLabel: spec.totalLabel,
      sortDataByAxis: spec.sortDataByAxis
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    if (this.needAxes()) {
      if (!spec.axes) {
        spec.axes = [];
      }
      const haxAxes = { x: false, y: false, z: false };
      spec.axes.forEach((axis: ICartesianAxisSpec) => {
        const { orient } = axis;
        if (orient === 'top' || orient === 'bottom') {
          haxAxes.x = true;
        }
        if (orient === 'left' || orient === 'right') {
          haxAxes.y = true;
        }
        if (orient === 'z') {
          haxAxes.z = true;
        }
        if (get(axis, 'trimPadding')) {
          mergeSpec(axis, getTrimPaddingConfig(this.type, spec));
        }
      });
      if (!haxAxes.x) {
        spec.axes.push({
          orient: 'bottom'
        });
      }
      if (!haxAxes.y) {
        spec.axes.push({
          orient: 'left'
        });
      }
      // 如果有zField字段，但是没有配置z轴，那么添加一个z轴
      if ((spec as any).zField && !haxAxes.z) {
        spec.axes.push({
          orient: 'z'
        });
      }
    }

    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);

    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeriesSpec) => {
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
