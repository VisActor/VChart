import { registerPieSeries } from '../../series/pie/pie';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BasePieChart } from './base';
import { Factory } from '../../core/factory';
import type { IPieChartSpec } from './interface';

export class PieChart<T extends IPieChartSpec = IPieChartSpec> extends BasePieChart<T> {
  static readonly type: string = ChartTypeEnum.pie;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.pie;
  readonly seriesType: string = SeriesTypeEnum.pie;
}

export const registerPieChart = () => {
  registerPieSeries();
  Factory.registerChart(PieChart.type, PieChart);
};
