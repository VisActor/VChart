/* eslint-disable no-duplicate-imports */
import { SeriesTypeEnum } from '../interface/type';
import type { IWordCloudSeriesSpec } from './interface';
import { BaseWordCloudSeries } from './base';
import { Factory } from '../../core/factory';
import { TextMark } from '../../mark';
import { registerWordCloudAnimation } from './animation';

export class WordCloudSeries<T extends IWordCloudSeriesSpec = IWordCloudSeriesSpec> extends BaseWordCloudSeries<T> {
  static readonly type: string = SeriesTypeEnum.wordCloud;
  type = SeriesTypeEnum.wordCloud;
}

export const registerWordCloudSeries = () => {
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(WordCloudSeries.type, WordCloudSeries);
  registerWordCloudAnimation();
};
