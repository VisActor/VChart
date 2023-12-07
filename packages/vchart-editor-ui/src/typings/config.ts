// Base component config

import type React from 'react';
import type { ICustomComponentProps } from './base';
import type { LineType } from './common';

export interface IBaseComponentConfig {
  key: string;
  label?: string;
  tooltip?: string;
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

export interface INumberComponentConfig extends IBaseComponentConfig {
  default?: number;
  value?: number;
  unit?: string;
  step?: number;
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
  default?: 'left' | 'center' | 'right' | string;
  value?: 'left' | 'center' | 'right' | string;
  alignOptions?: [string, string, string];
}

export interface IPaletteComponentConfig extends IBaseComponentConfig {
  default?: string[];
  palettes?: string[][];
}

export interface ILineTypeComponentConfig extends IBaseComponentConfig {
  default?: LineType;
}

export interface IShapeComponentConfig extends IBaseComponentConfig {
  default?: string;
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