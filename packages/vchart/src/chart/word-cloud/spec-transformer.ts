import { BaseWordCloudChartSpecTransformer } from './base';
import type { IWordCloudChartSpec } from './interface';

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
