import type { IAxisHelper as CartesianHelper } from './../../component/axis/cartesian/interface/common';
import { SeriesTypeEnum } from '../interface';
import type { Datum } from '../../typings';
import { isContinuous } from '@visactor/vscale';
import type { IPolarAxisHelper } from '../../component/axis';

/**
 * 将相对数值转换为绝对数值
 * @param originValue 原始值（相对值或绝对值）
 * @param total 总体值
 * @returns 实际绝对数值
 */
export const getActualNumValue = (originValue: number | string, total: number): number => {
  const originNumValue = Number(originValue);
  const originStrValue = originValue.toString();
  if (isNaN(originNumValue) && originStrValue[originStrValue.length - 1] === '%') {
    return total * (Number(originStrValue.slice(0, originStrValue.length - 1)) / 100);
  }
  return originNumValue;
};

export function isPolarAxisSeries(type: string) {
  return ([SeriesTypeEnum.rose, SeriesTypeEnum.radar, SeriesTypeEnum.circularProgress] as string[]).includes(type);
}

export function sortDataInAxisHelper(axisHelper: CartesianHelper | IPolarAxisHelper, field: string, dataList: Datum[]) {
  const scale = axisHelper.getScale(0);
  const isRevert = 'isInverse' in axisHelper ? axisHelper.isInverse() : false;
  if (isContinuous(scale.type)) {
    dataList.sort((datumA: Datum, datumB: Datum) => {
      return (datumA[field] - datumB[field]) * (isRevert ? -1 : 1);
    });
  } else {
    dataList.sort((datumA: Datum, datumB: Datum) => {
      // @ts-ignore TODO: vscale support api to get index
      return (scale._index.get(datumA[field]) - scale._index.get(datumB[field])) * (isRevert ? -1 : 1);
    });
  }
}
