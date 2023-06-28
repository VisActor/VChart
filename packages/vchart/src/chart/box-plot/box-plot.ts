import { SeriesTypeEnum } from '../../series/interface';
import { Direction } from '../../typings';
import { isNil } from '../../util';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IBoxPlotChartSpec } from './interface';

export class BoxPlotChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.boxPlot;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.boxPlot;
  readonly seriesType: string = SeriesTypeEnum.boxPlot;

  protected _getDefaultSeriesSpec(spec: IBoxPlotChartSpec): any {
    const dataFields = [spec.maxField, spec.medianField, spec.q1Field, spec.q3Field, spec.minField, spec.outliersField];
    const seriesSpec = {
      ...super._getDefaultSeriesSpec(spec),
      boxPlot: spec.boxPlot,
      direction: spec.direction ?? Direction.vertical,
      minField: spec.minField,
      maxField: spec.maxField,
      q1Field: spec.q1Field,
      medianField: spec.medianField,
      q3Field: spec.q3Field,
      outliersField: spec.outliersField,
      outliersStyle: spec.outliersStyle
    };
    seriesSpec[spec.direction === Direction.vertical ? 'yField' : 'xField'] = dataFields;

    return seriesSpec;
  }

  transformSpec(spec: IBoxPlotChartSpec): void {
    super.transformSpec(spec);
    if (!spec.axes) {
      spec.axes = [
        {
          orient: 'bottom'
        },
        {
          orient: 'left'
        }
      ];
    }
    //补全轴类型
    (spec.axes ?? []).forEach(axis => {
      const { orient, type } = axis;
      if (orient === 'left') {
        if (isNil(type)) {
          axis.type = spec.direction === Direction.vertical ? 'linear' : 'band';
        }
      }
      if (orient === 'bottom') {
        if (isNil(type)) {
          axis.type = spec.direction === Direction.vertical ? 'band' : 'linear';
        }
      }
    });
    setDefaultCrosshairForCartesianChart(spec);
  }
}
