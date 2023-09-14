import type { LanguageEnum } from '../util/i18n';

export interface IBaseComponentConfig {
  key: string;
  label?: string;
  default?: any;
}

export interface ISliderNumberComponentConfig extends IBaseComponentConfig {
  default?: number;
  min?: number;
  max?: number;
}

export interface IFontFamilyComponentConfig extends IBaseComponentConfig {
  default?: string;
  options?: { value: string; label: string }[];
}

export interface IFontStyleComponentConfig extends IBaseComponentConfig {
  default?: { bold: boolean; underline: boolean; italic: boolean };
}

export interface IEditorComponentConfig {
  label: string;
  entries: IBaseComponentConfig[];
}

export interface ITitleEditorComponentConfig extends IEditorComponentConfig {
  entries: (ISliderNumberComponentConfig | IFontFamilyComponentConfig | IFontStyleComponentConfig)[];
}
