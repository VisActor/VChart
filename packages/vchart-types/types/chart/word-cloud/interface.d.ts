import type { IWordCloud3dSeriesSpec, IWordCloudSeriesSpec } from '../../series/word-cloud/interface';
import type { IChartExtendsSeriesSpec, IChartSpec } from '../../typings/spec/common';
export interface IWordCloudChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IWordCloudSeriesSpec> {
    type: 'wordCloud';
    series?: IWordCloudSeriesSpec[];
}
export interface IWordCloud3dChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IWordCloud3dSeriesSpec> {
    type: 'wordCloud3d';
    series?: IWordCloud3dSeriesSpec[];
}
