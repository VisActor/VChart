import { BaseChartSpecTransformer } from '@visactor/vchart';
import type { ICartesianAxisSpec, ICartesianLinearAxisSpec } from '@visactor/vchart';
import type { ITimelineChartSpec } from './interface';

export class TimelineChartSpecTransformer<
  T extends ITimelineChartSpec = ITimelineChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return super._getDefaultSeriesSpec(spec, [
      'timeField',
      'eventField',
      'seriesField',
      'dotTypeField',
      'titleField',
      'subTitleField',
      'dot',
      'title',
      'subTitle',
      'symbol'
    ]);
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    this.transformSeriesSpec(spec);
    const rawAxis = spec.axes?.[0];
    const axisType = rawAxis?.type ?? 'band';
    const axisOrient = rawAxis?.orient;
    let layoutType = spec.layoutType;
    if (!layoutType) {
      if (axisOrient === 'left' || axisOrient === 'right') {
        layoutType = 'vertical';
      } else if (axisOrient === 'bottom' || axisOrient === 'top') {
        layoutType = 'horizontal';
      }
    }
    if (!layoutType) {
      layoutType = 'horizontal';
    }
    spec.layoutType = layoutType;

    const defaultOrient = layoutType === 'vertical' ? 'left' : 'bottom';
    const allowedOrients = layoutType === 'vertical' ? ['left', 'right'] : ['bottom', 'right'];
    const orientNormalized: ICartesianAxisSpec['orient'] = allowedOrients.includes(axisOrient ?? '')
      ? (axisOrient as ICartesianAxisSpec['orient'])
      : (defaultOrient as ICartesianAxisSpec['orient']);
    const typeNormalized: ICartesianAxisSpec['type'] =
      axisType === 'linear' || axisType === 'time' || axisType === 'band' ? (axisType as any) : 'band';
    const baseAxis: ICartesianAxisSpec = {
      ...((rawAxis ?? {}) as ICartesianAxisSpec),
      orient: orientNormalized,
      type: typeNormalized
    };
    if (baseAxis.type === 'linear') {
      const linearAxis: ICartesianLinearAxisSpec = {
        ...(baseAxis as ICartesianLinearAxisSpec),
        zero: (rawAxis as ICartesianLinearAxisSpec)?.zero ?? false
      };
      spec.axes = [linearAxis];
    } else {
      spec.axes = [baseAxis];
    }

    spec.series?.forEach(seriesSpec => {
      if (!seriesSpec.layoutType && spec.layoutType) {
        seriesSpec.layoutType = spec.layoutType;
      }
    });
  }
}
