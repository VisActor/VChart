import type { ILayoutData } from '../layout/interface';
import type { IChartSpec, ITheme } from '@visactor/vchart';
import type { IChartTemp } from '../temp/interface';

export interface IEditorSpec {
  theme: ITheme;
  temp: IChartSpec;
  layout: ILayoutData;
}

export interface ISpecProcess {
  getEditorSpec: () => {};
  updateEditorSpec: (spec: IEditorSpec) => void;
  // for each model
  updateTheme: (theme: ITheme) => void;
  updateTemp: (temp: IChartTemp) => void;
  updateLayout: (layout: ILayoutData) => void;

  getVChartSpec: () => IChartSpec;

  clear: () => void;
}
