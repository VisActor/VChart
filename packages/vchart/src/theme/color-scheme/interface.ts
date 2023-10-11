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
    backgroundColor?: ColorSchemeItem;
    /** 其他的语义化色值 */
    [key: string]: ColorSchemeItem;
  };
};

/** 渐进式数据色板：由多个色板组成，应用时会依次调用色板的 `isAvailable` 回调，如果当前回调返回 true 则立即应用对应色板 */
export type ProgressiveDataScheme<T> = Array<IProgressiveDataSchemeCase<T>>;

export interface IProgressiveDataSchemeCase<T> {
  /** 可选，适合此色板的 domain 数量 */
  maxDomainLength?: number;
  /** 可选，自定义回调，返回是否应用此色板，将覆盖 maxDomainLength 等配置 */
  isAvailable?: boolean | IsProgressiveDataSchemeAvailableCallback;
  /** 色板 */
  scheme: T[];
}

export type IsProgressiveDataSchemeAvailableCallback = (domain: any[]) => boolean;

/** 语义化色值的色值索引 */
export interface IColorKey {
  /** 颜色type声明 */
  type: 'palette';

  /** 颜色 token */
  key: string;

  /** 明度系数（可选，0~1） */
  l?: number;

  /** 透明度系数（可选，0~1） */
  a?: number;

  /**
   * 默认色值，在没有取到 key 对应的色值时返回
   * @since 1.3.0
   */
  default?: ColorSchemeItem;
}

export type DataSchemeItem = string | IColorKey;

export type ColorSchemeItem = string | IGradient; // 纯色或渐变色

export type ColorScheme = Array<string> | ProgressiveDataScheme<string> | IColorSchemeStruct;

export type IThemeColorScheme = {
  /** 必选 */
  default: ColorScheme;
} & Partial<Record<SeriesTypeEnum, ColorScheme>> &
  Partial<Record<SeriesTypeForThemeEnum, ColorScheme>>;

/** 带有方向信息的系列类型 */
export enum SeriesTypeForThemeEnum {
  area_horizontal = 'area_horizontal',
  area_vertical = 'area_vertical',

  line_horizontal = 'line_horizontal',
  line_vertical = 'line_vertical',

  bar_horizontal = 'bar_horizontal',
  bar_vertical = 'bar_vertical',

  bar3d_horizontal = 'bar3d_horizontal',
  bar3d_vertical = 'bar3d_vertical',

  rangeColumn_horizontal = 'rangeColumn_horizontal',
  rangeColumn_vertical = 'rangeColumn_vertical',

  rangeColumn3d_horizontal = 'rangeColumn3d_horizontal',
  rangeColumn3d_vertical = 'rangeColumn3d_vertical',

  rangeArea_horizontal = 'rangeArea_horizontal',
  rangeArea_vertical = 'rangeArea_vertical',

  linearProgress_horizontal = 'linearProgress_horizontal',
  linearProgress_vertical = 'linearProgress_vertical',

  boxPlot_horizontal = 'boxPlot_horizontal',
  boxPlot_vertical = 'boxPlot_vertical',

  sankey_horizontal = 'sankey_horizontal',
  sankey_vertical = 'sankey_vertical',

  waterfall_horizontal = 'waterfall_horizontal',
  waterfall_vertical = 'waterfall_vertical'
}
