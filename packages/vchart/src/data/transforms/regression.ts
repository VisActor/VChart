import type { DataView } from '@visactor/vdataset';
import { regression } from '../../util';

export type IOptionRegr = {
  fieldX: string;
  fieldY: string;
};

export function markerRegression(_data: Array<DataView>, opt: IOptionRegr) {
  const data = _data[0].latestData;

  return regression(data, opt.fieldX, opt.fieldY);
}
