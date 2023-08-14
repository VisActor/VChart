/* eslint-disable no-duplicate-imports */
import { MarkTypeEnum } from '../../mark/interface';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum, SeriesMarkNameEnum } from '../interface';
import { BarSeries } from './bar';
import { VChart } from '../../core/vchart';
import { Rect3dMark } from '../../mark/rect-3d';
import { TextMark } from '../../mark/text';
import type { IBar3dSeriesSpec } from './interface';
import type { AdaptiveSpec } from '../../typings';
import { bar3dSeriesMark } from './constant';

VChart.useMark([Rect3dMark, TextMark]);

export class Bar3dSeries<T extends IBar3dSeriesSpec = IBar3dSeriesSpec> extends BarSeries<AdaptiveSpec<T, 'type'>> {
  static readonly type: string = SeriesTypeEnum.bar3d;
  type = SeriesTypeEnum.bar3d;

  static readonly mark: SeriesMarkMap = bar3dSeriesMark;

  protected _barMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.bar3d;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect3d;
}
