import type { IPointLike } from '@visactor/vutils';
export declare function getInsertPoints(
  start: IPointLike,
  end: IPointLike,
  direction: 'top' | 'bottom' | 'left' | 'right',
  offset?: number
): IPointLike[];
export declare function getTextOffset(
  start: IPointLike,
  end: IPointLike,
  direction: 'top' | 'bottom' | 'left' | 'right',
  offset?: number
):
  | {
      dx: number;
      dy: number;
    }
  | {
      dx?: undefined;
      dy?: undefined;
    };
