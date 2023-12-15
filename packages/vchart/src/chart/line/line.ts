import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { ILineChartSpec } from './interface';
import { registerLineSeries } from '../../series/line/line';
import { Factory } from '../../core/factory';

export class LineChartSpecTransformer<T extends ILineChartSpec> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      line: spec.line,
      seriesMark: spec.seriesMark ?? 'line',
      activePoint: spec.activePoint,
      sampling: spec.sampling,
      samplingFactor: spec.samplingFactor,
      pointDis: spec.pointDis,
      pointDisMul: spec.pointDisMul,
      markOverlap: spec.markOverlap,
      lineLabel: spec.lineLabel
    };
  }
  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export class LineChart<T extends ILineChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.line;
  static readonly seriesType: string = SeriesTypeEnum.line;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = LineChartSpecTransformer;
  readonly transformerConstructor = LineChartSpecTransformer;
  readonly type: string = ChartTypeEnum.line;
  readonly seriesType: string = SeriesTypeEnum.line;

  protected _canStack: boolean = true;
}

export const registerLineChart = () => {
  registerLineSeries();
  Factory.registerChart(LineChart.type, LineChart);
};
