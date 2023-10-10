import type { IEditorElement } from './../../../core/interface';
import type { ILayoutData } from '../layout/interface';
import type { ISpec, ITheme } from '@visactor/vchart';
import type { IUpdateAttributeParam } from '../../../core/interface';

export interface IModelSpec {
  specKey: string;
  id: string;
  index: number;
  spec: any;
}

export interface IEditorSpec {
  theme: ITheme;
  temp: ISpec | any;
  layout: ILayoutData;
  color: string[];
  modelSpec: IModelSpec[];
}

export interface ISpecProcess {
  getEditorSpec: () => {};
  updateEditorSpec: (spec: IEditorSpec) => void;
  updateElementAttribute: (el: IEditorElement, attr: IUpdateAttributeParam) => boolean;
  // for each mode
  updateTheme: (theme: ITheme) => void;
  updateTemp: (temp: string) => void;
  updateLayout: (layout: ILayoutData) => void;

  getVChartSpec: () => ISpec;

  clear: () => void;
}
