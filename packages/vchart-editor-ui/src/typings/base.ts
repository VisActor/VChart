import type {
  IBaseComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ISliderNumberComponentConfig
} from './config';

export interface IPanelTitleProps {
  label: string;
}

export interface IBaseComponentProps<Config extends IBaseComponentConfig> {
  label: string;
  config?: Config;
  onChange?: (value: any) => void;
}

export interface IBaseInputComponentProps extends IBaseComponentProps<IInputComponentConfig> {
  value: string;
}

export interface IBaseSliderNumberComponentProps extends IBaseComponentProps<ISliderNumberComponentConfig> {
  value: number;
}

export interface IBaseColorComponentProps extends IBaseComponentProps<ISliderNumberComponentConfig> {
  color: string;
}

export interface IBaseFontFamilyComponentProps extends IBaseComponentProps<IFontFamilyComponentConfig> {
  fontFamily: string;
}

export interface IBaseFontStyleComponentProps extends IBaseComponentProps<IFontStyleComponentConfig> {
  bolder: boolean;
  underline: boolean;
  italic: boolean;
}

export interface IBaseTextAlignComponentProps extends IBaseComponentProps<IFontStyleComponentConfig> {
  textAlign: 'left' | 'center' | 'right';
}
