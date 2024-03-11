import type { AdaptiveSpec } from '../../../typings';
import { ProgressLikeChartSpecTransformer } from '../../polar';
import type { ICircularProgressChartSpec } from './interface';

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
      },
      {
        forceInitTick: spec.tickMask && spec.tickMask.visible !== false
      }
    );
  }
}
