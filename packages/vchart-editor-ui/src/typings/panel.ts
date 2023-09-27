import type {
  ComponentConfig,
  IBaseComponentConfig,
  IFontFamilyComponentConfig,
  IFontStyleComponentConfig,
  ISelectComponentConfig,
  ISliderNumberComponentConfig,
  ISwitchComponentConfig,
  ITextAlignComponentConfig
} from './config';

export interface IPanelComponentSection<T extends IBaseComponentConfig> {
  label?: string;
  entries?: T[];
}

export interface IPanelComponentProps {
  label?: string;
  sections?: any;
  onChange?: (section: string, key: string, value: any) => void;
}

// Title Component

export interface ITitleComponentEntries {
  title?: IPanelComponentSection<ISliderNumberComponentConfig | IFontFamilyComponentConfig | IFontStyleComponentConfig>;
  subTitle?: IPanelComponentSection<
    ISwitchComponentConfig | ISliderNumberComponentConfig | IFontFamilyComponentConfig | IFontStyleComponentConfig
  >;
  align?: IPanelComponentSection<ISelectComponentConfig | ITextAlignComponentConfig>;
}

export interface ITitleComponentProps extends IPanelComponentProps {
  sections?: ITitleComponentEntries;
}

// Custom Component

export interface ICustomComponentProps extends IPanelComponentProps {
  sections?: Record<string, IPanelComponentSection<ComponentConfig>>;
}
