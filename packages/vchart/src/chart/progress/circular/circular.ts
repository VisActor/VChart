import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface';
import { ProgressLikeChart, ProgressLikeChartSpecTransformer } from '../../polar/progress-like';
import { registerCircularProgressSeries } from '../../../series/progress/circular';
import { Factory } from '../../../core/factory';
import type { ICircularProgressChartSpec } from './interface';
import type { AdaptiveSpec } from '../../..';

export class CircularProgressChartSpecTransformer<
  T extends ICircularProgressChartSpec = ICircularProgressChartSpec
> extends ProgressLikeChartSpecTransformer<AdaptiveSpec<T, 'axes'>> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series = super._getDefaultSeriesSpec(spec);
    return {
      ...series,

      cornerRadius: spec.cornerRadius ?? 0,
      roundCap: spec.roundCap ?? false,

      progress: spec.progress,
      track: spec.track,

      tickMask: spec.tickMask
    };
  }

  transformSpec(spec: AdaptiveSpec<T, 'axes'>): void {
    super.transformSpec(spec);
    this._transformProgressAxisSpec(
      spec,
      {
        orient: 'angle',
        visible: false
      },
      {
        orient: 'radius',
        visible: false
      }
    );
  }
}

export class CircularProgressChart<
  T extends ICircularProgressChartSpec = ICircularProgressChartSpec
> extends ProgressLikeChart<AdaptiveSpec<T, 'axes'>> {
  static readonly type: string = ChartTypeEnum.circularProgress;
  static readonly seriesType: string = SeriesTypeEnum.circularProgress;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = CircularProgressChartSpecTransformer;
  readonly transformerConstructor = CircularProgressChartSpecTransformer;
  readonly type: string = ChartTypeEnum.circularProgress;
  readonly seriesType: string = SeriesTypeEnum.circularProgress;
  protected _canStack: boolean = true;
}

export const registerCircularProgressChart = () => {
  registerCircularProgressSeries();
  Factory.registerChart(CircularProgressChart.type, CircularProgressChart);
};
