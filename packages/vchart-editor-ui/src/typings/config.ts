export interface IBaseComponentConfig {
  key: string;
  label?: string;
  default?: any;
}

export interface IInputComponentConfig extends IBaseComponentConfig {
  default?: string;
  placeholder?: string;
}

export interface ISelectComponentConfig extends IBaseComponentConfig {
  default?: string;
  options?: { value: string; label: string }[];
}

export interface ISwitchComponentConfig extends IBaseComponentConfig {
  default?: boolean;
  options?: { value: string; label: string }[];
}

export interface ISliderNumberComponentConfig extends IBaseComponentConfig {
  default?: number;
  min?: number;
  max?: number;
}

export interface IColorComponentConfig extends IBaseComponentConfig {
  default?: string;
}

export interface IFontFamilyComponentConfig extends IBaseComponentConfig {
  default?: string;
  options?: { value: string; label: string }[];
}

export interface IFontStyleComponentConfig extends IBaseComponentConfig {
  default?: { bold: boolean; underline: boolean; italic: boolean };
}

export interface ITextAlignComponentConfig extends IBaseComponentConfig {
  default?: 'left' | 'center' | 'right';
}
