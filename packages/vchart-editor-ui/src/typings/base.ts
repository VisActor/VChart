import type { IBaseComponentConfig } from './config';

export interface IBaseComponentProps {
  label?: string;
  config?: IBaseComponentConfig;
  onChange?: (value: any) => void;
}

export interface IBaseFontSizeComponentProps extends IBaseComponentProps {
  fontSize?: number;
  min?: number;
  max?: number;
}

export interface ISliderNumberComponentProps extends IBaseComponentProps {
  value?: number;
  min?: number;
  max?: number;
}

export interface IBaseFontFamilyComponentProps extends IBaseComponentProps {
  fontFamily?: string;
}

export interface IBaseFontStyleComponentProps extends IBaseComponentProps {
  bolder?: boolean;
  underline?: boolean;
  italic?: boolean;
}
