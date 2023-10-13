import { PointService } from '@visactor/vutils';

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
