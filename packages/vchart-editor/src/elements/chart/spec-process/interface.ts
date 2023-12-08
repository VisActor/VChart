import type { IDataParser } from './../data/interface';
import type { IChartTemp } from './../template/interface';
import type { IModelInfo } from './../../../core/interface';
import type { ILayoutData } from '../layout/interface';
import type { IMarkAreaSpec, IMarkLineSpec, ISpec, ITheme } from '@visactor/vchart';
import type { IUpdateAttributeParam } from '../../../core/interface';
import type { IChartModel } from '../interface';
import type { EventEmitter } from '@visactor/vutils';

export type IModelSpec = IModelInfo & {
  spec: any;
};

export interface IEditorSpec {
  theme: ITheme;
  temp: ISpec | any;
  layout: ILayoutData;
  color: string[];
  modelSpec: IModelSpec[];
  data: { type: string; value: any };
  /**
   * 标注的信息
   */
  marker?: {
    markLine?: IMarkLineSpec[];
    markArea?: IMarkAreaSpec[];
  };
}

export interface IDataTempTransform {
  readonly specTemp: IChartTemp;
  readonly dataParser: IDataParser;
  updateChartDataTemp: (data: { type: string; value: unknown }, temp: string) => void;
}

export interface ISpecProcess {
  dataTempTransform: IDataTempTransform;
  emitter: EventEmitter;
  getEditorSpec: () => IEditorSpec;
  clearEditorSpec: () => void;
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
  clearSnapshot: () => void;
  updateAttributeFromHistory: (att: any, fromAttribute: any) => void;
}
