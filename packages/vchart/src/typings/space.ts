export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type IOrientType = 'left' | 'top' | 'right' | 'bottom';

// FIXME: 也许用 周向|径向 circumferential | radial 更好？
export type IPolarOrientType = 'radius' | 'angle';

export interface IPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export type DirectionType = keyof typeof Direction;
