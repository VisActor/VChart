import type {
  IBaseComponentConfig,
  IColorComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ISelectComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from './config';

export interface IPanelTitleProps {
  label: string;
}

export interface IEditorHeaderProps {
  label: string;
  checked?: boolean;
  collapsed?: boolean;
  onCheck?: () => void;
  onCollapse?: () => void;
  onRefresh?: () => void;
}

export interface IBaseComponentProps<Config extends IBaseComponentConfig> {
  label: string;
  config?: Config;
  onChange?: (value: any) => void;
}

export interface IBaseInputComponentProps extends IBaseComponentProps<IInputComponentConfig> {
  value: string;
}

export interface IBaseSelectComponentProps extends IBaseComponentProps<ISelectComponentConfig> {
  value: string;
}

export interface IBaseSwitchComponentProps extends IBaseComponentProps<ISwitchComponentConfig> {
  value: boolean;
}

export interface IBaseSliderNumberComponentProps extends IBaseComponentProps<ISliderNumberComponentConfig> {
  value: number;
}

export interface IBaseColorComponentProps extends IBaseComponentProps<IColorComponentConfig> {
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

export interface IBaseTextAlignComponentProps extends IBaseComponentProps<ITextAlignComponentConfig> {
  textAlign: 'left' | 'center' | 'right';
}
