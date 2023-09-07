import type { IStage } from '@visactor/vrender';
import type { IElement, IElementData } from './../elements/interface';
export interface ILayerData {
  id: string | number;
  type: 'chart' | string;
  elements: IElementData[];
}

export interface IEditorLayer {
  id: string | number;
  type: string;
  elements: IElement[];

  getStage: () => IStage;
  getCanvas: () => HTMLCanvasElement;
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
