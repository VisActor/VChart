import type { ShapeType } from '../shape';
import type { TooltipContentCallback } from './common';

export interface ITooltipShapePattern {
  hasShape?: boolean;
  shapeType?: ShapeType | TooltipContentCallback;
  shapeColor?: string | TooltipContentCallback;
  shapeHollow?: boolean;
}

export interface ITooltipShapeActual {
  hasShape?: boolean;
  shapeType?: ShapeType;
  shapeColor?: string;
  shapeHollow?: boolean;
}
