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

  let total = 0;
  let max = -Infinity;
  for (let index = 0; index < data.length; index++) {
    const angleFieldValue = transformInvalidValue(data[index][angleField]);
    total += angleFieldValue;
    max = Math.max(angleFieldValue, max);
  }

  const intervalAngle = endAngle - startAngle;
  let lastAngle = startAngle;
  data.forEach(d => {
    const angleFieldValue = transformInvalidValue(d[angleField]);
    const ratio = total ? angleFieldValue / total : 0;
    const radian = ratio * intervalAngle;

    asRatio && (d[asRatio] = ratio);
    asStartAngle && (d[asStartAngle] = lastAngle);
    asEndAngle && (d[asEndAngle] = lastAngle + radian);
    asMiddleAngle && (d[asMiddleAngle] = lastAngle + radian / 2);
    asRadian && (d[asRadian] = radian);
    asQuadrant && (d[asQuadrant] = computeQuadrant(lastAngle + radian / 2));
    asK && (d[asK] = max ? angleFieldValue / max : 0);

    lastAngle = d[asEndAngle];
  });
  data[data.length - 1][asEndAngle] = endAngle;
  return data;
};
