import type { IAxisHelper as CartesianHelper } from '../../component/axis/cartesian/interface/common';
import { SeriesTypeEnum } from '../interface/type';
import type { Datum } from '../../typings';
import { isContinuous } from '@visactor/vscale';
import type { IPolarAxisHelper } from '../../component/axis';

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
