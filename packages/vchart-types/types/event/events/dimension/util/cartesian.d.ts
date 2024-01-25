import type { IChart } from '../../../../chart/interface';
import type { IDimensionInfo } from '../interface';
import type { CartesianAxis } from '../../../../component/axis/cartesian';
import type { ICartesianSeries } from '../../../../series/interface';
import type { ILayoutPoint } from '../../../../typings/layout';
export declare const getCartesianDimensionInfo: (chart: IChart | undefined, pos: ILayoutPoint, isTooltip?: boolean) => IDimensionInfo[] | null;
export declare const getDimensionInfoByPosition: (axis: CartesianAxis, posValue: number, posKey: 'x' | 'y', getDimensionField: (series: ICartesianSeries) => string | string[]) => IDimensionInfo | null;
export declare const getDimensionInfoByValue: (axis: CartesianAxis, value: any, getDimensionField?: (series: ICartesianSeries) => string | string[]) => IDimensionInfo | null;
