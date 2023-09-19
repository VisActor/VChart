import type React from 'react';

// Editor Bar Panels
// export interface IEditorBarPanelProps {}

export interface IColorItemProps {
  color: string;
  size?: number;
}

export interface IEditorBarChartProps {
  chart: string;
  chartList: { type: string; icon: React.ReactNode; label: string }[];

  onChartChange?: (chart: string) => void;
}

export interface IEditorBarPaletteProps {
  palette: string[];
  paletteList: string[][];

  onPaletteChange?: (chart: string) => void;
}

export interface IEditorBarFillProps {
  fillColor: string;
  fillOpacity: number;
  onFillColorChange?: (color: string) => void;
  onFillOpacityChange?: (opacity: number) => void;
}

export type StrokeStyle = 'disable' | 'line' | 'dashedLine' | 'thinDashedLine';

export interface IEditorBarStrokeProps {
  strokeStyle: StrokeStyle;
  strokeWidth: number;
  strokeColor: string;
  strokeOpacity: number;
  onStrokeStyleChange?: (style: StrokeStyle) => void;
  onStrokeWidthChange?: (width: number) => void;
  onStrokeColorChange?: (color: string) => void;
  onStrokeOpacityChange?: (opacity: number) => void;
}

export interface IEditorBarTextColorProps {
  fillColor: string;
  backgroundColor: string;
  onFillColorChange?: (color: string) => void;
  onBackgroundColorChange?: (color: string) => void;
}

export interface IEditorBarFontSizeProps {
  fontSize: number;
  fontSizeList?: number[];
  onFontSizeChange?: (fontSize: number) => void;
}

// Editor Bar Component
export interface IEditorComponentProps {
  label?: string;
  style?: React.CSSProperties;
}
