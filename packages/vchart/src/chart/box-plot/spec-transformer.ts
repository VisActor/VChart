import { Direction } from '../../typings';
import { CartesianChartSpecTransformer } from '../cartesian';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IBoxPlotChartSpec } from './interface';

export class BoxPlotChartSpecTransformer<
  T extends IBoxPlotChartSpec = IBoxPlotChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
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
    seriesSpec[seriesSpec.direction === Direction.vertical ? 'yField' : 'xField'] = dataFields;

    return seriesSpec;
  }

  transformSpec(spec: T): void {
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
    setDefaultCrosshairForCartesianChart(spec);
  }
}
