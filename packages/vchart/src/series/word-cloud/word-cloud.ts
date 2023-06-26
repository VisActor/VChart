/* eslint-disable no-duplicate-imports */
import { SeriesTypeEnum } from '../interface';
import type { IWordCloudSeriesSpec } from './interface';
import { BaseWordCloudSeries } from './base';

export class WordCloudSeries extends BaseWordCloudSeries<IWordCloudSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.wordCloud;
  type = SeriesTypeEnum.wordCloud;
}
