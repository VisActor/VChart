import { BaseChart } from '../base/base-chart';
import { ChartTypeEnum } from '../interface/type';
import { Factory } from '../../core/factory';
import type { ICommonChartSpec } from './interface';
import type { AdaptiveSpec } from '../../typings';
import { CommonChartSpecTransformer } from './common-transformer';

export class CommonChart<T extends ICommonChartSpec = ICommonChartSpec> extends BaseChart<AdaptiveSpec<T, 'series'>> {
  static readonly type: string = ChartTypeEnum.common;
  static readonly transformerConstructor = CommonChartSpecTransformer;
  readonly transformerConstructor = CommonChartSpecTransformer;
  readonly type: string = ChartTypeEnum.common;
  protected _canStack: boolean = true;
}

export const registerCommonChart = () => {
  Factory.registerChart(CommonChart.type, CommonChart);
};
