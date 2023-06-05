import type { SeriesTypeEnum } from '../../series/interface';
import type { IGradient } from '../../typings';

export type IColorSchemeStruct = {
  /** 主色调（可选） */
  bandColor?: ColorSchemeItem;
  /** 背景颜色（可选） */
  backgroundColor?: ColorSchemeItem;
  /** 数据色板，承载3.x版原有色板的功能 */
  dataScheme: ColorDataSchemeItem[];
} & {
  /** 其他的语义化颜色 */
  [key: string]: ColorSchemeItem;
};

/** 语义化颜色的色值索引 */
export interface IColorKey {
  /** 颜色type声明 */
  type: 'scheme';

  /** 颜色索引 */
  key: string;

  /** 明度系数（可选，0~1） */
  l?: number;

  /** 透明度系数（可选，0~1） */
  a?: number;
}

export type ColorDataSchemeItem = string | IColorKey;

export type ColorSchemeItem = string | IGradient; // 纯色或渐变色

export type ColorScheme = string[] | IColorSchemeStruct;

export type IThemeColorScheme = {
  /** 必选 */
  default: ColorScheme;
} & Partial<Record<SeriesTypeEnum, ColorScheme>>;
