import { BaseChart } from '../base/base-chart';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IPictogramChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { PictogramChartSpecTransformer } from './pictogram-transformer';
import { registerPictogramSeries } from '../../series/pictogram/pictogram';

export class PictogramChart<T extends IPictogramChartSpec = IPictogramChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.pictogram;
  static readonly seriesType: string = SeriesTypeEnum.pictogram;
  static readonly transformerConstructor = PictogramChartSpecTransformer;
  readonly transformerConstructor = PictogramChartSpecTransformer;
  readonly type: string = ChartTypeEnum.pictogram;
  readonly seriesType: string = SeriesTypeEnum.pictogram;
}

export const registerPictogramChart = () => {
  registerPictogramSeries();
  Factory.registerChart(PictogramChart.type, PictogramChart);
};
