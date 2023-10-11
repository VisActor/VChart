import type { IModelInfo } from './../../../core/interface';
import type { ILayoutData } from '../layout/interface';
import type { ISpec, ITheme } from '@visactor/vchart';
import type { IUpdateAttributeParam } from '../../../core/interface';
import type { IChartModel } from '../interface';

export type IModelSpec = IModelInfo & {
  spec: any;
};

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
  updateElementAttribute: (model: IChartModel, attr: IUpdateAttributeParam) => boolean;
  // for each mode
  updateTheme: (theme: ITheme) => void;
  updateTemp: (temp: string) => void;
  updateLayout: (layout: ILayoutData) => void;

  getVChartSpec: () => ISpec;

  clear: () => void;
}
