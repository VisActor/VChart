import { CartesianChart } from '../../cartesian/cartesian';
import { ChartTypeEnum } from '../../interface';
import { SeriesTypeEnum } from '../../../series/interface/type';
import type {
  ICartesianLinearAxisSpec,
  ICartesianBandAxisSpec,
  ICartesianAxisSpec
} from '../../../component/axis/cartesian/interface';
import { isNil } from '../../../util';
import type { ILinearProgressChartSpec } from './interface';
import { getLinearAxisSpecDomain } from '../../../component/axis/utils';
import { VChart } from '../../../core/vchart';
import { LinearProgressSeries } from '../../../series/progress/linear';
VChart.useSeries([LinearProgressSeries]);

export class LinearProgressChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.linearProgress;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.linearProgress;
  readonly seriesType: string = SeriesTypeEnum.linearProgress;

  protected needAxes(): boolean {
    return false;
  }

  protected _getDefaultSeriesSpec(spec: ILinearProgressChartSpec): ILinearProgressChartSpec {
    const series = super._getDefaultSeriesSpec(spec);
    return {
      ...series,
      direction: spec.direction ?? 'horizontal',

      cornerRadius: spec.cornerRadius ?? 0,
      bandWidth: spec.bandWidth,

      progress: spec.progress,
      track: spec.track
    };
  }

  transformSpec(spec: ILinearProgressChartSpec): void {
    super.transformSpec(spec);

    if (!spec.axes) {
      spec.axes = [];
    }

    if (spec.direction === 'vertical') {
      let leftAxis: ICartesianLinearAxisSpec = null;
      let bottomAxis: ICartesianBandAxisSpec = null;
      (spec.axes ?? []).forEach((axis: ICartesianAxisSpec) => {
        const { orient } = axis;
        if (orient === 'left') {
          leftAxis = axis;
        }
        if (orient === 'bottom') {
          bottomAxis = axis;
        }
      });
      if (!leftAxis) {
        leftAxis = {
          orient: 'left',
          visible: false
        };
        spec.axes.push(leftAxis);
      }
      if (!bottomAxis) {
        bottomAxis = {
          orient: 'bottom',
          visible: false
        };
        spec.axes.push(bottomAxis);
      }

      // 自动补全轴类型类型和range
      if (isNil(bottomAxis.type)) {
        bottomAxis.type = 'band';
      }
      if (isNil(leftAxis.type)) {
        leftAxis.type = 'linear';
      }
      const domain = getLinearAxisSpecDomain(leftAxis, { min: 0, max: 1 });
      if (isNil(leftAxis.min)) {
        leftAxis.min = domain.min;
      }
      if (isNil(leftAxis.max)) {
        leftAxis.max = domain.max;
      }
    } else {
      let leftAxis: ICartesianBandAxisSpec = null;
      let bottomAxis: ICartesianLinearAxisSpec = null;
      (spec.axes ?? []).forEach((axis: ICartesianAxisSpec) => {
        const { orient } = axis;
        if (orient === 'left') {
          leftAxis = axis;
        }
        if (orient === 'bottom') {
          bottomAxis = axis;
        }
      });
      if (!leftAxis) {
        leftAxis = {
          type: 'band',
          orient: 'left',
          visible: false
        };
        spec.axes.push(leftAxis);
      }
      if (!bottomAxis) {
        bottomAxis = {
          orient: 'bottom',
          visible: false
        };
        spec.axes.push(bottomAxis);
      }

      // 自动补全轴类型类型和range
      if (isNil(bottomAxis.type)) {
        bottomAxis.type = 'linear';
      }
      if (isNil(leftAxis.type)) {
        leftAxis.type = 'band';
      }
      const domain = getLinearAxisSpecDomain(bottomAxis, { min: 0, max: 1 });
      if (isNil(bottomAxis.min)) {
        bottomAxis.min = domain.min;
      }
      if (isNil(bottomAxis.max)) {
        bottomAxis.max = domain.max;
      }
    }
  }
}
