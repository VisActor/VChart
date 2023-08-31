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

export enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export type DirectionType = keyof typeof Direction;

export interface ILayoutGuideLine {
  direction: DirectionType;
  pos: number;
}
