import type {
  ICartesianSeriesSpec,
  ICartesianSeriesTheme,
  IMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec,
  ILineMarkSpec,
  ISeriesSpec
} from '@visactor/vchart';
import type { TimelineLayoutType } from '../interface';

/** horizontal 布局时的标题位置 */
export type HorizontalLabelPosition = 'top' | 'bottom' | 'top-bottom' | 'bottom-top';

/** vertical 布局时的标题位置 */
export type VerticalLabelPosition = 'left' | 'right' | 'left-right' | 'right-left';

/** 标题位置配置 */
export type LabelPosition = HorizontalLabelPosition | VerticalLabelPosition;

export interface IEventSeriesSpec extends ISeriesSpec {
  type: 'event';
  timeField?: string;
  eventField?: string;
  subTitleField?: string;
  seriesField?: string;
  dotTypeField?: string;
  layoutType?: TimelineLayoutType;
  /** 标题和副标题的位置 */
  labelPosition?: LabelPosition;
  name?: string;
  dot?: IMarkSpec<ISymbolMarkSpec>;
  title?: IMarkSpec<ITextMarkSpec>;
  subTitle?: IMarkSpec<ITextMarkSpec>;
  line?: IMarkSpec<ILineMarkSpec>;
}

export type IEventSeriesTheme = ICartesianSeriesTheme;
