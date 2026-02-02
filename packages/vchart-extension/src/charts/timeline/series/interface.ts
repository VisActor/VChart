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
  /** icon 字段名，用于显示图标或图片 */
  iconField?: string;
  /** 标题和副标题的位置 */
  labelPosition?: LabelPosition;
}

export interface IEventSeriesTheme {
  dot?: IMarkSpec<ISymbolMarkSpec>;
  icon?: IMarkSpec<ISymbolMarkSpec> & { offset?: number };
  title?: IMarkSpec<ITextMarkSpec> & { subTitleGap?: number; offset?: number };
  subTitle?: IMarkSpec<ITextMarkSpec> & { offset?: number };
  line?: IMarkSpec<ILineMarkSpec>;
  arrow?: IMarkSpec<IPathMarkSpec> & { thickness?: number };
}
