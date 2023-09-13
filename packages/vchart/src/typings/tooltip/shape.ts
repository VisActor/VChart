import type { ShapeType } from '../shape';
import type { TooltipContentProperty } from './common';

export interface ITooltipShapePattern {
  /** 该 pattern 属于哪个系列id（用户不需要设置） */
  seriesId?: number;
  hasShape?: boolean;
  shapeType?: TooltipContentProperty<ShapeType | string>;
  /**
   * 形状填充颜色
   * @since 1.4.0
   */
  shapeFill?: TooltipContentProperty<string>;
  /**
   * 形状描边颜色
   * @since 1.4.0
   */
  shapeStroke?: TooltipContentProperty<string>;
  /**
   * 形状描边宽度
   * @since 1.4.0
   */
  shapeLineWidth?: TooltipContentProperty<number>;
  shapeSize?: TooltipContentProperty<number>;
  /** @deprecated 用户 spec 中建议用 shapeFill 代替，内部默认值可以维持使用 shapeColor */
  shapeColor?: TooltipContentProperty<string>;
  /** @deprecated */
  shapeHollow?: boolean;
}

export interface ITooltipShapeActual {
  hasShape?: boolean;
  shapeType?: ShapeType | string;
  /**
   * 形状填充颜色
   * @since 1.4.0
   */
  shapeFill?: string;
  /**
   * 形状描边颜色
   * @since 1.4.0
   */
  shapeStroke?: string;
  /**
   * 形状描边宽度
   * @since 1.4.0
   */
  shapeLineWidth?: number;
  shapeSize?: number;
  /** @deprecated 用户 spec 中建议用 shapeFill 代替，内部默认值可以维持使用 shapeColor */
  shapeColor?: string;
  /** @deprecated */
  shapeHollow?: boolean;
}
