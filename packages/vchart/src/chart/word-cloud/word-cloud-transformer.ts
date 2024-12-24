import { BaseWordCloudChartSpecTransformer } from './base';
import type { IWordCloudChartSpec } from './interface';

export class WordCloudChartSpecTransformer<
  T extends IWordCloudChartSpec = IWordCloudChartSpec
> extends BaseWordCloudChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: IWordCloudChartSpec): any {
    const series: any = super._getDefaultSeriesSpec(spec, [
      'nameField',
      'valueField',
      'fontFamilyField',
      'fontWeightField',
      'fontStyleField',
      'colorHexField',
      'colorMode',
      'colorList',
      'rotateAngles',
      'fontWeightRange',
      'fontSizeRange',
      'maskShape',
      'keepAspect',
      'random',
      'wordCloudConfig',
      'wordCloudShapeConfig',
      'word',
      'fillingWord',
      'wordMask'
    ]);

    return series;
  }
}
