import type { ShapeType } from '../shape';
import type { TooltipContentProperty } from './common';
export interface ITooltipShapePattern {
  seriesId?: number;
  hasShape?: boolean;
  shapeType?: TooltipContentProperty<ShapeType | string>;
  shapeFill?: TooltipContentProperty<string>;
  shapeStroke?: TooltipContentProperty<string>;
  shapeLineWidth?: TooltipContentProperty<number>;
  shapeSize?: TooltipContentProperty<number>;
  shapeColor?: TooltipContentProperty<string>;
  shapeHollow?: boolean;
}
export interface ITooltipShapeActual {
  hasShape?: boolean;
  shapeType?: ShapeType | string;
  shapeFill?: string;
  shapeStroke?: string;
  shapeLineWidth?: number;
  shapeSize?: number;
  shapeColor?: string;
  shapeHollow?: boolean;
}
