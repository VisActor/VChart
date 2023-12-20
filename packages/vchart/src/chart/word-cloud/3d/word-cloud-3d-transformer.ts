import type { AdaptiveSpec } from '../../../typings';
import { BaseWordCloudChartSpecTransformer } from '../base/word-cloud-base-transformer';
import type { IWordCloud3dChartSpec } from '../interface';

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
