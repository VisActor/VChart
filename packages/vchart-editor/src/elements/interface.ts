import type { EditorMode, IEditorController, IEditorLayer } from './../core/interface';
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
  readonly isRendered: boolean;
}

export type VRenderPointerEvent = PointerEvent & { target: Partial<IGraphic> };
