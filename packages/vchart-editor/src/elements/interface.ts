import type { EditorMode, IEditorController, IEditorElement, IEditorLayer } from './../core/interface';
import type { IRect, IPoint } from '../typings/space';
import type { IGraphic } from '@visactor/vrender-core';

export interface IElementOption extends Partial<IElementData> {
  layer: IEditorLayer;
  id?: string | number;
  controller: IEditorController;
  mode: EditorMode;
  getAllLayers?: () => IEditorLayer[];
}

export interface IElementData {
  rect: IRect;
  anchor?: IPoint;
  id: string | number;
  type: string;
  attribute: {
    [key: string]: any;
  };
}

export interface IElement {
  getData: () => IElementData;
  release: () => void;
  onAfterRender: (callBack: () => void) => void;
  getEditorElementsConnectBox: (rect: IRect) => IEditorElement[];
  startEditorElement: (el: IEditorElement, e: PointerEvent) => void;
  clearCurrentEditorElement: () => void;
  readonly isRendered: boolean;

  pickable: boolean;
  overAble: boolean;
  tryPick: (e: VRenderPointerEvent) => void;
}

export type VRenderPointerEvent = PointerEvent & { target: Partial<IGraphic> } & { canvas: { x: number; y: number } };
