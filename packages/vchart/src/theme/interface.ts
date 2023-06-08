import type { IAxisCommonTheme, ICommonAxisSpec } from './../component/axis/interface';
import type { ILayoutPaddingSpec } from '../model/interface';
import type { IDataZoomTheme, IScrollBarTheme } from '../component/data-zoom';
import type { ITooltipTheme } from '../component/tooltip/interface';
import type { IDiscreteLegendTheme } from '../component/legend/discrete/interface';
import type { IMarkLineTheme } from '../component/marker/mark-line/interface';
import type { ISeriesTheme } from '../series/interface';
import type { ICrosshairTheme } from '../component/crosshair/interface';
import type { IMarkTheme } from '../typings/spec';
import type {
  IArcMarkSpec,
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec
} from '../typings';
import type { ICartesianAxisCommonTheme } from '../component/axis/cartesian/interface';
import type { IPolarAxisCommonTheme } from '../component/axis/polar/interface';
import type { ComponentTypeEnum } from '../component/interface';
import type { IIndicatorTheme } from '../component/indicator/interface';
import type { MarkTypeEnum } from '../mark/interface';
import type { IThemeColorScheme } from './color-scheme/interface';
import type { IColorLegendTheme, ISizeLegendTheme } from '../component/legend/continuous';
import type { IMarkAreaTheme } from '../component/marker/mark-area/interface';
import type { IPlayerTheme } from '../component/player';
import type { IMarkPointTheme } from '../component/marker/mark-point/interface';
import type { IBrushTheme } from '../component/brush/interface';
import type { ITitleTheme } from '../component/title';
import type { IGradientColor } from '@visactor/vrender';

export interface ITheme {
  /** 主题命名 */
  name?: string;

  /** 图表层级的样式属性，用于配置背景色 */
  background?: string | IGradientColor;
  /** 图表内边距 */
  padding?: ILayoutPaddingSpec;
  /** 图表字体配置 */
  fontFamily?: string;

  /** 全局 mark 样式属性 */
  mark?: IGlobalMarkTheme;

  /** 全局色板 */
  colorScheme?: IThemeColorScheme;

  /** 系列 */
  series?: ISeriesTheme;

  // 组件的配置
  /**
   * 通用坐标轴配置
   */
  axis?: IAxisCommonTheme;
  /**
   * 笛卡尔坐标系下 x 轴的配置
   */
  axisX?: ICartesianAxisCommonTheme;
  /**
   * 笛卡尔坐标系下 y 轴配置
   */
  axisY?: ICartesianAxisCommonTheme;
  /**
   * 极坐标系下半径轴配置
   */
  axisRadius?: IPolarAxisCommonTheme;
  /**
   * 极坐标系下角度轴配置
   */
  axisAngle?: IPolarAxisCommonTheme;
  /**
   * 离散图例配置
   */
  [ComponentTypeEnum.discreteLegend]?: IDiscreteLegendTheme;
  /**
   * 连续颜色图例配置
   */
  [ComponentTypeEnum.colorLegend]?: IColorLegendTheme;
  /**
   * 连续尺寸图例配置
   */
  [ComponentTypeEnum.sizeLegend]?: ISizeLegendTheme;
  /**
   * markLine 标记配置
   */
  [ComponentTypeEnum.markLine]?: IMarkLineTheme;
  /**
   * markArea 标记配置
   */
  [ComponentTypeEnum.markArea]?: IMarkAreaTheme;
  /**
   * markPoint 标记配置
   */
  [ComponentTypeEnum.markPoint]?: IMarkPointTheme;
  /**
   * tooltip 组件配置
   */
  [ComponentTypeEnum.tooltip]?: ITooltipTheme;
  /**
   * crosshair 配置
   */
  [ComponentTypeEnum.crosshair]?: ICrosshairTheme;
  /**
   * dataZoom 配置
   */
  [ComponentTypeEnum.dataZoom]?: IDataZoomTheme;
  /**
   * scrollbar 滚动条配置
   */
  [ComponentTypeEnum.scrollBar]?: IScrollBarTheme;
  /**
   * 指标卡组件配置
   */
  [ComponentTypeEnum.indicator]?: IIndicatorTheme;
  /**
   * 播放器配置
   */
  [ComponentTypeEnum.player]?: IPlayerTheme;
  /**
   * 框选配置
   */
  [ComponentTypeEnum.brush]?: IBrushTheme;
  /**
   * 图表标题配置
   */
  [ComponentTypeEnum.title]?: ITitleTheme;
}

export interface IGlobalMarkTheme {
  [MarkTypeEnum.line]?: Partial<IMarkTheme<ILineMarkSpec>>;
  [MarkTypeEnum.symbol]?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  [MarkTypeEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
  [MarkTypeEnum.rect]?: Partial<IMarkTheme<IRectMarkSpec>>;
  [MarkTypeEnum.arc]?: Partial<IMarkTheme<IArcMarkSpec>>;
  [MarkTypeEnum.text]?: Partial<IMarkTheme<ITextMarkSpec>>;
}
