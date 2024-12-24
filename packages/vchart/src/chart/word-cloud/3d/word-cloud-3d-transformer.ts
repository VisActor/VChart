import type { AdaptiveSpec } from '../../../typings';
import { BaseWordCloudChartSpecTransformer } from '../base/word-cloud-base-transformer';
import type { IWordCloud3dChartSpec } from '../interface';

export class WordCloud3dChartSpecTransformer<
  T extends IWordCloud3dChartSpec = IWordCloud3dChartSpec
> extends BaseWordCloudChartSpecTransformer<AdaptiveSpec<T, 'type' | 'series'>> {
  protected _getDefaultSeriesSpec(spec: IWordCloud3dChartSpec): any {
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
      'depth_3d',
      'maskShape',
      'keepAspect',
      'random',
      'wordCloudConfig',
      'wordCloudShapeConfig',
      'word',
      'fillingWord'
    ]);
    return series;
  }
}
