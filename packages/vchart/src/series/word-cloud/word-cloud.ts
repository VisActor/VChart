/* eslint-disable no-duplicate-imports */
import { SeriesTypeEnum } from '../interface';
import type { IWordCloudSeriesSpec } from './interface';
import { BaseWordCloudSeries } from './base';
import { Factory } from '../../core';
import { TextMark } from '../../mark';

export class WordCloudSeries<T extends IWordCloudSeriesSpec = IWordCloudSeriesSpec> extends BaseWordCloudSeries<T> {
  static readonly type: string = SeriesTypeEnum.wordCloud;
  type = SeriesTypeEnum.wordCloud;
}

export const registerWordCloudSeries = () => {
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(WordCloudSeries.type, WordCloudSeries);
};
