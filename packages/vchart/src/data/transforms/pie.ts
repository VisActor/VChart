import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';
import { couldBeValidNumber } from '../../util/type';
import { computeQuadrant, getPercentValue } from '../../util/math';
import { ARC_TRANSFORM_VALUE } from '../../constant/polar';

export interface IPieOpt {
  angleField: string;

  startAngle: number;
  endAngle: number;
  minAngle: number;

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
    minAngle,
    asStartAngle,
    asEndAngle,
    asMiddleAngle,
    asRadian,
    asRatio,
    asQuadrant,
    asK
  } = op;

  const appendArcInfo = (data: Datum, startAngle: number, angle: number) => {
    data[asStartAngle] = startAngle;
    data[asEndAngle] = startAngle + angle;
    data[asMiddleAngle] = startAngle + angle / 2;
    data[asRadian] = angle;
    data[asQuadrant] = computeQuadrant(startAngle + angle / 2);
  };

  let total = 0;
  let max = -Infinity;
  for (let index = 0; index < data.length; index++) {
    const angleFieldValue = transformInvalidValue(data[index][angleField]);
    total += angleFieldValue;
    max = Math.max(angleFieldValue, max);

    data[index][ARC_TRANSFORM_VALUE] = angleFieldValue;
  }

  const valueList = data.map(d => Number(d[angleField]));
  const angleRange = endAngle - startAngle;
  let lastAngle = startAngle;
  let restAngle = angleRange;
  let largeThanMinAngleTotal = 0;
  const percents = getPercentValue(valueList);

  data.forEach((d, i) => {
    const angleFieldValue = d[ARC_TRANSFORM_VALUE];
    const ratio = total ? angleFieldValue / total : 0;
    let radian = ratio * angleRange;

    if (radian < minAngle) {
      radian = minAngle;
      restAngle -= minAngle;
    } else {
      largeThanMinAngleTotal += angleFieldValue;
    }

    const dStartAngle = lastAngle;
    const dEndAngle = lastAngle + radian;

    d[asRatio] = ratio;
    d[asK] = max ? angleFieldValue / max : 0;
    d._percent_ = percents[i];
    appendArcInfo(d, dStartAngle, radian);

    lastAngle = dEndAngle;
  });

  if (restAngle < angleRange) {
    if (restAngle <= 1e-3) {
      const angle = angleRange / data.length;
      data.forEach((d, index) => {
        appendArcInfo(d, startAngle + index * angle, angle);
      });
    } else {
      const unitRadian = restAngle / largeThanMinAngleTotal;
      lastAngle = startAngle;
      data.forEach(d => {
        const angle = d[asRadian] === minAngle ? minAngle : d[ARC_TRANSFORM_VALUE] * unitRadian;
        appendArcInfo(d, lastAngle, angle);

        lastAngle += angle;
      });
    }
  }

  if (total !== 0) {
    // 数据都为 0 时，起始角和结束角相同，不应该强制赋值
    // 防止一个扇区的角度会因为浮点数精度问题和传入的 endAngle 不相等
    data[data.length - 1][asEndAngle] = endAngle;
  }
  return data;
};
