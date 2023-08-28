import type { ShapeType } from '../shape';
import type { TooltipContentProperty } from './common';

export interface ITooltipShapePattern {
  /** 该 pattern 属于哪个系列id（用户不需要设置） */
  seriesId?: number;
  hasShape?: boolean;
  shapeType?: TooltipContentProperty<ShapeType>;
  shapeColor?: TooltipContentProperty<string>;
  shapeHollow?: boolean;
  shapeSize?: TooltipContentProperty<number>;
}

export interface ITooltipShapeActual {
  hasShape?: boolean;
  shapeType?: ShapeType;
  shapeColor?: string;
  shapeHollow?: boolean;
  shapeSize?: number;
}
