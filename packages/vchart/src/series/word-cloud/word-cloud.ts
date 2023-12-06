/* eslint-disable no-duplicate-imports */
import { SeriesTypeEnum } from '../interface/type';
import type { IWordCloudSeriesSpec } from './interface';
import { BaseWordCloudSeries } from './base';
import { Factory } from '../../core/factory';
import { registerWordCloudAnimation } from './animation';
import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud';
import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';
import { registerTextMark } from '../../mark/text';

export class WordCloudSeries<T extends IWordCloudSeriesSpec = IWordCloudSeriesSpec> extends BaseWordCloudSeries<T> {
  static readonly type: string = SeriesTypeEnum.wordCloud;
  type = SeriesTypeEnum.wordCloud;
}

export const registerWordCloudSeries = () => {
  registerWordCloudTransforms();
  registerTextMark();
  registerWordCloudAnimation();
  Factory.registerSeries(WordCloudSeries.type, WordCloudSeries);
};

export const registerWordCloudShapeSeries = () => {
  registerWordCloudShapeTransforms();
  registerWordCloudSeries();
};
