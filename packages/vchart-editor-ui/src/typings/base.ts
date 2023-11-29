import type { LineType } from './common';
import type {
  IBaseComponentConfig,
  IColorComponentConfig,
  IFontFamilyComponentConfig,
  IFontSizeComponentConfig,
  IFontStyleComponentConfig,
  IInputComponentConfig,
  ILineTypeComponentConfig,
  IPaletteComponentConfig,
  ISelectComponentConfig,
  IShapeComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from './config';

export interface IPanelTitleProps {
  label: string;
  tooltip?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed?: boolean) => void;
  enabled?: boolean;
  onEnabled?: (enabled?: boolean) => void;
}

export interface IEditorHeaderProps {
  label: string;
  tooltip?: string;
  collapsed?: boolean;
  enabled?: boolean;
  onEnabled?: (enabled?: boolean) => void;
  onCollapse?: (collapsed?: boolean) => void;
  onRefresh?: () => void;
}

export interface IBaseComponentProps<Config extends IBaseComponentConfig> {
  label: string;
  tooltip?: string;
  config?: Config;
  onChange?: (value: any) => void;
}

export interface ICustomComponentProps extends IBaseComponentProps<any> {
  value: any;
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

export interface IBaseNumberComponentProps extends IBaseComponentProps<ISliderNumberComponentConfig> {
  value: number;
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

export interface IBaseFontSizeComponentProps extends IBaseComponentProps<IFontSizeComponentConfig> {
  fontSize: number;
}

export interface IBaseFontStyleComponentProps extends IBaseComponentProps<IFontStyleComponentConfig> {
  bolder: boolean;
  underline: boolean;
  italic: boolean;
}

export interface IBaseTextAlignComponentProps extends IBaseComponentProps<ITextAlignComponentConfig> {
  textAlign: 'left' | 'center' | 'right';
}

export interface IBasePaletteComponentProps extends IBaseComponentProps<IPaletteComponentConfig> {
  palette: string[];
}

export interface IBaseLineTypeComponentProps extends IBaseComponentProps<ILineTypeComponentConfig> {
  lineType: LineType;
}

export interface IBaseShapeComponentProps extends IBaseComponentProps<IShapeComponentConfig> {
  shape: string;
}
