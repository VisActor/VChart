import type { IOrientType } from '../../../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../../../typings';
import { isValidOrient, merge } from '../../../../util';
import type { ICartesianAxisCommonSpec, ICartesianAxisTheme } from '../interface';

export function isXAxis(orient: IOrientType) {
  return orient === 'bottom' || orient === 'top';
}

// 自动推断轴类型，现在根据orient来判断
// TODO：后续可以根据数据特征推断
export function autoAxisType(orient: IOrientType, isHorizontal: boolean) {
  if (isHorizontal) {
    return isXAxis(orient) ? 'linear' : 'band';
  }
  return isXAxis(orient) ? 'band' : 'linear';
}

export const getCartesianAxisConfig = (direction: string, orient: IOrientType, theme: ICartesianAxisTheme) => {
  // 如果配置了 direction 发生了坐标轴转置需要进行处理，保持坐标轴配置一致
  const axisTheme =
    direction === Direction.horizontal
      ? isXAxis(orient)
        ? theme.axisY
        : theme.axisX
      : isXAxis(orient)
      ? theme.axisX
      : theme.axisY;
  return merge({}, theme.common, axisTheme);
};

export function isValidAxisType(type: string) {
  return (
    type === 'ordinal' ||
    type === 'linear' ||
    type === 'band' ||
    type === 'point' ||
    type === 'time' ||
    type === 'log' ||
    type === 'pow'
  );
}

export function getOrient(spec: ICartesianAxisCommonSpec): IOrientType {
  return isValidOrient(spec.orient) ? spec.orient : 'left';
}

export function getDirectionByOrient(orient: IOrientType) {
  return orient === 'top' || orient === 'bottom' ? Direction.horizontal : Direction.vertical;
}

export function isOrientInSameDirection(orient1: IOrientType, orient2: IOrientType) {
  return getDirectionByOrient(orient1) === getDirectionByOrient(orient2);
}
