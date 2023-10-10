import { SeriesTypeEnum } from '../interface/type';
import type { IWordCloud3dSeriesSpec } from './interface';
import { BaseWordCloudSeries } from './base';
export declare class WordCloud3dSeries<
  T extends IWordCloud3dSeriesSpec = IWordCloud3dSeriesSpec
> extends BaseWordCloudSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  compile(): void;
  initMark(): void;
  initMarkStyle(): void;
  initAnimation(): void;
}
