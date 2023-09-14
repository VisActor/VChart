import type {
  IBaseComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  ISliderNumberComponentConfig,
  ITextAlignComponentConfig
} from './config';

export interface IComponentSection {
  label?: string;
  entries?: IBaseComponentConfig[];
}

export interface IComponentProps {
  spec: any;
  sections?: any;
  onChange?: () => void;
}

// Title Component

export interface ITitleComponentEntries {
  title?: {
    label?: string;
    entries?: (ISliderNumberComponentConfig | IFontFamilyComponentConfig | IFontStyleComponentConfig)[];
  };
  subTitle?: {
    label?: string;
    entries?: (ISliderNumberComponentConfig | IFontFamilyComponentConfig | IFontStyleComponentConfig)[];
  };
  align?: {
    label?: string;
    entries?: ITextAlignComponentConfig[];
  };
}

export interface ITitleComponentProps extends IComponentProps {
  spec: any;
  label?: string;
  sections?: ITitleComponentEntries;
}
