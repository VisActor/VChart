import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseChart, BaseChartSpecTransformer } from '../base-chart';
import type { IWordCloudChartSpec } from './interface';
import type { ISeriesSpec } from '../..';

export class BaseWordCloudChartSpecTransformer<T extends IWordCloudChartSpec> extends BaseChartSpecTransformer<T> {
  transformSpec(spec: T): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeriesSpec) => {
        if (!this._isValidSeries(s.type)) {
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

export class BaseWordCloudChart<T extends IWordCloudChartSpec> extends BaseChart<T> {
  static readonly transformerConstructor = BaseWordCloudChartSpecTransformer;
  readonly transformerConstructor = BaseWordCloudChartSpecTransformer;
  readonly type: string = ChartTypeEnum.wordCloud;
  readonly seriesType: string = SeriesTypeEnum.wordCloud;
}
