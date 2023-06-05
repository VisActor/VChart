import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface';

export class CommonChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.common;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.common;
}
