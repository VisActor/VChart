import type { IOrientType } from '../../../../typings';
import { Direction } from '../../../../typings';
import type { ICartesianAxisCommonSpec } from '../interface';
export declare function isXAxis(orient: IOrientType): boolean;
export declare function isYAxis(orient: IOrientType): boolean;
export declare function isZAxis(orient: IOrientType): boolean;
export declare function autoAxisType(orient: IOrientType, isHorizontal: boolean): 'linear' | 'band';
export declare function getOrient(spec: ICartesianAxisCommonSpec, whiteList?: string[]): IOrientType;
export declare function getDirectionByOrient(orient: IOrientType): Direction;
export declare function isOrientInSameDirection(orient1: IOrientType, orient2: IOrientType): boolean;
export declare function transformInverse(spec: ICartesianAxisCommonSpec, isHorizontal: boolean): boolean;
export declare function scaleWholeRangeSize(
  count: number,
  bandwidth: number,
  paddingInner: number,
  paddingOuter: number
): number;
export declare function bandSpace(count: number, paddingInner: number, paddingOuter: number): number;
