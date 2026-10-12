import {
  VChart,
  BaseChart,
  SeriesTypeEnum,
  registerDotSeries,
  registerLinkSeries,
  registerBarSeries,
  registerLineSeries,
  registerAreaSeries,
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  registerCartesianTimeAxis,
  registerGridLayout,
  registerScrollBar,
  registerMarkTooltipProcessor,
  registerDimensionTooltipProcessor
} from '@visactor/vchart';
import type { ISeriesConstructor, IModelSpecInfo } from '@visactor/vchart';
import type { ISequenceChartSpec } from './interface';
import { SequenceChartSpecTransformer } from './sequence-transformer';

export class SequenceChart<T extends ISequenceChartSpec = ISequenceChartSpec> extends BaseChart<T> {
  static readonly type: string = 'sequence';
  static readonly transformerConstructor = SequenceChartSpecTransformer;
  readonly transformerConstructor = SequenceChartSpecTransformer;
  readonly type: string = 'sequence';

  protected _createSeries(constructor: ISeriesConstructor, specInfo: IModelSpecInfo) {
    if (specInfo.spec.type === SeriesTypeEnum.link) {
      specInfo.spec.dotSeriesSpec = this._spec.series[specInfo.spec.dotSeriesIndex];
    }
    super._createSeries(constructor, specInfo);
  }
}

export const registerSequenceChart = (option?: { VChart?: typeof VChart }) => {
  registerDimensionTooltipProcessor();
  registerMarkTooltipProcessor();
  registerDotSeries();
  registerLinkSeries();
  registerBarSeries();
  registerLineSeries();
  registerAreaSeries();
  registerCartesianBandAxis();
  registerCartesianLinearAxis();
  registerCartesianTimeAxis();
  registerGridLayout();
  registerScrollBar();

  const vchartConstructor = option?.VChart || VChart;
  vchartConstructor.useChart([SequenceChart]);
};
