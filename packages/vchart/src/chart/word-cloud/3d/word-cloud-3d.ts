import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface/type';
import type { IWordCloud3dChartSpec } from '../interface';
import { BaseWordCloudChart } from '../base/base';
import { registerWordCloud3dSeries, registerWordCloudShape3dSeries } from '../../../series/word-cloud/word-cloud-3d';
import { Factory } from '../../../core/factory';
import type { AdaptiveSpec } from '../../../typings';
import { WordCloud3dChartSpecTransformer } from './word-cloud-3d-transformer';
import { register3DPlugin } from '../../../plugin/other';

export class WordCloud3dChart<T extends IWordCloud3dChartSpec = IWordCloud3dChartSpec> extends BaseWordCloudChart<
  AdaptiveSpec<T, 'type' | 'series'>
> {
  static readonly type: string = ChartTypeEnum.wordCloud3d;
  static readonly seriesType: string = SeriesTypeEnum.wordCloud3d;
  static readonly transformerConstructor = WordCloud3dChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = WordCloud3dChartSpecTransformer;
  readonly type: string = ChartTypeEnum.wordCloud3d;
  readonly seriesType: string = SeriesTypeEnum.wordCloud3d;
}

export const registerWordCloud3dChart = () => {
  register3DPlugin();
  registerWordCloud3dSeries();
  Factory.registerChart(WordCloud3dChart.type, WordCloud3dChart);
};

export const registerWordCloudShape3dChart = () => {
  register3DPlugin();
  registerWordCloudShape3dSeries();
  registerWordCloud3dChart();
};
