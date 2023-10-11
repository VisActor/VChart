import type { SymbolType } from '@visactor/vrender';
import type { IPolygonMarkSpec } from '../../typings';
import type { IComponent } from '../interface';
import type { IDelayType } from '../../typings/event';

export type IBrush = IComponent;

interface IBrushDataBindSpec {
  /**
   * 可刷取的regionIndex
   */
  regionIndex?: number | number[]; // 默认为所有region
  /**
   * 可刷取的regionId
   */
  regionId?: string | string[]; // 默认为所有region
  /**
   * 可刷取的seriesIndex
   */
  seriesIndex?: number | number[]; // 默认为所有系列
  /**
   * 可刷取的seriesId
   */
  seriesId?: string | string[]; // 默认为所有系列
  /**
   * 刷取联动的seriesIndex
   */
  brushLinkSeriesIndex?: number | number[]; // 默认无系列
  /**
   * 刷取联动的seriesId
   */
  brushLinkSeriesId?: string | string[]; // 默认无系列
}

export interface IBrushTheme {
  /**
   * brush 的框选样式
   */
  style?: Partial<IPolygonMarkSpec>;

  /**
   * 框选范围内的图元样式
   */
  inBrush?: selectedItemStyle;
  /**
   * 框选范围外的图元样式
   */
  outOfBrush?: selectedItemStyle;
  /**
   * 框选模式
   * @default 'single'
   */
  brushMode?: IBrushMode;
  /**
   * 框选类型
   * @default 'rect'
   */
  brushType?: IBrushType;
  /**
   * 是否可被平移
   * @default true
   */
  brushMoved?: boolean;
  /**
   * brushMode为'single'时，是否单击清除选框
   * @default true
   */
  removeOnClick?: boolean;
  /**
   * 事件触发延迟类型
   * @default 'throttle'
   */
  delayType?: IDelayType;
  /**
   * 事件触发延迟时长
   * @default 10
   */
  delayTime?: number;
  /**
   * brush选框的大小阈值
   * @default 5
   * @since 1.2.0
   */
  sizeThreshold?: number;
}

export interface IBrushSpec extends IBrushTheme, IBrushDataBindSpec {
  /** 组件 id */
  id?: string;
  /**
   * 组件可见性
   * @default true
   */
  visible?: boolean;
}

export type IBrushType = 'x' | 'y' | 'rect' | 'polygon';
export type IBrushMode = 'single' | 'multiple';

export type selectedItemStyle = {
  /**
   * 图元的图形类别
   */
  symbol?: SymbolType;
  /**
   * 图元的大小
   */
  symbolSize?: number;
  /**
   * 图元的颜色
   */
  color?: string;
  /**
   * 图元的颜色透明度
   */
  colorAlpha?: number;
} & Partial<IPolygonMarkSpec>;

export type BrushInteractiveRangeAttr = {
  interactiveRange: {
    minY: number;
    maxY: number;
    minX: number;
    maxX: number;
  };
  xRange: [number, number];
  yRange: [number, number];
};
