import type React from 'react';

// Editor Bar Panels
// export interface IEditorBarPanelProps {}

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

export interface IEditorBarFontSizeProps {
  fontSize: number;
  fontSizeList: number[];

  onFontSizeChange?: (fontSize: number) => void;
}

// Editor Bar Component
export interface IEditorComponentProps {
  label?: string;
}
