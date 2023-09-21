import type { ILayoutData } from '../layout/interface';
import type { ISpec, ITheme } from '@visactor/vchart';

export interface IEditorSpec {
  theme: ITheme;
  temp: ISpec | unknown;
  layout: ILayoutData;
}

export interface ISpecProcess {
  getEditorSpec: () => {};
  updateEditorSpec: (spec: IEditorSpec) => void;
  // for each model
  updateTheme: (theme: ITheme) => void;
  updateTemp: (temp: string) => void;
  updateLayout: (layout: ILayoutData) => void;

  getVChartSpec: () => ISpec;

  clear: () => void;
}
