import type {
  IBaseComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  ISelectComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from './config';

export interface IPanelComponentSection {
  label?: string;
  entries?: IBaseComponentConfig[];
}

export interface IPanelComponentProps {
  spec: any;
  sections?: any;
  onChange?: (section: string, key: string, value: any) => void;
}

// Title Component

export interface ITitleComponentEntries {
  title?: {
    label?: string;
    entries?: (ISliderNumberComponentConfig | IFontFamilyComponentConfig | IFontStyleComponentConfig)[];
  };
  subTitle?: {
    label?: string;
    entries?: (
      | ISwitchComponentConfig
      | ISliderNumberComponentConfig
      | IFontFamilyComponentConfig
      | IFontStyleComponentConfig
    )[];
  };
  align?: {
    label?: string;
    entries?: (ISelectComponentConfig | ITextAlignComponentConfig)[];
  };
}

export interface ITitleComponentProps extends IPanelComponentProps {
  spec: any;
  label?: string;
  sections?: ITitleComponentEntries;
}
