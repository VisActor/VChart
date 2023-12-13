import { BaseChart } from '../../base';
import type { IHistogramChartSpec } from '../interface';
import { BaseHistogramChartSpecTransformer } from './spec-transformer';

export class BaseHistogramChart<T extends IHistogramChartSpec> extends BaseChart<T> {
  static readonly transformerConstructor = BaseHistogramChartSpecTransformer;
  readonly transformerConstructor = BaseHistogramChartSpecTransformer;
  protected _canStack: boolean = true;
}
