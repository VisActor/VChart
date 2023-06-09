import {
  isNumberClose,
  isGreater,
  isLess,
  degreeToRadian,
  radianToDegree,
  isValid,
  PointService,
  median as visMedian
} from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { IBoundsLike } from '@visactor/vutils';
import type { IPoint, IPolarPoint, Quadrant, TextAlign, TextBaseLine } from '../typings';
import { isValidNumber } from './type';
import { regressionLinear } from '@visactor/vgrammar-util';
import type { Datum } from '@visactor/vgrammar';

export const isClose = isNumberClose;
export { isGreater, isLess };

/**
 * 角度标准化处理
 * @param angle 弧度角
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
}

export const radians = (angle?: number) => {
  if (!isValidNumber(angle)) {
    return null;
  }
  return degreeToRadian(angle);
};
export const degrees = (angle?: number) => {
  if (!isValidNumber(angle)) {
    return null;
  }
  return radianToDegree(angle);
};

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
 * 计算圆弧上的点坐标
 * @param x0 圆心 x 坐标
 * @param y0 圆心 y 坐标
 * @param radius 圆弧半径
 * @param radian 点所在弧度
 */
export function circlePoint(x0: number, y0: number, radius: number, radian: number): IPoint {
  const offset = polarToCartesian({
    radius,
    angle: radian
  });
  return {
    x: x0 + offset.x,
    y: y0 + offset.y
  };
}

/**
 * 计算圆弧两点之间连接线的长度
 * @param radius 圆弧半径
 * @param radian 圆弧弧度
 */
export function arcConnectLength(radius: number, radian: number) {
  const x0 = 0;
  const y0 = radius;
  const { x: x1, y: y1 } = circlePoint(0, 0, radius, radian);
  return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
}

/**
 * 计算直线与圆交点
 * 直线方程：ax + by + c = 0
 * 圆方程：(x - x0)^2 + (y - y0)^2 = r^2
 */
export function lineCirclePoints(a: number, b: number, c: number, x0: number, y0: number, r: number): IPoint[] {
  if ((a === 0 && b === 0) || r <= 0) {
    return [];
  }
  if (a === 0) {
    const y1 = -c / b;
    const fy = (y1 - y0) ** 2;
    const fd = r ** 2 - fy;
    if (fd < 0) {
      return [];
    } else if (fd === 0) {
      return [{ x: x0, y: y1 }];
    }
    const x1 = Math.sqrt(fd) + x0;
    const x2 = -Math.sqrt(fd) + x0;
    return [
      { x: x1, y: y1 },
      { x: x2, y: y1 }
    ];
  } else if (b === 0) {
    const x1 = -c / a;
    const fx = (x1 - x0) ** 2;
    const fd = r ** 2 - fx;
    if (fd < 0) {
      return [];
    } else if (fd === 0) {
      return [{ x: x1, y: y0 }];
    }
    const y1 = Math.sqrt(fd) + y0;
    const y2 = -Math.sqrt(fd) + y0;
    return [
      { x: x1, y: y1 },
      { x: x1, y: y2 }
    ];
  }
  const fa = (b / a) ** 2 + 1;
  const fb = 2 * ((c / a + x0) * (b / a) - y0);
  const fc = (c / a + x0) ** 2 + y0 ** 2 - r ** 2;
  const fd = fb ** 2 - 4 * fa * fc;
  if (fd < 0) {
    return [];
  }
  const y1 = (-fb + Math.sqrt(fd)) / (2 * fa);
  const y2 = (-fb - Math.sqrt(fd)) / (2 * fa);
  const x1 = -(b * y1 + c) / a;
  const x2 = -(b * y2 + c) / a;
  if (fd === 0) {
    return [{ x: x1, y: y1 }];
  }
  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 }
  ];
}

/**
 * 根据圆弧两点连接线长度计算弧度
 * @param radius 圆弧半径
 * @param length 连接线长度
 */
export function connectLineRadian(radius: number, length: number) {
  if (length > radius * 2) {
    return NaN;
  }
  return Math.asin(length / 2 / radius) * 2;
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

export function isQuadrantLeft(quadrant: Quadrant): boolean {
  return quadrant === 3 || quadrant === 4;
}

export function isQuadrantRight(quadrant: Quadrant): boolean {
  return quadrant === 1 || quadrant === 2;
}

export function checkBoundsOverlap(boundsA: IBoundsLike, boundsB: IBoundsLike): boolean {
  const { x1: ax1, y1: ay1, x2: ax2, y2: ay2 } = boundsA;
  const { x1: bx1, y1: by1, x2: bx2, y2: by2 } = boundsB;
  return !(
    (ax1 <= bx1 && ax2 <= bx1) ||
    (ax1 >= bx2 && ax2 >= bx2) ||
    (ay1 <= by1 && ay2 <= by1) ||
    (ay1 >= by2 && ay2 >= by2)
  );
}

export function outOfBounds(bounds: IBoundsLike, x: number, y: number) {
  return bounds.x1 > x || bounds.x2 < x || bounds.y1 > y || bounds.y2 < y;
}

export function insideBounds(bounds: IBoundsLike, x: number, y: number) {
  return !outOfBounds(bounds, x, y);
}

export function min(data: any[], field?: string): number {
  const initialData = field ? +data[0][field] : +data[0];

  if (!isValidNumber(initialData)) {
    throw new Error('invalid data');
  }
  const min = data.reduce((pre, _cur) => {
    const cur = field ? +_cur[field] : +_cur;
    if (isValidNumber(cur) && cur < pre) {
      pre = cur;
    }
    return pre;
  }, initialData);
  return min;
}

export function max(data: any[], field?: string): number {
  const initialData = field ? +data[0][field] : +data[0];
  if (!isValidNumber(initialData)) {
    throw new Error('invalid data');
  }
  const max = data.reduce((pre, _cur) => {
    const cur = field ? +_cur[field] : +_cur;
    if (isValidNumber(cur) && cur > pre) {
      pre = cur;
    }
    return pre;
  }, initialData);
  return max;
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
 * 计算对应角度下的角度轴标签定位属性
 * @param angle 弧度角，需要注意是逆时针计算的
 * @returns
 */
export function angleLabelOrientAttribute(angle: number) {
  let align: TextAlign = 'center';
  let baseline: TextBaseLine = 'middle';

  angle = normalizeAngle(angle);

  // left: 5/3 - 1/3; right: 2/3 - 4/3; center: 5/3 - 1/3 & 2/3 - 4/3
  if (angle >= Math.PI * (5 / 3) || angle <= Math.PI * (1 / 3)) {
    align = 'left';
  } else if (angle >= Math.PI * (2 / 3) && angle <= Math.PI * (4 / 3)) {
    align = 'right';
  } else {
    align = 'center';
  }

  // bottom: 7/6 - 11/6; top: 1/6 - 5/6; middle: 11/6 - 1/6 & 5/6 - 7/6
  if (angle >= Math.PI * (7 / 6) && angle <= Math.PI * (11 / 6)) {
    baseline = 'bottom';
  } else if (angle >= Math.PI * (1 / 6) && angle <= Math.PI * (5 / 6)) {
    baseline = 'top';
  } else {
    baseline = 'middle';
  }

  return { align, baseline };
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
