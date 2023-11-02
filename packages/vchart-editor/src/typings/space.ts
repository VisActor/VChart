export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}
export interface ISize {
  width: number;
  height: number;
}

export enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export type DirectionType = keyof typeof Direction;

export interface ILayoutGuideLine {
  direction: DirectionType;
  pos: number;
}

export interface ILayoutAttribute {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  anchor: [number | string, number | string];
  dx?: number;
  dy?: number;
}
