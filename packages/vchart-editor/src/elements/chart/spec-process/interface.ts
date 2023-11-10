import type { IChartTemp } from './../template/interface';
import type { IModelInfo } from './../../../core/interface';
import type { ILayoutData } from '../layout/interface';
import type { IMarkAreaSpec, IMarkLineSpec, ISpec, ITheme } from '@visactor/vchart';
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
  /**
   * 标注的信息
   */
  marker?: {
    markLine?: IMarkLineSpec[];
    markArea?: IMarkAreaSpec[];
  };
}

export interface ISpecProcess {
  specTemp: IChartTemp;
  getEditorSpec: () => IEditorSpec;
  updateEditorSpec: (spec: IEditorSpec) => void;
  updateElementAttribute: (model: IChartModel, attr: IUpdateAttributeParam, triggerHistory?: boolean) => boolean;
  // for each mode
  updateTheme: (theme: ITheme) => void;
  updateTemp: (temp: string) => void;
  updateLayout: (layout: ILayoutData) => void;
  // updateMarker: (markSpec: any, markType: string, id?: string | number) => void;

  getVChartSpec: () => ISpec;

  clearMarker: () => void;

  clear: () => void;

  saveSnapshot: () => void;
  pushHistory: () => void;
  updateAttributeFromHistory: (att: any) => void;
}
