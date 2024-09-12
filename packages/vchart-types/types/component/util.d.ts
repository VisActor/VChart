import type { Maybe } from '@visactor/vutils';
import type { ITheme } from '../theme';
import type { Datum } from '../typings';
import type { IModelSpecInfo } from '../model/interface';
export declare function getComponentThemeFromOption(type: string, chartTheme: ITheme): any;
export declare function getFormatFunction(formatMethod?: any, formatter?: string | string[], text?: string | number, datum?: Datum): {
    formatFunc: any;
    args: (string | number | Datum)[];
} | {
    formatFunc?: undefined;
    args?: undefined;
};
export declare const getSpecInfo: <T extends Record<string, any>>(chartSpec: any, specKey: string, compType: string, filter?: (spec: T) => boolean) => IModelSpecInfo<T>[];
