import type { ITheme } from '../theme';
import type { Datum } from '../typings';
export declare function getComponentThemeFromOption(type: string, chartTheme: ITheme): any;
export declare function getFormatFunction(formatMethod?: any, formatter?: string | string[], text?: string | number, datum?: Datum): {
    formatFunc: any;
    args: (string | number | Datum)[];
} | {
    formatFunc?: undefined;
    args?: undefined;
};
