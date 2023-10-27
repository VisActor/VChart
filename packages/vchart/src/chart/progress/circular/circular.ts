import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface';
import { ProgressLikeChart } from '../../polar/progress-like';
import { registerCircularProgressSeries } from '../../../series/progress/circular';
import { Factory } from '../../../core/factory';

export class CircularProgressChart extends ProgressLikeChart {
  static readonly type: string = ChartTypeEnum.circularProgress;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.circularProgress;
  readonly seriesType: string = SeriesTypeEnum.circularProgress;
  protected _canStack: boolean = true;

  protected _getDefaultSeriesSpec(spec: any): any {
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

  transformSpec(spec: any): void {
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

export const registerCircularProgressChart = () => {
  registerCircularProgressSeries();
  Factory.registerChart(CircularProgressChart.type, CircularProgressChart);
};
