import type { IChart } from '../../../../chart/interface';
import type { ILayoutPoint } from '../../../../model/interface';
import type { IDimensionInfo } from '../interface';
export declare const getPolarDimensionInfo: (chart: IChart | undefined, pos: ILayoutPoint) => IDimensionInfo[] | null;
