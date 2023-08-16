import type { ShapeType } from '../shape';
import type { TooltipContentProperty } from './common';

export interface ITooltipShapePattern {
  hasShape?: boolean;
  shapeType?: TooltipContentProperty<ShapeType>;
  shapeColor?: TooltipContentProperty<string>;
  shapeHollow?: boolean;
}

export interface ITooltipShapeActual {
  hasShape?: boolean;
  shapeType?: ShapeType;
  shapeColor?: string;
  shapeHollow?: boolean;
}
