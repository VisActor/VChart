import type { SeriesTypeEnum } from '../../series/interface';
import type {
  ColorScheme,
  ColorSchemeItem,
  IColorKey,
  IColorSchemeStruct,
  IThemeColorScheme,
  ProgressiveDataScheme
} from './interface';
export declare function getDataScheme(
  colorScheme: IThemeColorScheme,
  seriesType?: SeriesTypeEnum
): Array<ColorSchemeItem> | ProgressiveDataScheme<ColorSchemeItem>;
export declare function computeActualDataScheme(
  dataScheme: Array<ColorSchemeItem> | ProgressiveDataScheme<ColorSchemeItem>,
  colorDomain: any[]
): Array<ColorSchemeItem>;
export declare function queryColorFromColorScheme(
  colorScheme: IThemeColorScheme,
  colorKey: IColorKey,
  seriesType?: SeriesTypeEnum
): ColorSchemeItem | undefined;
export declare const getActualColor: (value: any, colorScheme?: IThemeColorScheme, seriesType?: SeriesTypeEnum) => any;
export declare function isColorKey(obj: any): obj is IColorKey;
export declare function isProgressiveDataColorScheme<T>(obj: any): obj is ProgressiveDataScheme<T>;
export declare function transformColorSchemeToStandardStruct(colorScheme: ColorScheme): IColorSchemeStruct;
