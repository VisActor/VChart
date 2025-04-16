/* eslint-disable no-duplicate-imports */
import { MarkTypeEnum } from '../../mark/interface/type';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum, SeriesMarkNameEnum } from '../interface/type';
import { BarSeries } from './bar';
import { registerRect3dMark } from '../../mark/rect-3d';
import type { IBar3dSeriesSpec } from './interface';
import type { AdaptiveSpec } from '../../typings';
import { bar3dSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import { registerBar3dAnimation } from './animation';
import { registerCartesianLinearAxis, registerCartesianBandAxis } from '../../component/axis/cartesian';
import { Bar3dSeriesSpecTransformer } from './bar-3d-transformer';

export class Bar3dSeries<T extends IBar3dSeriesSpec = IBar3dSeriesSpec> extends BarSeries<AdaptiveSpec<T, 'type'>> {
  static readonly type: string = SeriesTypeEnum.bar3d;
  type = SeriesTypeEnum.bar3d;

  static readonly mark: SeriesMarkMap = bar3dSeriesMark;

  protected _barMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.bar3d;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect3d;

  static readonly transformerConstructor = Bar3dSeriesSpecTransformer as any;
  readonly transformerConstructor = Bar3dSeriesSpecTransformer as any;
}

export const registerBar3dSeries = () => {
  registerBar3dAnimation();
  registerRect3dMark();
  registerCartesianBandAxis();
  registerCartesianLinearAxis();
  Factory.registerSeries(Bar3dSeries.type, Bar3dSeries);
};
