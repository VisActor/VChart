import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';
import { computeQuadrant } from '../../util';

export interface IPieOpt {
  angleField: string;

  startAngle: number;
  endAngle: number;

  asStartAngle: string;
  asEndAngle: string;
  asMiddleAngle: string;
  asRadian: string;
  asRatio: string;
  asQuadrant: string;
  asK: string;
}

export const pie = (originData: Array<DataView>, op: IPieOpt) => {
  const data = originData.map((datum: Datum) => ({ ...datum }));
  if (!data || data.length === 0) {
    return data;
  }
  const {
    angleField,
    startAngle,
    endAngle,
    asStartAngle,
    asEndAngle,
    asMiddleAngle,
    asRadian,
    asRatio,
    asQuadrant,
    asK
  } = op;

  const total = data.reduce((sum, d) => Number.parseFloat(d[angleField]) + sum, 0);
  const max = data.reduce((m, d) => Math.max(m, Number.parseFloat(d[angleField])), -Infinity);

  const intervalAngle = endAngle - startAngle;
  let lastAngle = startAngle;
  data.forEach(d => {
    const ratio = Number.parseFloat(d[angleField]) / total;
    const radian = ratio * intervalAngle;

    asRatio && (d[asRatio] = ratio);
    asStartAngle && (d[asStartAngle] = lastAngle);
    asEndAngle && (d[asEndAngle] = lastAngle + radian);
    asMiddleAngle && (d[asMiddleAngle] = lastAngle + radian / 2);
    asRadian && (d[asRadian] = radian);
    asQuadrant && (d[asQuadrant] = computeQuadrant(lastAngle + radian / 2));
    asK && (d[asK] = Number.parseFloat(d[angleField]) / max);

    lastAngle = d[asEndAngle];
  });
  data[data.length - 1][asEndAngle] = endAngle;
  return data;
};
