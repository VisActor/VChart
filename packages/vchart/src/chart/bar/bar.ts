import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IBarChartSpec } from './interface';
import { Factory } from '../../core/factory';

export class BarChartSpecTransformer<T extends IBarChartSpec = IBarChartSpec> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: spec.barWidth,
      barMaxWidth: spec.barMaxWidth,
      barMinWidth: spec.barMinWidth,
      barGapInGroup: spec.barGapInGroup,
      barMinHeight: spec.barMinHeight,
      sampling: spec.sampling,
      samplingFactor: spec.samplingFactor,
      barBackground: spec.barBackground
    };
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
export class BarChart<T extends IBarChartSpec = IBarChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.bar;
  static readonly seriesType: string = SeriesTypeEnum.bar;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = BarChartSpecTransformer;
  readonly transformerConstructor = BarChartSpecTransformer;
  readonly type: string = ChartTypeEnum.bar;
  readonly seriesType: string = SeriesTypeEnum.bar;
  protected _canStack: boolean = true;
}

export const registerBarChart = () => {
  registerBarSeries();
  Factory.registerChart(BarChart.type, BarChart);
};
