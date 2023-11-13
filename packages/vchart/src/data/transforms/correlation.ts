import { isNil, isNumber, degreeToRadian, isArray } from '@visactor/vutils';
import { field as getFieldAccessor, extent, toPercent } from '@visactor/vgrammar-util';
import { CORRELATION_X, CORRELATION_Y, CORRELATION_SIZE } from '../../constant';

export interface ICorrelationOpt {
  field: string;
  radiusField?: string;
  radiusRange?: [number, number];
  center?: [string | number, string | number];
  startAngle?: number;
  endAngle?: number;
  innerRadius?: string | number;
  outerRadius?: string | number;
}

export interface CircularRelationItem {
  x: number;
  y: number;
  size: number;
  datum: any;
}

export const correlation = (data: any, options: any) => {
  if (!data || !options?.view || !isArray(data)) {
    return data;
  }

  const viewBox = options.view();

  if (
    viewBox.x1 - viewBox.x0 === 0 ||
    viewBox.y1 - viewBox.y0 === 0 ||
    viewBox.x1 - viewBox.x0 === -Infinity ||
    viewBox.x1 - viewBox.x0 === Infinity ||
    viewBox.y1 - viewBox.y0 === -Infinity ||
    viewBox.y1 - viewBox.y0 === Infinity
  ) {
    return data;
  }

  const startAngle = degreeToRadian(options.startAngle ?? -90);
  const endAngle = degreeToRadian(options.endAngle ?? 270);
  const maxRadius = Math.max((viewBox.x1 - viewBox.x0) / 2, (viewBox.y1 - viewBox.y0) / 2);
  const innerRadius = toPercent(options.innerRadius ?? 0, maxRadius);
  const outerRadius = toPercent(options.outerRadius, maxRadius);

  const center = [
    isNumber(options.center?.[0])
      ? options.center[0]
      : viewBox.x0 + toPercent(options.center?.[0] ?? '50%', viewBox.x1 - viewBox.x0),
    isNumber(options.center?.[1])
      ? options.center[1]
      : viewBox.y0 + toPercent(options.center?.[1] ?? '50%', viewBox.y1 - viewBox.y0)
  ] as [number, number];
  const fieldAccessor = getFieldAccessor(options.field);
  const values = data.map(fieldAccessor);
  const [min, max] = extent(values);
  const radiusScale =
    min === max
      ? (val: number) => (innerRadius + outerRadius) / 2
      : (val: number) => innerRadius + ((outerRadius - innerRadius) * (val - min)) / (max - min);

  const sizeAccessor = !isNil(options.radiusField) ? getFieldAccessor(options.radiusField) : fieldAccessor;
  const defaultSize = options?.radiusRange?.[1] ?? 5;
  let sizeScale = (datum: any) => defaultSize;

  if (sizeAccessor) {
    const [minSize, maxSize] = sizeAccessor !== fieldAccessor ? extent(data.map(sizeAccessor)) : [min, max];
    const minR = options.radiusRange?.[0] ?? 5;
    const maxR = options.radiusRange?.[1] ?? 5;

    if (minSize !== maxSize) {
      sizeScale = (datum: any) => minR + ((maxR - minR) * (sizeAccessor(datum) - minSize)) / (maxSize - minSize);
    }
  }

  const minAngle = Math.min(startAngle, endAngle);
  const maxAngle = Math.max(startAngle, endAngle);
  const angles = getPartialAngles(minAngle, maxAngle, data.length);

  const res: CircularRelationItem[] = [];
  const searchStep = 60;
  const searchAngle = (maxAngle - minAngle) / searchStep;

  data.forEach((datum, index) => {
    const radius = radiusScale(values[index] as number);
    const size = sizeScale(datum);
    let x: number;
    let y: number;
    let angle = angles[index];

    for (let i = 0; i < searchStep; i++) {
      x = center[0] + radius * Math.cos(angle);
      y = center[1] + radius * Math.sin(angle);

      if (
        hasOverlap({ x, y, size }, res) ||
        x - size < viewBox.x0 ||
        x + size > viewBox.x1 ||
        y - size < viewBox.y0 ||
        y + size > viewBox.y1
      ) {
        if (i < searchStep - 1) {
          angle += searchAngle;

          if (angle > maxAngle) {
            angle = minAngle;
          } else if (angle < minAngle) {
            angle = maxAngle;
          }
        }
        continue;
      } else {
        break;
      }
    }

    res.push({ [CORRELATION_X]: x, [CORRELATION_Y]: y, [CORRELATION_SIZE]: size, ...datum });
  });
  return res;
};

const getPartialAngles = (minAngle: number, maxAngle: number, count: number) => {
  let offsetAngle = 0;
  let stepCount = Math.max(Math.ceil((2 * (maxAngle - minAngle)) / Math.PI), 2);
  let stepAngle = (maxAngle - minAngle) / stepCount;
  let stepIndex = 0;
  let stepSign = 1;
  let i = 0;
  let j = 0;
  const res: number[] = [];
  let startAngle = minAngle;

  while (i < count) {
    if (j < stepCount) {
      res.push(startAngle + (j % 2 ? Math.floor(j / 2) + Math.floor(stepCount / 2) : j / 2) * stepAngle * stepSign);
      j++;
    }

    i++;

    if (j === stepCount) {
      j = 0;
      stepIndex += 1;
      stepSign *= -1;

      if (offsetAngle === 0) {
        offsetAngle = stepAngle / 2;
      } else {
        offsetAngle /= 2;
      }
      startAngle = stepSign === -1 ? maxAngle - offsetAngle : minAngle + offsetAngle;

      if (stepIndex >= 2) {
        stepAngle /= 2;
        stepCount *= 2;
      }
    }
  }

  return res;
};

const hasOverlap = (item: Omit<CircularRelationItem, 'datum'>, arr: CircularRelationItem[]) => {
  if (!arr || !arr.length) {
    return false;
  }

  return arr.some(entry => {
    return Math.pow(item.x - entry.x, 2) + Math.pow(item.y - entry.y, 2) < Math.pow(item.size + entry.size, 2);
  });
};
