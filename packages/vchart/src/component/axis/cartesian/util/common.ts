import type { IOrientType } from '../../../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../../../typings';
import { isValid, isValidOrient } from '../../../../util';
import type { ICartesianAxisCommonSpec } from '../interface';

export function isXAxis(orient: IOrientType) {
  return orient === 'bottom' || orient === 'top';
}

export function isYAxis(orient: IOrientType) {
  return orient === 'left' || orient === 'right';
}

export function isZAxis(orient: IOrientType) {
  return orient === 'z';
}

// 自动推断轴类型，现在根据orient来判断
// TODO：后续可以根据数据特征推断
export function autoAxisType(orient: IOrientType, isHorizontal: boolean) {
  if (isHorizontal) {
    return isXAxis(orient) ? 'linear' : 'band';
  }
  return isXAxis(orient) ? 'band' : 'linear';
}

export function getOrient(spec: ICartesianAxisCommonSpec, whiteList?: string[]): IOrientType {
  return isValidOrient(spec.orient) || (whiteList && whiteList.includes(spec.orient)) ? spec.orient : 'left';
}

export function getDirectionByOrient(orient: IOrientType) {
  return orient === 'top' || orient === 'bottom' ? Direction.horizontal : Direction.vertical;
}

export function isOrientInSameDirection(orient1: IOrientType, orient2: IOrientType) {
  return getDirectionByOrient(orient1) === getDirectionByOrient(orient2);
}

export function transformInverse(spec: ICartesianAxisCommonSpec, isHorizontal: boolean) {
  if (isHorizontal && !isXAxis(spec.orient)) {
    spec.inverse = isValid(spec.inverse) ? !spec.inverse : true;
  }
  return spec;
}
