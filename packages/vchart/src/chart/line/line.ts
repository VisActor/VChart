import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { ILineChartSpec } from './interface';
import { registerLineSeries } from '../../series/line/line';
import { Factory } from '../../core/factory';
import { registerLttbSampleTransform, registerMarkOverlapTransform } from '@visactor/vgrammar-core';

export class LineChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.line;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.line;
  readonly seriesType: string = SeriesTypeEnum.line;

  protected _getDefaultSeriesSpec(spec: ILineChartSpec): any {
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
      markOverlap: spec.markOverlap
    };
  }
  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export const registerLineChart = () => {
  registerLineSeries();
  registerLttbSampleTransform();
  registerMarkOverlapTransform();
  Factory.registerChart(LineChart.type, LineChart);
};
