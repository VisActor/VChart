import { PointService, isValidNumber, maxInArray, minInArray } from '@visactor/vutils';
import { median as visMedian } from '@visactor/vutils';
import type { Datum } from '../data/interface';

type Point = {
  x: number;
  y: number;
  [key: string]: any;
};

export function findClosestPoint(sourcePoint: Point, points: Point[]): Point {
  let closestPoint;
  let closestDistance = Infinity;

  points.forEach((point, index) => {
    const distance = PointService.distancePP(point, sourcePoint);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
    }
  });

  return closestPoint;
}

export function min(data: any[], field?: string): number {
  const dataArray: any[] = [];
  data.forEach(d => {
    const value = +d[field];
    if (isValidNumber(value)) {
      dataArray.push(value);
    }
  });
  if (dataArray.length === 0) {
    return null;
  }
  return minInArray(dataArray);
}

export function max(data: any[], field?: string): number {
  const dataArray: any[] = [];
  data.forEach(d => {
    const value = +d[field];
    if (isValidNumber(value)) {
      dataArray.push(value);
    }
  });
  if (dataArray.length === 0) {
    return null;
  }
  return maxInArray(dataArray);
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

export function median(data: any[], field?: string): number {
  const value = visMedian(data.map((datum: Datum) => datum[field]));
  return value;
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
