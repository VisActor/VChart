import type {
  IBaseComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  ISliderNumberComponentConfig
} from './config';

export interface IBaseComponentProps<Config extends IBaseComponentConfig> {
  label: string;
  config?: Config;
  onChange?: (value: any) => void;
}

export interface ISliderNumberComponentProps extends IBaseComponentProps<ISliderNumberComponentConfig> {
  value: number;
}

export interface IBaseFontFamilyComponentProps extends IBaseComponentProps<IFontFamilyComponentConfig> {
  fontFamily?: string;
}

export interface IBaseFontStyleComponentProps extends IBaseComponentProps<IFontStyleComponentConfig> {
  bolder?: boolean;
  underline?: boolean;
  italic?: boolean;
}
