import type { IBoundsLike } from '@visactor/vutils';
import type { IPoint, IRect } from '../../typings/space';
import type { IElementOption } from './../interface';
import type { IParserValue } from './data/interface';
export interface IChartElementOption extends IElementOption {
  dataSource?: { type: string; value: IParserValue };
  temp?: string;
  renderCanvas: HTMLCanvasElement;
}
/**
 * 相对布局和绝对布局
 * 在相对布局结束后进行二次的绝对布局
 * 绝对布局会只根据 chart 进行相对处理
 */

export type ILayoutType = 'region-relative' | 'region' | 'normal' | 'absolute' | 'normal-inline';

export type IOrientType = 'left' | 'top' | 'right' | 'bottom' | 'z';

export interface ILayoutRectLevel {
  width: number;
  height: number;
}
/**
 * 因为这些元素都会继承到各个模块，所以这里统一有前缀避免语意冲突
 */
export interface ILayoutItem {
  userId: string | number;
  type: string;
  /**
   * 标记这个布局Item的方向（left->right, right->left, top->bottom, bottom->top）
   */
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
  layoutClip: boolean;
  layoutType: ILayoutType;
  layoutBindRegionID: number | number[];
  layoutOrient: IOrientType;

  layoutPaddingLeft: number;
  layoutPaddingTop: number;
  layoutPaddingRight: number;
  layoutPaddingBottom: number;

  layoutOffsetX: number;
  layoutOffsetY: number;

  // 越大越先处理
  layoutLevel: number;

  layoutZIndex: number;
  chartLayoutRect: IRect;

  /** 是否可见 */
  getVisible: () => boolean;

  /** 是否自动缩进 */
  getAutoIndent: () => boolean;
  getLayoutStartPoint: () => IPoint;
  getLayoutRect: () => IRect;
  getLastComputeOutBounds: () => IBoundsLike;

  /**
   * 更新元素布局的 layoutRect 大小，用来更新指定布局空间
   */
  setLayoutRect: (rect: Partial<IRect>, levelMap?: Partial<ILayoutRectLevel>) => void;
  /**
   * 基于元素内部逻辑计算占位空间，rect表示可用空间
   */
  computeBoundsInRect: (rect: IRect) => IRect;
  /**
   * 更新元素布局的起始点位置
   */
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  /**
   * 更新绝对布局元素的位置信息
   */
  absoluteLayoutInRect: (rect: IRect) => void;
  /**
   * 元素内部布局信息更新
   */
  updateLayoutAttribute: () => void;
}
