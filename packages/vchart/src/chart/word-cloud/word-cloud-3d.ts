import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IWordCloud3dChartSpec } from './interface';
import { BaseWordCloudChart, BaseWordCloudChartSpecTransformer } from './base';
import { registerWordCloud3dSeries, registerWordCloudShape3dSeries } from '../../series/word-cloud/word-cloud-3d';
import { Factory } from '../../core/factory';
import type { AdaptiveSpec } from '../..';

export class WordCloud3dChartSpecTransformer<
  T extends IWordCloud3dChartSpec = IWordCloud3dChartSpec
> extends BaseWordCloudChartSpecTransformer<AdaptiveSpec<T, 'type' | 'series'>> {
  protected _getDefaultSeriesSpec(spec: IWordCloud3dChartSpec): any {
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
      depth_3d: spec.depth_3d,
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

export class WordCloud3dChart<T extends IWordCloud3dChartSpec = IWordCloud3dChartSpec> extends BaseWordCloudChart<
  AdaptiveSpec<T, 'type' | 'series'>
> {
  static readonly type: string = ChartTypeEnum.wordCloud3d;
  static readonly seriesType: string = SeriesTypeEnum.wordCloud3d;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = WordCloud3dChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = WordCloud3dChartSpecTransformer;
  readonly type: string = ChartTypeEnum.wordCloud3d;
  readonly seriesType: string = SeriesTypeEnum.wordCloud3d;
}

export const registerWordCloud3dChart = () => {
  registerWordCloud3dSeries();
  Factory.registerChart(WordCloud3dChart.type, WordCloud3dChart);
};

export const registerWordCloudShape3dChart = () => {
  registerWordCloudShape3dSeries();
  registerWordCloud3dChart();
};
