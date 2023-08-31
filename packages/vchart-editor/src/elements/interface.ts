import type { IRect, IPoint } from '../typings/space';

export interface IElementOption {
  rect: IRect;
  position?: IPoint;
  anchor?: IPoint;
}
