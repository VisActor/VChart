import type { IGraphic, IGroup, IStage } from '@visactor/vrender-core';
import type { IElement, IElementData } from './../elements/interface';
import type { ILayoutAttribute, IRect } from '../typings/space';
import type { IModel } from '@visactor/vchart/esm/model/interface';
export interface ILayerData {
  id: string | number;
  type: 'chart' | string;
  elements: IElementData[];
}

export type IModelInfoSpecKey = {
  specKey: string;
  specIndex: number;
};
export type IModelInfo = IModelInfoSpecKey & {
  id?: string | number; // id in spec, model.userId
};

export type EditorMode = 'view' | 'editor';

export interface IEditorLayer {
  id: string | number;
  type: string;
  elements: IElement[];
  editorGroup: IGroup;
  activeElement: IEditorElement | IEditorElement[];

  getStage: () => IStage;
  getCanvas: () => HTMLCanvasElement;
  release: () => void;
}

export interface IEditorData {
  setDataKey: (key: string) => void;
  setLayers: (getLayers: () => IEditorLayer[]) => void;
  save: () => Promise<void>;
  load: () => Promise<ILayerData[]>;
  data: ILayerData[];
}

export interface IVChartEditorInitOption {
  id: string | number;
  dom: string | HTMLElement;
  data: IEditorData;
  mode: EditorMode;
}

export interface IUpdateAttributeParam {
  // 布局
  layout?: Partial<ILayoutAttribute>;
  // 模块spec更新
  spec?: {};
  // 色板
  color?: string[];

  // 添加line标注
  markLine?: {};
  // 添加area标注
  markArea?: {};

  // 更改图表类型
  chartType?: {};
}

export interface IEditorElement {
  type: 'chart' | 'group' | 'graphics';
  layer: IEditorLayer;
  id: string | number;
  rect?: IRect;
  part?: string;
  /**
   * vchart 模型实例
   */
  model: IModel;
  editProperties?: {
    // layout
    move?: boolean;
    rotate?: boolean;
    resize?: boolean | ([boolean, ...boolean[]] & { length: 8 });
    //
  } & { [key: string]: unknown };
  originSpec?: any;
  updateAttribute: (attr: IUpdateAttributeParam) => false | { [key: string]: unknown };
  editorFinish: () => void;
}

export type EditorHandlerFunc = (el: IEditorElement) => void;

export interface IEditorController {
  container: HTMLElement;
  setEditorElements: (el: IEditorElement, event: PointerEvent) => void;
  editorEnd: () => void;

  addStartHandler: (handler: EditorHandlerFunc) => void;
  removeStartHandler: (handler: EditorHandlerFunc) => void;
  addEndHandler: (handler: EditorHandlerFunc) => void;
  removeEndHandler: (handler: EditorHandlerFunc) => void;

  // over border
  setOverGraphic: (graphic: IGraphic, id: string | number, event: PointerEvent) => void;

  release: () => void;
}
