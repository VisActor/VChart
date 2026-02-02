import type {
  IMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec,
  ILineMarkSpec,
  IPathMarkSpec,
  ICartesianSeriesSpec
} from '@visactor/vchart';

/** horizontal 布局时的标题位置 */
export type HorizontalLabelPosition = 'top' | 'bottom' | 'top-bottom' | 'bottom-top';

/** vertical 布局时的标题位置 */
export type VerticalLabelPosition = 'left' | 'right' | 'left-right' | 'right-left';

/** 标题位置配置 */
export type LabelPosition = HorizontalLabelPosition | VerticalLabelPosition;

export interface IEventSeriesSpec extends ICartesianSeriesSpec, IEventSeriesTheme {
  type: 'event';
  timeField?: string;
  eventField?: string;
  subTitleField?: string;
  seriesField?: string;
  /** 标题和副标题的位置 */
  labelPosition?: LabelPosition;
  /** dot 和 label 之间的间距 */
  dotLabelGap?: number;
  /** title 和 subTitle 之间的间距 */
  titleSubTitleGap?: number;
}

export interface IEventSeriesTheme {
  /** dot 和 label 之间的间距 */
  dotLabelGap?: number;
  /** title 和 subTitle 之间的间距 */
  titleSubTitleGap?: number;
  dot?: IMarkSpec<ISymbolMarkSpec>;
  title?: IMarkSpec<ITextMarkSpec>;
  subTitle?: IMarkSpec<ITextMarkSpec>;
  line?: IMarkSpec<ILineMarkSpec>;
  arrow?: IMarkSpec<IPathMarkSpec> & { thickness?: number };
}
