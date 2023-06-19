import type { SeriesTypeEnum } from '../../series/interface';
import type { IGradient } from '../../typings';

/** 色板总结构，包含数据色板和语义色板 */
export type IColorSchemeStruct = {
  /** 数据色板 */
  dataScheme: Array<DataSchemeItem> | ProgressiveDataScheme<DataSchemeItem>;

  /** 语义色板 */
  palette?: {
    /** 主色调（可选） */
    bandColor?: ColorSchemeItem;
    /** 背景颜色（可选） */
    background?: ColorSchemeItem;
    /** 其他的语义化色值 */
    [key: string]: ColorSchemeItem;
  };
};

/** 渐进式数据色板：由多个色板组成，应用时会依次调用色板的 `isAvailable` 回调，如果当前回调返回 true 则立即应用对应色板 */
export type ProgressiveDataScheme<T> = Array<IProgressiveDataSchemeCase<T>>;

export interface IProgressiveDataSchemeCase<T> {
  /** 可以配置回调，返回是否应用此色板 */
  isAvailable?: boolean | IsProgressiveDataSchemeAvailableCallback;
  /** 色板 */
  scheme: T[];
}

export type IsProgressiveDataSchemeAvailableCallback = (domain: any[]) => boolean;

/** 语义化色值的色值索引 */
export interface IColorKey {
  /** 颜色type声明 */
  type: 'palette';

  /** 颜色索引 */
  key: string;

  /** 明度系数（可选，0~1） */
  l?: number;

  /** 透明度系数（可选，0~1） */
  a?: number;
}

export type DataSchemeItem = string | IColorKey;

export type ColorSchemeItem = string | IGradient; // 纯色或渐变色

export type ColorScheme = Array<string> | ProgressiveDataScheme<string> | IColorSchemeStruct;

export type IThemeColorScheme = {
  /** 必选 */
  default: ColorScheme;
} & Partial<Record<SeriesTypeEnum, ColorScheme>>;
