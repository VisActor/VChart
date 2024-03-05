import type { IAxisCommonTheme, ICartesianAxisCommonTheme, IPolarAxisCommonTheme } from '../axis';
import type { IBrushTheme } from '../brush';
import type { ICrosshairTheme } from '../crosshair/interface';
import type { IDataZoomTheme, IScrollBarTheme } from '../data-zoom';
import type { IIndicatorTheme } from '../indicator/interface';
import type { IDiscreteLegendTheme, IColorLegendTheme, ISizeLegendTheme } from '../legend';
import type { IMapLabelTheme } from '../map-label';
import type { IMarkAreaTheme } from '../marker/mark-area/interface';
import type { IMarkLineTheme } from '../marker/mark-line/interface';
import type { IMarkPointTheme } from '../marker/mark-point/interface';
import type { IPlayerTheme } from '../player';
import type { ITitleTheme } from '../title';
import type { ITooltipTheme } from '../tooltip/interface';
import type { ComponentTypeEnum } from './type';
import type { ITotalLabelTheme } from '../label';
import type { IPoptipTheme } from '../poptip/interface';
import type { IColorKey } from '../../theme';
import type { Direction, IOrientType } from '../../typings';

export interface IComponentTheme {
  /**
   * 通用坐标轴配置
   */
  axis?: IAxisCommonTheme;
  /**
   * 离散轴的通用配置
   */
  axisBand?: IAxisCommonTheme;
  /**
   * 连续轴的通用配置
   */
  axisLinear?: IAxisCommonTheme;
  /**
   * 笛卡尔坐标系下 x 轴的配置
   */
  axisX?: ICartesianAxisCommonTheme;
  /**
   * 笛卡尔坐标系下 y 轴配置
   */
  axisY?: ICartesianAxisCommonTheme;
  /**
   * 笛卡尔坐标系下 z 轴配置
   */
  axisZ?: ICartesianAxisCommonTheme;
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
  [ComponentTypeEnum.tooltip]?: ITooltipTheme<string | IColorKey>;
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
  /**
   * 地图标签配置
   */
  [ComponentTypeEnum.mapLabel]?: IMapLabelTheme;
  /**
   * 省略文本配置
   */
  [ComponentTypeEnum.poptip]?: IPoptipTheme;
  /**
   * 堆叠总计标签配置
   * @since 1.3.0
   */
  [ComponentTypeEnum.totalLabel]?: ITotalLabelTheme;
}

/** 区分方向的组件主题类型 */
export type ComponentThemeWithDirection<
  T extends {
    orient?: IOrientType;
  }
> = T /* 通用主题，留作兼容 */ & {
  /** 横向主题 */
  [Direction.horizontal]?: Omit<T, 'orient'>;
  /** 纵向主题 */
  [Direction.vertical]?: Omit<T, 'orient'>;
};
