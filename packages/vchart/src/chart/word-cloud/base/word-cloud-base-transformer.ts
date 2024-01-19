import { BaseChartSpecTransformer } from '../../base';
import type { IWordCloudChartSpec } from '../interface';

export class BaseWordCloudChartSpecTransformer<T extends IWordCloudChartSpec> extends BaseChartSpecTransformer<T> {
  transformSpec(spec: T): void {
    super.transformSpec(spec);
    this.transformSeriesSpec(spec);
  }
}
