import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IImageCloudChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { ImageCloudChartSpecTransformer } from './image-cloud-transformer';
import { registerImageCloudSeries } from '../../series/image-cloud/image-cloud';
import { BaseChart } from '../base';

export class ImageCloudChart<T extends IImageCloudChartSpec = IImageCloudChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.imageCloud;
  static readonly seriesType: string = SeriesTypeEnum.imageCloud;
  static readonly transformerConstructor = ImageCloudChartSpecTransformer;
  readonly transformerConstructor = ImageCloudChart.transformerConstructor;
  readonly type: string = ChartTypeEnum.imageCloud;
  readonly seriesType: string = SeriesTypeEnum.imageCloud;
}

export const registerImageCloudChart = () => {
  registerImageCloudSeries();
  Factory.registerChart(ImageCloudChart.type, ImageCloudChart);
};
