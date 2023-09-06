import { isArray } from '@visactor/vutils';
import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface';
import type { ISeries } from '../../series';

export class CommonChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.common;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.common;

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    if (isArray(spec.series)) {
      const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
      spec.series.forEach((s: ISeries) => {
        if (!this.isValidSeries(s.type)) {
          return;
        }
        Object.keys(defaultSeriesSpec).forEach(k => {
          if (!(k in s)) {
            s[k] = defaultSeriesSpec[k];
          }
        });
      });
    }
  }
}
