import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import type { IWordCloud3dChartSpec } from './interface';
import { BaseWordCloudChart } from './base';
import { VChart } from '../../core/vchart';
import { WordCloud3dSeries } from '../../series';
VChart.useSeries([WordCloud3dSeries]);

export class WordCloud3dChart extends BaseWordCloudChart {
  static readonly type: string = ChartTypeEnum.wordCloud3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.wordCloud3d;
  readonly seriesType: string = SeriesTypeEnum.wordCloud3d;

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
