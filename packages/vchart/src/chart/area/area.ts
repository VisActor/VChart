import { registerAreaSeries } from '../../series/area/area';
import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import type { IAreaChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { Factory } from '../../core/factory';

export class AreaChartSpecTransformer<
  T extends IAreaChartSpec = IAreaChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
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
      markOverlap: spec.markOverlap,
      areaLabel: spec.areaLabel
    };
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export class AreaChart<T extends IAreaChartSpec = IAreaChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.area;
  static readonly seriesType: string = SeriesTypeEnum.area;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = AreaChartSpecTransformer;
  readonly transformerConstructor = AreaChartSpecTransformer;
  readonly type: string = ChartTypeEnum.area;
  readonly seriesType: string = SeriesTypeEnum.area;
  protected _canStack: boolean = true;
}

export const registerAreaChart = () => {
  registerAreaSeries();
  Factory.registerChart(AreaChart.type, AreaChart);
};
