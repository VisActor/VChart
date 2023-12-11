import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import type { IWordCloudChartSpec } from './interface';
import { BaseWordCloudChart, BaseWordCloudChartSpecTransformer } from './base';
import { registerWordCloudSeries, registerWordCloudShapeSeries } from '../../series/word-cloud/word-cloud';
import { Factory } from '../../core/factory';

export class WordCloudChartSpecTransformer<
  T extends IWordCloudChartSpec = IWordCloudChartSpec
> extends BaseWordCloudChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: IWordCloudChartSpec): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      nameField: spec.nameField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,
      fontFamilyField: spec.fontFamilyField,
      fontWeightField: spec.fontWeightField,
      fontStyleField: spec.fontStyleField,
      colorHexField: spec.colorHexField,
      colorMode: spec.colorMode,
      colorList: spec.colorList,
      rotateAngles: spec.rotateAngles,
      fontWeightRange: spec.fontWeightRange,
      fontSizeRange: spec.fontSizeRange,
      maskShape: spec.maskShape,
      keepAspect: spec.keepAspect,
      random: spec.random,
      wordCloudConfig: spec.wordCloudConfig,
      wordCloudShapeConfig: spec.wordCloudShapeConfig,
      word: spec.word,
      fillingWord: spec.fillingWord
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }
}

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
