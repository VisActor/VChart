import type { IBoundsLike } from '@visactor/vutils';
import type { IPoint, IPolarPoint, Quadrant, TextAlign, TextBaseLine } from '../typings';
import type { Datum } from '@visactor/vgrammar-core';
import { isValidNumber } from './type';
import { regressionLinear } from '@visactor/vgrammar-util';
import {
  isNumberClose,
  isGreater,
  isLess,
  isValid,
  PointService,
  median as visMedian,
  maxInArray,
  minInArray
} from '@visactor/vutils';
import { normalizeAngle, angleLabelOrientAttribute } from '@visactor/vutils-extension';
export const isClose = isNumberClose;
export { isGreater, isLess, normalizeAngle, angleLabelOrientAttribute };

/**
 * 极坐标系 -> 直角坐标系
 * @param point
 * @returns
 */
export function polarToCartesian(point: IPolarPoint): IPoint {
  if (!point.radius) {
    return { x: 0, y: 0 };
  }
  return {
    x: Math.cos(point.angle) * point.radius,
    y: Math.sin(point.angle) * point.radius
  };
}

/**
 * 根据角度计算象限
 * 计算角度所在象限
 * @param angle
 * @returns
 */
export function computeQuadrant(angle: number): Quadrant {
  angle = normalizeAngle(angle);
  if (angle > 0 && angle <= Math.PI / 2) {
    return 2;
  } else if (angle > Math.PI / 2 && angle <= Math.PI) {
    return 3;
  } else if (angle > Math.PI && angle <= (3 * Math.PI) / 2) {
    return 4;
  }
  return 1;
}

/**
 * 将角度轴起始角度 & 终结角度标准化
 * @param start
 * @param end
 * @returns
 */
export function normalizeStartEndAngle(
  start: number | null,
  end: number | null
): { startAngle: number; endAngle: number } {
  let startAngle: number = 0;
  let endAngle: number = Math.PI * 2;
  const isStartValid = isValid(start);
  const isEndValid = isValid(end);
  if (!isStartValid && !isEndValid) {
    startAngle = 0;
    endAngle = Math.PI * 2;
  } else if (!isEndValid) {
    startAngle = start as number;
    endAngle = (start as number) + Math.PI * 2;
  } else if (!isStartValid) {
    startAngle = (end as number) - Math.PI * 2;
    endAngle = end as number;
  } else {
    startAngle = start as number;
    endAngle = end as number;
  }

  while (endAngle <= startAngle) {
    endAngle += Math.PI * 2;
  }
  while (startAngle > Math.PI * 2) {
    startAngle -= Math.PI * 2;
    endAngle -= Math.PI * 2;
  }
  while (endAngle < 0) {
    startAngle += Math.PI * 2;
    endAngle += Math.PI * 2;
  }
  return { startAngle, endAngle };
}

export function outOfBounds(bounds: IBoundsLike, x: number, y: number) {
  return bounds.x1 > x || bounds.x2 < x || bounds.y1 > y || bounds.y2 < y;
}
export function min(data: any[], field?: string): number {
  const dataArray = data.map(d => +d[field]);
  if (dataArray.length === 0) {
    return null;
  }
  return minInArray(dataArray);
}

export function max(data: any[], field?: string): number {
  const dataArray = data.map(d => +d[field]);
  if (dataArray.length === 0) {
    return null;
  }
  return maxInArray(data.map(d => +d[field]).filter(d => isValidNumber(d)));
}

export function sum(data: any[], field?: string): number {
  return data.reduce((pre, _cur) => {
    const cur = field ? +_cur[field] : +_cur;
    if (isValidNumber(cur)) {
      pre += cur;
    }
    return pre;
  }, 0);
}

export function average(data: any[], field?: string): number {
  let sum = 0;
  let count = 0;
  data.forEach((x: any) => {
    const v = field ? +x[field] : +x;
    if (isValidNumber(v)) {
      sum += v;
      count++;
    }
  });

  const average = sum / count;
  return average;
}

export function variance(data: any[], field?: string): number {
  const averageNumber = average(data, field);

  if (data.length <= 1) {
    return 0;
  }

  const total = data.reduce((sum, cur) => sum + (field ? +cur[field] : +cur - averageNumber) ** 2, 0);
  const value = total / (data.length - 1);
  return value;
}

export function standardDeviation(data: any[], field?: string): number {
  const value = Math.sqrt(variance(data, field));
  return value;
}

export function median(data: any[], field?: string): number {
  const value = visMedian(data.map((datum: Datum) => datum[field]));
  return value;
}

export function regression(data: any[], fieldX?: string, fieldY?: string): any[] {
  const { predict } = regressionLinear(
    data,
    datum => datum[fieldX],
    datum => datum[fieldY]
  );
  // 计算回归线起点和终点
  const x1 = min(data, fieldX);
  const x2 = max(data, fieldX);

  const predict1 = predict(x1);
  const predict2 = predict(x2);
  return [
    {
      [fieldX]: x1,
      [fieldY]: predict1
    },
    {
      [fieldX]: x2,
      [fieldY]: predict2
    }
  ];
}

/**
 * 计算对应角度下的半径轴标签定位属性
 * @param angle 弧度角，需要注意是逆时针计算的
 * @returns
 */
export function radiusLabelOrientAttribute(angle: number) {
  let align: TextAlign = 'center';
  let baseline: TextBaseLine = 'middle';

  angle = normalizeAngle(angle);

  // right: 7/6 - 11/6; left: 1/6 - 5/6; center: 11/6 - 1/6 & 5/6 - 7/6
  if (angle >= Math.PI * (7 / 6) && angle <= Math.PI * (11 / 6)) {
    align = 'right';
  } else if (angle >= Math.PI * (1 / 6) && angle <= Math.PI * (5 / 6)) {
    align = 'left';
  } else {
    align = 'center';
  }

  // bottom: 5/3 - 1/3; top: 2/3 - 4/3; middle: 5/3 - 1/3 & 2/3 - 4/3
  if (angle >= Math.PI * (5 / 3) || angle <= Math.PI * (1 / 3)) {
    baseline = 'bottom';
  } else if (angle >= Math.PI * (2 / 3) && angle <= Math.PI * (4 / 3)) {
    baseline = 'top';
  } else {
    baseline = 'middle';
  }

  return { align, baseline };
}

/** 求一个向量顺时针旋转到另一个向量的角度，带正负号 */
export function vectorAngle(v1: IPoint, v2: IPoint) {
  const v1Length = distance(v1);
  const v2Length = distance(v2);
  // 叉乘
  const rho = Math.asin((v1.x * v2.y - v2.x * v1.y) / v1Length / v2Length);
  // 点乘
  const theta = Math.acos((v1.x * v2.x + v1.y * v2.y) / v1Length / v2Length);
  if (rho < 0) {
    return -theta;
  }
  return theta;
}

/** 求两个点的距离 */
export function distance(p1: IPoint, p2: IPoint = { x: 0, y: 0 }) {
  return PointService.distancePP(p1, p2);
}
