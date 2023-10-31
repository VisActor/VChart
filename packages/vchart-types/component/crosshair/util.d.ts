import type { Tag } from '@visactor/vrender-components';
import type { IBoundsLike } from '@visactor/vutils';
import type { Datum } from '../../typings';
import type { IChart } from '../../chart/interface';
import type { ICrosshairTheme } from './interface';
import type { IModelOption } from '../../model/interface';
export declare function limitTagInBounds(shape: Tag, bounds: IBoundsLike): void;
export declare function getDatumByValue(
  data: Datum[],
  value: number,
  startField: string,
  endField?: string
): Datum | null;
export declare const getCartesianCrosshairTheme: (option: Partial<IModelOption>, chart: IChart) => ICrosshairTheme;
export declare const getPolarCrosshairTheme: (option: Partial<IModelOption>, chart: IChart) => ICrosshairTheme;
