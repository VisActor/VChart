import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import type { IWordCloudChartSpec } from './interface';
import { BaseWordCloudChart } from './base';
import { VChart } from '../../core/vchart';
import { WordCloudSeries } from '../../series';
VChart.useSeries([WordCloudSeries]);

export class WordCloudChart extends BaseWordCloudChart {
  static readonly type: string = ChartTypeEnum.wordCloud;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.wordCloud;
  readonly seriesType: string = SeriesTypeEnum.wordCloud;

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
      fillingWord: spec.fillingWord,
      chartPadding: spec.padding
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }
}
