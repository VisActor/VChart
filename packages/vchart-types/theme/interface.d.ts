import type { ILayoutPaddingSpec } from '../model/interface';
import type { ISeriesTheme } from '../series/interface';
import type { IMarkTheme } from '../typings/spec';
import type {
  IArcMarkSpec,
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec,
  IPathMarkSpec
} from '../typings';
import type { MarkTypeEnum } from '../mark/interface';
import type { IColorKey, IThemeColorScheme } from './color-scheme/interface';
import type { IGradientColor } from '@visactor/vrender-core';
import type { IComponentTheme } from '../component/interface';
export interface ITheme {
  name?: string;
  description?: string;
  type?: 'light' | 'dark';
  background?: string | IGradientColor | IColorKey;
  padding?: ILayoutPaddingSpec;
  fontFamily?: string;
  colorScheme?: IThemeColorScheme;
  mark?: IGlobalMarkThemeByType;
  markByName?: IGlobalMarkThemeByName;
  series?: ISeriesTheme;
  animationThreshold?: number;
  component?: IComponentTheme;
}
export interface IGlobalMarkThemeByType {
  [MarkTypeEnum.line]?: Partial<IMarkTheme<ILineMarkSpec>>;
  [MarkTypeEnum.symbol]?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  [MarkTypeEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
  [MarkTypeEnum.rect]?: Partial<IMarkTheme<IRectMarkSpec>>;
  [MarkTypeEnum.arc]?: Partial<IMarkTheme<IArcMarkSpec>>;
  [MarkTypeEnum.text]?: Partial<IMarkTheme<ITextMarkSpec>>;
  [MarkTypeEnum.path]?: Partial<IMarkTheme<IPathMarkSpec>>;
}
export interface IGlobalMarkThemeByName {
  line?: Partial<IMarkTheme<ILineMarkSpec>>;
  point?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  area?: Partial<IMarkTheme<IAreaMarkSpec>>;
  bar?: Partial<IMarkTheme<IRectMarkSpec>>;
  label?: Partial<IMarkTheme<ITextMarkSpec>>;
  [markName: string]: Partial<IMarkTheme<any>>;
}
export interface IThemeConstants {
  defaultFontFamily: string;
  defaultFontSize: number;
  l1FontSize: number;
  l1LineHeight: number | string;
  l2FontSize: number;
  l2LineHeight: number | string;
  l3FontSize: number;
  l3LineHeight: number | string;
  l4FontSize: number;
  l4LineHeight: number | string;
  l5FontSize: number;
  l5LineHeight: number | string;
  l6FontSize: number;
  l6LineHeight: number | string;
  axisTickSize: number;
  areaOpacity: number;
}
