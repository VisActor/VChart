import { registerAreaSeries } from '../../series/area/area';
import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import type { IAreaChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { Factory } from '../../core/factory';
import { registerSampleTransform, registerMarkOverlapTransform } from '@visactor/vgrammar-core';

export class AreaChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.area;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.area;
  readonly seriesType: string = SeriesTypeEnum.area;
  protected _canStack: boolean = true;

  protected _getDefaultSeriesSpec(spec: IAreaChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      line: spec.line,
      area: spec.area,
      seriesMark: spec.seriesMark ?? 'area',
      activePoint: spec.activePoint,
      sampling: spec.sampling,
      samplingFactor: spec.samplingFactor,
      pointDis: spec.pointDis,
      pointDisMul: spec.pointDisMul,
      markOverlap: spec.markOverlap
    };
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export const registerAreaChart = () => {
  registerAreaSeries();
  registerSampleTransform();
  registerMarkOverlapTransform();
  Factory.registerChart(AreaChart.type, AreaChart);
};
