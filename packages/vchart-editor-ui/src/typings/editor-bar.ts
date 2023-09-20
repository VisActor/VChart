import type React from 'react';

// Editor Bar Panels
// export interface IEditorBarPanelProps {}

export interface IColorItemProps {
  color: string;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}

export interface IEditorBarEntryProps {
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export type ChartEntry = { type: string; icon: React.ReactNode; label: string };

export interface IEditorBarChartProps {
  chart: string;
  chartList: ChartEntry[];

  onChartChange?: (chart: string) => void;
}

export interface IEditorBarPaletteProps {
  palette: string[];
  paletteList: string[][];

  onPaletteChange?: (palette: string[]) => void;
}

export type Fill = {
  color: string;
  opacity: number;
};

export interface IEditorBarFillProps {
  fill: Fill;
  fillColorList?: string[];
  onFillChange?: (fill: Fill) => void;
}

export interface Stroke {
  color: string;
  opacity: number;
  lineWidth: number;
  style: 'disable' | 'line' | 'dashedLine' | 'thinDashedLine';
}

export interface IEditorBarStrokeProps {
  stroke: Stroke;
  onStrokeChange?: (stroke: Stroke) => void;
}

export type TextColor = {
  color: string;
  backgroundColor: string;
};

export interface IEditorBarTextColorProps {
  textColor: TextColor;
  onTextColorChange?: (textColor: TextColor) => void;
}

export interface IEditorBarFontSizeProps {
  fontSize: number;
  fontSizeList?: number[];
  onFontSizeChange?: (fontSize: number) => void;
}

// Editor Bar Component

export interface IBaseEditorComponentProps {
  style?: React.CSSProperties;
  onToolChange?: (tool: string) => void;
}

export interface IEditorComponentProps extends IBaseEditorComponentProps {
  chartList?: ChartEntry[];
  paletteList?: string[][];
  onEditData?: () => void;
  onMore?: () => void;
  onChartChange?: (chart: string) => void;
  onPaletteChange?: (palette: string[]) => void;
  onFillChange?: (fill: Fill) => void;
  onStrokeChange?: (stroke: Stroke) => void;
  onComment?: () => void;
}

export interface IColorEditorComponentProps extends IBaseEditorComponentProps {
  onFillChange?: (fill: Fill) => void;
  onStrokeChange?: (stroke: Stroke) => void;
  onComment?: () => void;
}

export interface ILineEditorComponentProps extends IBaseEditorComponentProps {
  onStrokeChange?: (stroke: Stroke) => void;
  onComment?: () => void;
}

export interface ITextEditorComponentProps extends IBaseEditorComponentProps {
  fontSizeList?: number[];
  onTextColorChange?: (textColor: TextColor) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onBoldChange?: (bold: boolean) => void;
  onComment?: () => void;
}

export interface IEditorBarEntry {
  key: string;
  default?: any;
  onChange?: (value?: any) => void;
  divide?: boolean;
}

export interface IEditorBarChartEntry extends IEditorBarEntry {
  default: string;
  chartList: ChartEntry[];
}

export interface IEditorBarPaletteEntry extends IEditorBarEntry {
  default: string[];
  paletteList: string[][];
}

export interface IEditorBarFontSizeEntry extends IEditorBarEntry {
  default: number;
  fontSizeList: number[];
}

export interface ICustomEditorComponentProps extends IBaseEditorComponentProps {
  entries: (IEditorBarEntry | IEditorBarChartEntry | IEditorBarPaletteEntry | IEditorBarFontSizeEntry)[];
  onChange?: (key: string, value?: any) => void;
}
