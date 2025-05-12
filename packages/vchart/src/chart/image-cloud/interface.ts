import type { IImageCloudSeriesSpec } from '../../series/image-cloud/interface';
import type { IChartExtendsSeriesSpec, IChartSpec } from '../../typings/spec/common';

export interface IImageCloudChartSpec extends IChartSpec, Omit<IChartExtendsSeriesSpec<IImageCloudSeriesSpec>, 'type'> {
  type: 'imageCloud';
  series?: IImageCloudSeriesSpec[];
}
