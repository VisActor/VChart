import type { IBoundsLike } from '@visactor/vutils';
import type { IRect, IPoint, ILayoutGuideLine } from '../typings/space';
import type { IElementData, IElementOption } from './interface';
import { CreateID } from '../utils/common';
import type { EditorMode } from '../core/interface';
export abstract class BaseElement {
  type: string = 'base';
  protected _rect: IRect;
  protected _anchor: IPoint;
  protected _opt: IElementOption;

  protected _id: string | number;
  protected _mode: EditorMode = 'view';

  constructor(opt: IElementOption) {
    this._opt = opt;
    this._id = opt.id ?? CreateID();
    this._mode = opt.mode;
  }

  initWithOption() {
    this._rect = this._opt.rect;
    if (!this._rect) {
      this._rect = { x: 50, y: 50, width: 100, height: 100 };
    }
    this._anchor = this._opt.anchor ?? { x: 0, y: 0 };
  }

  setRect(rect: IRect) {
    this._rect = rect;
  }
  setAnchor(anchor: IPoint) {
    this._anchor = anchor;
  }

  getData(): IElementData {
    return {
      id: this._id,
      rect: this._rect,
      type: this.type,
      anchor: this._anchor,
      attribute: {}
    };
  }

  abstract resize(rect: IRect): void;
  abstract move(pos: IPoint): void;

  abstract getBounds(): IBoundsLike;

  abstract getLayoutGuideLine(): ILayoutGuideLine[];

  abstract release(): void;

  setModel(mode: EditorMode) {
    if (mode === this._mode) {
      return;
    }
    this._mode = mode;
    this._changeModel();
  }

  protected abstract _changeModel(): void;
}
