import type { ILayoutPaddingSpec } from '../model/interface';
import type { ISeriesTheme } from '../series/interface';
import type { IMarkTheme } from '../typings/spec';
import type {
  IArcMarkSpec,
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec,
  IPathMarkSpec
} from '../typings';
import type { MarkTypeEnum } from '../mark/interface';
import type { IColorKey, IThemeColorScheme } from './color-scheme/interface';
import type { IGradientColor } from '@visactor/vrender';
import type { IComponentTheme } from '../component/interface';

export interface ITheme {
  /**
   * 第 1 种配置：主题信息
   */
  /** 主题命名 */
  name?: string;

  /**
   * 第 2 种配置：图表层级的样式属性
   */
  /** 图表背景色 */
  background?: string | IGradientColor | IColorKey;
  /** 图表内边距 */
  padding?: ILayoutPaddingSpec;
  /** 图表字体配置 */
  fontFamily?: string;

  /**
   * 第 3 种配置：色板
   */
  /** 全局色板 */
  colorScheme?: IThemeColorScheme;

  /**
   * 第 4 种配置：全局 mark 属性配置
   */
  /** 全局 mark 样式属性，按 mark 类别索引 */
  mark?: IGlobalMarkThemeByType;
  /** 全局 mark 样式属性，按 mark 名称索引，优先级更高 */
  markByName?: IGlobalMarkThemeByName;

  /**
   * 第 5 种配置：系列属性配置
   */
  /** 系列样式属性 */
  series?: ISeriesTheme;
  /**
   * 自动关闭动画的阀值，对应的是单系列data的长度
   */
  animationThreshold?: number;

  /**
   * 第 6 种配置：组件属性配置
   */
  /** 组件样式属性 */
  component?: IComponentTheme;
}

export interface IGlobalMarkThemeByType {
  [MarkTypeEnum.line]?: Partial<IMarkTheme<ILineMarkSpec>>;
  [MarkTypeEnum.symbol]?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  [MarkTypeEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
  [MarkTypeEnum.rect]?: Partial<IMarkTheme<IRectMarkSpec>>;
  [MarkTypeEnum.arc]?: Partial<IMarkTheme<IArcMarkSpec>>;
  [MarkTypeEnum.text]?: Partial<IMarkTheme<ITextMarkSpec>>;
  [MarkTypeEnum.path]?: Partial<IMarkTheme<IPathMarkSpec>>;
}

export interface IGlobalMarkThemeByName {
  /** used in lineSeries, areaSeries, radarSeries, etc. */
  line?: Partial<IMarkTheme<ILineMarkSpec>>;
  /** used in lineSeries, areaSeries, radarSeries, scatterSeries etc. */
  point?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  /** used in lineSeries, areaSeries, radarSeries, etc. */
  area?: Partial<IMarkTheme<IAreaMarkSpec>>;
  /** used in barSeries, rangeColumnSeries etc. */
  bar?: Partial<IMarkTheme<IRectMarkSpec>>;
  /** used in many series */
  label?: Partial<IMarkTheme<ITextMarkSpec>>;

  [markName: string]: Partial<IMarkTheme<any>>;
}

export interface IThemeConstants {
  FONT_FAMILY: string;
  LABEL_FONT_SIZE: number;
  MAP_LABEL_FONT_SIZE: number;
  TITLE_FONT_SIZE: number;
  AXIS_TICK_SIZE: number;
}
