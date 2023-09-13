import type { IGroup, IStage } from '@visactor/vrender';
import type { IElement, IElementData } from './../elements/interface';
import type { IRect } from '../typings/space';
export interface ILayerData {
  id: string | number;
  type: 'chart' | string;
  elements: IElementData[];
}

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
  save: () => void;
  load: () => ILayerData[];
  data: ILayerData[];
}

export interface IVChartEditorInitOption {
  id: string | number;
  dom: string | HTMLElement;
  data: IEditorData;
}

export interface IEditorElement {
  type: 'chart' | 'group' | 'graphics';
  layer: IEditorLayer;
  id: string | number;
  rect: IRect;
  part?: string;
  editProperties: {
    move: boolean;
    rotate: boolean;
    resize: boolean | ([boolean, ...boolean[]] & { length: 8 });
  };
  updateAttribute: (attr: { [key: string]: unknown }) => false | { [key: string]: unknown };
}

export type EditorHandlerFunc = (el: IEditorElement) => void;
