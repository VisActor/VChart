import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { IMosaicChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { MosaicChartSpecTransformer } from './mosaic-transformer';
import { BaseChart } from '../base';
import { registerMosaicSeries } from '../../series/mosaic/mosaic';

export class MosaicChart<T extends IMosaicChartSpec = IMosaicChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.mosaic;
  static readonly seriesType: string = SeriesTypeEnum.mosaic;
  static readonly transformerConstructor = MosaicChartSpecTransformer;
  readonly transformerConstructor = MosaicChartSpecTransformer;
  readonly type: string = ChartTypeEnum.mosaic;
  readonly seriesType: string = SeriesTypeEnum.mosaic;
  protected _canStack: boolean = true;

  afterCompile() {
    super.afterCompile();
  }
}

export const registerMosaicChart = () => {
  registerMosaicSeries();
  Factory.registerChart(MosaicChart.type, MosaicChart);
};
