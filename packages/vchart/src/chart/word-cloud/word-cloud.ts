import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import type { ISeries } from '../../series/interface';
import { BaseChart } from '../base-chart';
import type { IWordCloudChartSpec } from './interface';

class BaseWordCloudChart extends BaseChart {
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

  transformSpec(spec: any): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeries) => {
        if (!this.isValidSeries(s.type)) {
          return;
        }
        Object.keys(defaultSeriesSpec).forEach(k => {
          if (!(k in s)) {
            s[k] = defaultSeriesSpec[k];
          }
        });
      });
    }
  }
}

export class WordCloudChart extends BaseWordCloudChart {
  static readonly type: string = ChartTypeEnum.wordCloud;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.wordCloud;
  readonly seriesType: string = SeriesTypeEnum.wordCloud;
}

export class WordCloud3dChart extends BaseWordCloudChart {
  static readonly type: string = ChartTypeEnum.wordCloud3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.wordCloud3d;
  readonly seriesType: string = SeriesTypeEnum.wordCloud3d;
}
