import type { IAxisHelper as CartesianHelper } from '../../component/axis/cartesian/interface/common';
import type { Datum } from '../../typings';
import type { IPolarAxisHelper } from '../../component/axis';
export declare function isPolarAxisSeries(type: string): boolean;
export declare function sortDataInAxisHelper(
  axisHelper: CartesianHelper | IPolarAxisHelper,
  field: string,
  dataList: Datum[]
): void;
