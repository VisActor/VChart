import type { SymbolType } from '@visactor/vrender';

export enum ShapeTypeEnum {
  circle = 'circle',
  triangle = 'triangle',
  triangleUp = 'triangleUp',
  triangleLeft = 'triangleLeft',
  triangleRight = 'triangleRight',
  triangleDown = 'triangleDown',
  thinTriangle = 'thinTriangle',
  rect = 'rect',
  diamond = 'diamond',
  square = 'square',
  arrowLeft = 'arrowLeft',
  arrow2Left = 'arrow2Left',
  arrowRight = 'arrowRight',
  arrow2Right = 'arrow2Right',
  cross = 'cross',
  wedge = 'wedge',
  star = 'star',
  wye = 'wye'
}

export type ShapeType = SymbolType;

export const ShapeTypes = [
  'circle',
  'triangle',
  'triangleUp',
  'triangleDown',
  'triangleLeft',
  'triangleRight',
  'thinTriangle',
  'diamond',
  'square',
  'rect',
  'arrowLeft',
  'arrow2Left',
  'arrowRight',
  'arrow2Right',
  'cross',
  'wedge',
  'star',
  'wye'
];

export interface IShapeStyle {
  shape?: ShapeType;
  size?: number;
}
