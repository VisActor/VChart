import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IWordCloudChartSpec } from './interface';
import { BaseWordCloudChart } from './base/base';
import { registerWordCloudSeries, registerWordCloudShapeSeries } from '../../series/word-cloud/word-cloud';
import { Factory } from '../../core/factory';
import { WordCloudChartSpecTransformer } from './spec-transformer';

export class WordCloudChart<T extends IWordCloudChartSpec = IWordCloudChartSpec> extends BaseWordCloudChart<T> {
  static readonly type: string = ChartTypeEnum.wordCloud;
  static readonly seriesType: string = SeriesTypeEnum.wordCloud;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = WordCloudChartSpecTransformer;
  readonly transformerConstructor = WordCloudChartSpecTransformer;
  readonly type: string = ChartTypeEnum.wordCloud;
  readonly seriesType: string = SeriesTypeEnum.wordCloud;
}

export const registerWordCloudChart = () => {
  registerWordCloudSeries();
  Factory.registerChart(WordCloudChart.type, WordCloudChart);
};

// Splitting the register logic into two parts is to tree-shake the unused transforms as much as possible.
// Especially in the cross-terminal environment,  word-cloud shape is not compatible.
export const registerWordCloudShapeChart = () => {
  registerWordCloudShapeSeries();
  registerWordCloudChart();
};
