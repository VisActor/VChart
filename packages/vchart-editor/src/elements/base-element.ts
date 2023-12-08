import type { IEditorElement } from './../core/interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { IRect, IPoint } from '../typings/space';
import type { IElement, IElementData, IElementOption, VRenderPointerEvent } from './interface';
import { CreateID } from '../utils/common';
import type { EditorMode, ILayoutLine } from '../core/interface';
export abstract class BaseElement implements IElement {
  type: string = 'base';
  protected _rect: IRect;
  protected _anchor: IPoint;
  protected _opt: IElementOption;
  get option() {
    return this._opt;
  }

  protected _id: string | number;
  get id() {
    return this._id;
  }
  protected _mode: EditorMode = 'view';

  protected _afterRenderCallBack: () => void = null;
  protected _isRendered: boolean = false;
  get isRendered() {
    return this._isRendered;
  }

  protected _pickable: boolean = true;
  get pickable() {
    return this._pickable;
  }
  set pickable(v: boolean) {
    this._pickable = v;
  }

  protected _overAble: boolean = true;
  get overAble() {
    return this._overAble;
  }
  set overAble(v: boolean) {
    this._overAble = v;
  }

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

  abstract saveSnapshot(): void;
  abstract pushHistory(): void;

  abstract resize(rect: IRect): void;
  abstract move(pos: IPoint): void;

  abstract getBounds(): IBoundsLike;

  abstract getLayoutGuideLine(): ILayoutLine[];
  abstract moveBy(offsetX: number, offsetY: number): void;

  abstract getEditorElementsConnectBox(rect: IRect): IEditorElement[];
  abstract startEditorElement(el: IEditorElement, e: PointerEvent): void;
  abstract clearCurrentEditorElement(): void;
  abstract tryPick(e: VRenderPointerEvent): void;

  release() {
    this._afterRenderCallBack = null;
  }

  setModel(mode: EditorMode) {
    if (mode === this._mode) {
      return;
    }
    this._mode = mode;
    this._changeModel();
  }

  protected abstract _changeModel(): void;

  onAfterRender(callBack: () => void) {
    this._afterRenderCallBack = callBack;
  }

  protected _afterRender() {
    this._isRendered = true;
    this._afterRenderCallBack?.();
  }

  updateAttributeFromHistory(att: any, fromAttribute: any) {
    //do nothing
  }

  beforeDelete() {
    this._opt.editorData.pushHistoryNextTick({
      element: { layerId: this._opt.layer.id, id: this._id, type: this.type },
      from: this.getData(),
      to: null,
      use: this._opt.commonHistoryUse
    });
  }

  afterAdd() {
    this._opt.editorData.pushHistoryNextTick({
      element: { layerId: this._opt.layer.id, id: this._id, type: this.type },
      from: null,
      to: this.getData(),
      use: this._opt.commonHistoryUse
    });
  }

  getElementInfo() {
    return { layerId: this._opt.layer.id, id: this._id, type: this.type };
  }
}
