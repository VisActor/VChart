import { ITextGraphicAttribute, getTextBounds } from '@visactor/vrender-core';
import { clampRadian, isGreater, isLess, polarToCartesian } from '@visactor/vutils';

interface IPoint {
  x: number;
  y: number;
}

type Vector2 = [number, number];

// FIXME: vrender 更新后，删掉重复方法，使用 vrender-component 中的方法

export const getVerticalCoord = (point: IPoint, center: IPoint, offset: number, inside: boolean): IPoint => {
  const vector = getVerticalVector(offset, point, center, inside);
  return {
    x: point.x + vector[0],
    y: point.y + vector[1]
  };
};

export const getVerticalVector = (
  offset: number,
  point: IPoint,
  center: IPoint,
  inside = false,
  axisInside = false
): [number, number] => {
  const vector: [number, number] = [point.x - center.x, point.y - center.y];
  return scale(vector, ((inside ? -1 : 1) * (axisInside ? -1 : 1) * offset) / length(vector));
};

/**
 * Scales a vec2 by a scalar number
 */
export function scale(vector: Vector2, scale: number): Vector2 {
  return [vector[0] * scale, vector[1] * scale];
}

/**
 * Calculates the length of a vec2
 */
export function length(vector: Vector2) {
  const [x, y] = vector;
  return Math.sqrt(x * x + y * y);
}

export function getLabelPos(
  angle: number,
  center: IPoint,
  radius: number,
  labelOffset: number,
  inside: boolean,
  text: string | number,
  style: Partial<ITextGraphicAttribute>
) {
  const point = polarToCartesian({ x: 0, y: 0 }, radius, angle);
  const labelPoint = getVerticalCoord(point, center, labelOffset, inside);
  const vector = getVerticalVector(labelOffset || 1, labelPoint, center, inside);
  return getLabelPosition(labelPoint, vector, text, style);
}

export function getLabelPosition(
  tickPosition: IPoint,
  tickVector: [number, number],
  text: string | number,
  style: Partial<ITextGraphicAttribute>
) {
  const labelBounds = getTextBounds({
    text,
    ...style
  });
  const width = labelBounds.width();
  const height = labelBounds.height();
  const angle = clampRadian(Math.atan2(tickVector[1], tickVector[0])) - Math.PI;

  const PI_3_4 = (Math.PI * 3) / 4;
  const PI_1_4 = Math.PI / 4;
  const PI_1_2 = Math.PI / 2;

  // x
  const baseX = tickPosition.x;
  let dx = 0;
  if (isInRange(angle, -PI_3_4, -PI_1_4)) {
    dx = ((angle + PI_3_4) / PI_1_2 - 0.5) * width;
  } else if (isInRange(angle, PI_1_4, PI_3_4)) {
    dx = (0.5 - (angle - PI_1_4) / PI_1_2) * width;
  } else if (Math.cos(angle) >= 0) {
    dx = width * 0.5;
  } else {
    dx = -width * 0.5;
  }
  const x = baseX - dx;

  const baseY = tickPosition.y;
  let dy = 0;
  if (isInRange(angle, -PI_3_4, -PI_1_4)) {
    dy = -height * 0.5;
  } else if (isInRange(angle, PI_1_4, PI_3_4)) {
    dy = height * 0.5;
  } else if (Math.cos(angle) >= 0) {
    dy = (0.5 - (PI_1_4 - angle) / PI_1_2) * height;
  } else {
    dy = (0.5 - clampRadian(angle - PI_3_4) / PI_1_2) * height;
  }
  const y = baseY - dy;

  return { x, y };
}

// 判断数值是否在制定范围内，包含误差
export function isInRange(a: number, min: number, max: number) {
  return !isLess(a, min, 0, 1e-6) && !isGreater(a, max, 0, 1e-6);
}
