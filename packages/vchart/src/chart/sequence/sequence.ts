import { registerLinkSeries } from '../../series/link/link';
import { registerDotSeries } from '../../series/dot/dot';
import { BaseChart } from '../base/base-chart';
import type { ISequenceChartSpec } from './interface';
import type { IRegion } from '../../region/interface';
import { Factory } from '../../core/factory';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { ISeriesConstructor, ISeriesOption } from '../../series/interface';
import type { IModelSpecInfo } from '../../model/interface';
import { SequenceChartSpecTransformer } from './sequence-transformer';
import { registerCartesianLinearAxis, registerCartesianBandAxis } from '../../component/axis/cartesian';

export class SequenceChart<T extends ISequenceChartSpec = ISequenceChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.sequence; // csj-Q: view是什么含义
  static readonly transformerConstructor = SequenceChartSpecTransformer;
  readonly transformerConstructor = SequenceChartSpecTransformer;
  readonly type: string = ChartTypeEnum.sequence;

  /**
   * @override
   * @description 主要是将link series关联的dot data放到link series中
   */
  protected _createSeries(constructor: ISeriesConstructor, specInfo: IModelSpecInfo) {
    if (!constructor) {
      return;
    }

    const { spec, ...others } = specInfo;

    if (spec.type === SeriesTypeEnum.link) {
      spec.dotSeriesSpec = this._spec.series[spec.dotSeriesIndex];
    }

    let region: IRegion | undefined;
    if (spec.regionId) {
      region = this.getRegionsInUserId(spec.regionId);
    }
    if (!region) {
      region = this.getRegionsInIndex(spec.regionIndex ? [spec.regionIndex] : undefined)[0];
    }
    if (!region) {
      return;
    }
    const series = new constructor(spec, {
      ...this._modelOption,
      ...others,
      region,
      specKey: 'series',
      globalScale: this._globalScale
    } as ISeriesOption);

    if (series) {
      series.created();
      this._series.push(series);
      region.addSeries(series);
    }
  }
}

export const registerSequenceChart = () => {
  registerDotSeries();
  registerLinkSeries();
  registerCartesianBandAxis();
  registerCartesianLinearAxis();
  Factory.registerChart(SequenceChart.type, SequenceChart);
};
