import type { IOrientType } from '../../../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../../../typings/space';
import { isValid } from '@visactor/vutils';
import { isValidOrient } from '../../../../util/space';
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
  // 这里处理下 direction === 'horizontal' 下的 Y 轴
  // 因为 Y 轴绘制的时候默认是从下至上绘制的，但是在 direction === 'horizontal' 场景下，图表应该是按照从上至下阅读的
  // 所以这里在这种场景下坐标轴会默认 inverse 已达到效果
  let inverse = spec.inverse;
  if (isHorizontal && !isXAxis(spec.orient)) {
    inverse = isValid(spec.inverse) ? !spec.inverse : true;
  }
  return inverse;
}

// FIXME: 等 vscale 暴露这两个方法后，删掉这两个方法

/** 计算 scale 的实际 range 长度 */
export function scaleWholeRangeSize(count: number, bandwidth: number, paddingInner: number, paddingOuter: number) {
  if (paddingInner === 1) {
    paddingInner = 0; // 保护
    // FIXME: vscale 同样需要加保护，目前这里加了保护以后，在 paddingInner为 1 的情况还是会崩溃
  }
  const space = bandSpace(count, paddingInner, paddingOuter);
  const step = bandwidth / (1 - paddingInner);
  const wholeSize = space * step;
  return wholeSize;
}

export function bandSpace(count: number, paddingInner: number, paddingOuter: number): number {
  let space;
  // count 等于 1 时需要特殊处理，否则 step 会超出 range 范围
  // 计算公式: step = paddingOuter * step * 2 + paddingInner * step + bandwidth
  if (count === 1) {
    space = count + paddingOuter * 2;
  } else {
    space = count - paddingInner + paddingOuter * 2;
  }
  return count ? (space > 0 ? space : 1) : 0;
}
