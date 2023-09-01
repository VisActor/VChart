import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';
import { computeQuadrant, couldBeValidNumber } from '../../util';

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

function transformInvalidValue(value: any) {
  if (!couldBeValidNumber(value)) {
    return 0;
  }
  return Number.parseFloat(value);
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

  const total = data.reduce((sum, d) => transformInvalidValue(d[angleField]) + sum, 0);
  const max = data.reduce((m, d) => Math.max(m, transformInvalidValue(d[angleField])), -Infinity);

  const intervalAngle = endAngle - startAngle;
  let lastAngle = startAngle;
  data.forEach(d => {
    const ratio = total ? transformInvalidValue(d[angleField]) / total : 0;
    const radian = ratio * intervalAngle;

    asRatio && (d[asRatio] = ratio);
    asStartAngle && (d[asStartAngle] = lastAngle);
    asEndAngle && (d[asEndAngle] = lastAngle + radian);
    asMiddleAngle && (d[asMiddleAngle] = lastAngle + radian / 2);
    asRadian && (d[asRadian] = radian);
    asQuadrant && (d[asQuadrant] = computeQuadrant(lastAngle + radian / 2));
    asK && (d[asK] = max ? transformInvalidValue(d[angleField]) / max : 0);

    lastAngle = d[asEndAngle];
  });
  data[data.length - 1][asEndAngle] = endAngle;
  return data;
};
