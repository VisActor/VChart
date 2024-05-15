import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IBoxPlotChartSpec } from './interface';
import { registerBoxplotSeries } from '../../series/box-plot/box-plot';
import { Factory } from '../../core/factory';
import { BoxPlotChartSpecTransformer } from './box-plot-transformer';
import { BaseChart } from '../base';

export class BoxPlotChart<T extends IBoxPlotChartSpec = IBoxPlotChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.boxPlot;
  static readonly seriesType: string = SeriesTypeEnum.boxPlot;
  static readonly transformerConstructor = BoxPlotChartSpecTransformer;
  readonly transformerConstructor = BoxPlotChartSpecTransformer;
  readonly type: string = ChartTypeEnum.boxPlot;
  readonly seriesType: string = SeriesTypeEnum.boxPlot;
}

export const registerBoxplotChart = () => {
  registerBoxplotSeries();
  Factory.registerChart(BoxPlotChart.type, BoxPlotChart);
};
