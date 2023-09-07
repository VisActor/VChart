import type { IEditorLayer } from './../core/interface';
import type { IRect, IPoint } from '../typings/space';

export interface IElementOption extends Partial<IElementData> {
  layer: IEditorLayer;
  id?: string | number;
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
}
