import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, IRuleMarkSpec, ITextMarkSpec, ConvertToMarkStyleSpec } from '../../typings/visual';
import type { SeriesTypeEnum } from '../interface';

interface ISequenceLabel {
  visible?: boolean;
  formatMethod?: (text: string | string[], datum?: any) => string | string[];
  style?: Omit<ConvertToMarkStyleSpec<ITextMarkSpec>, 'visible'>;
}

interface ISequenceGrid {
  visible?: boolean;
  background?: {
    fill?: string;
    fillOpacity?: number;
  };
  style?: Omit<ConvertToMarkStyleSpec<IRuleMarkSpec>, 'visible'>;
}

export interface IDotSeriesSpec extends ICartesianSeriesSpec {
  /**
   * 系列类型
   */
  type: SeriesTypeEnum.dot;

  /**
   * dot series group字段配置
   * @description 用于区分grid、symbol的fill和stroke逻辑。如果未配置,默认按照yField字段处理
   */
  seriesGroupField?: string;

  /**
   * dot type 字段配置
   * @description 用于区分dot的fill逻辑。如果未配置，默认按照yField字段处理
   */
  dotTypeField?: string;

  /**
   * title 字段配置
   * @description 用于显示title。如果未配置，默认按照yField字段处理
   */
  titleField?: string;

  /**
   * subTitle 字段配置
   * @description 用于显示subTitle。如果未配置，默认按照yField字段处理
   */
  subTitleField?: string;

  /**
   * @description 高亮series配置
   */
  highLightSeriesGroup?: string;

  /**
   * name 字段配置
   * @description 用于标记node name，便于绘制link。
   */
  name: string;
  /**
   * 图元配置
   */
  dot?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 标题
   */
  title?: ISequenceLabel;
  /**
   * 标识符
   */
  symbol?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 具体信息
   */
  subTitle?: ISequenceLabel;
  /**
   * 时间线
   */
  grid?: ISequenceGrid;
  /**
   * dot 系列的左边距(主要用于放置title和subTitle)
   */
  leftAppendPadding?: number;
  /**
   * dot 系列的可视高度
   */
  clipHeight?: number;
}

export interface IDotSeriesTheme extends ICartesianSeriesTheme {
  dot?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  symbol?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  title?: ISequenceLabel;
  subTitle?: ISequenceLabel;
}
