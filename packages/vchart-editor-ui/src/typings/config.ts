// Base component config

import type React from 'react';
import type { ICustomComponentProps } from './base';

export interface IBaseComponentConfig {
  key: string;
  label?: string;
  default?: any;
  value?: any;
}

export interface IInputComponentConfig extends IBaseComponentConfig {
  default?: string;
  value?: string;
  singleline?: boolean;
  placeholder?: string;
  trigger?: 'change' | 'blur';
}

export interface ISelectComponentConfig extends IBaseComponentConfig {
  default?: string;
  value?: string;
  options?: { value: string; label: string }[];
}

export interface ISwitchComponentConfig extends IBaseComponentConfig {
  default?: boolean;
  value?: boolean;
  options?: { value: string; label: string }[];
}

export interface ISliderNumberComponentConfig extends IBaseComponentConfig {
  default?: number;
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
}

export interface IColorComponentConfig extends IBaseComponentConfig {
  default?: string;
  value?: string;
}

export interface IFontFamilyComponentConfig extends IBaseComponentConfig {
  default?: string;
  value?: string;
  options?: { value: string; label: string }[];
}

export interface IFontSizeComponentConfig extends IBaseComponentConfig {
  default?: number;
  value?: number;
  min?: number;
  max?: number;
}

export interface IFontStyleComponentConfig extends IBaseComponentConfig {
  default?: { bold: boolean; underline: boolean; italic: boolean };
  value?: { bold: boolean; underline: boolean; italic: boolean };
}

export interface ITextAlignComponentConfig extends IBaseComponentConfig {
  default?: 'left' | 'center' | 'right';
  value?: 'left' | 'center' | 'right';
}

export interface ICustomBaseComponentConfig extends IBaseComponentConfig {
  default?: any;
  value?: any;
  component: React.ComponentType<ICustomComponentProps>;
  [key: string]: any;
}

export type ComponentConfig =
  | IInputComponentConfig
  | ISelectComponentConfig
  | ISwitchComponentConfig
  | ISliderNumberComponentConfig
  | IColorComponentConfig
  | IFontFamilyComponentConfig
  | IFontStyleComponentConfig
  | ITextAlignComponentConfig
  | ICustomBaseComponentConfig;
