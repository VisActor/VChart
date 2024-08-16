import type { ICartesianAxisSpec } from '../../component/axis/cartesian/interface/spec';
import { CartesianChartSpecTransformer } from '../cartesian';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IMosaicChartSpec } from './interface';

export class MosaicChartSpecTransformer<
  T extends IMosaicChartSpec = IMosaicChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: (spec as IMosaicChartSpec).barWidth,
      barMaxWidth: (spec as IMosaicChartSpec).barMaxWidth,
      barMinWidth: (spec as IMosaicChartSpec).barMinWidth,
      barGapInGroup: (spec as IMosaicChartSpec).barGapInGroup,
      barBackground: (spec as IMosaicChartSpec).barBackground,
      barMinHeight: (spec as IMosaicChartSpec).barMinHeight,
      stackCornerRadius: (spec as IMosaicChartSpec).stackCornerRadius
    };
    series.bar = spec.bar;

    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }

  protected _setDefaultXAxisSpec(spec: T): ICartesianAxisSpec {
    return {
      orient: 'bottom',
      type: 'linear',
      label: {
        visible: false
      }
    } as ICartesianAxisSpec;
  }

  protected _setDefaultYAxisSpec(spec: T): ICartesianAxisSpec {
    return {
      orient: 'left',
      type: 'linear'
    } as ICartesianAxisSpec;
  }
}
