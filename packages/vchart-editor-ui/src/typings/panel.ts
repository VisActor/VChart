import type React from 'react';
import type { ComponentConfig } from './config';

export interface IPanelSection {
  label?: string;
  tooltip?: string;
  entries?: ComponentConfig[];
}

export interface IPanelProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  tooltip?: string;
  sections?: any;
  initialSections?: any;
  onChange?: (section: string, key: string, value: any) => void;
  onRefresh?: (values: any) => void;
  enabled?: boolean;
  onEnabled?: (enabled: boolean) => void;
}

// Axis Panel

export interface IAxisPanelEntries {
  label?: IPanelSection;
  domain?: IPanelSection;
}

export interface IAxisPanelProps extends IPanelProps {
  sections?: IAxisPanelEntries;
}

// Data format Panel

export interface IDataFormatPanelEntries {
  format?: IPanelSection;
}

export interface IDataFormatPanelProps extends IPanelProps {
  sections?: IDataFormatPanelEntries;
}

// Label Panel

export interface ILabelPanelEntries {
  label?: IPanelSection;
}

export interface ILabelPanelProps extends IPanelProps {
  sections?: ILabelPanelEntries;
}

// Legend Panel

export interface ILegendPanelEntries {
  align?: IPanelSection;
  label?: IPanelSection;
}

export interface ILegendPanelProps extends IPanelProps {
  sections?: ILegendPanelEntries;
}

// Title Panel

export interface ITitlePanelEntries {
  title?: IPanelSection;
  subTitle?: IPanelSection;
  align?: IPanelSection;
}

export interface ITitlePanelProps extends IPanelProps {
  sections?: ITitlePanelEntries;
}

// Custom Panel

export interface ICustomPanelProps extends IPanelProps {
  sections: Record<string, IPanelSection>;
  sectionComponentMaps?: Record<string, Record<string, string>>;
}
