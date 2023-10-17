import { Bounds } from '@visactor/vutils';
import type { EditorMode, IEditorElement, IEditorLayer, ILayoutLine } from './interface';
import type { IStage, IGroup } from '@visactor/vrender-core';
import { createGroup, createStage } from '@visactor/vrender-core';
import { CreateID } from '../utils/common';
import { TriggerEvent } from './const';
import type { BaseElement } from '../elements/base-element';
import type { IPoint } from '../typings/space';

export class EditorLayer implements IEditorLayer {
  type: string = 'default';
  _triggerElement: any = null;
  // _stage:
  getEventTriggerElement() {
    return this._triggerElement;
  }
  protected _id: string | number;
  get id() {
    return this._id;
  }

  protected _canvas: HTMLCanvasElement;
  protected _stage: IStage;
  getStage() {
    return this._stage;
  }

  getCanvas() {
    return this._canvas;
  }

  protected _container: HTMLElement;

  protected _isTrigger: boolean = false;
  get isTrigger() {
    return this._isTrigger;
  }

  protected _isInActive: boolean = false;
  get isInActive() {
    return this._isInActive;
  }

  protected _elements: BaseElement[] = [];
  get elements() {
    return this._elements;
  }

  protected _editorGroup: IGroup;
  get editorGroup() {
    return this._editorGroup;
  }

  protected _activeElement: IEditorElement | IEditorElement[];
  get activeElement() {
    return this._activeElement;
  }

  protected _elementReadyCallBack: () => void = null;

  protected _isElementReady: boolean = true;
  get isElementReady() {
    return this._isElementReady;
  }

  protected _mode: EditorMode = 'view';

  protected _offsetX: number = 0;
  get offsetY() {
    return this._offsetX;
  }
  protected _offsetY: number = 0;
  get offsetX() {
    return this._offsetY;
  }
  protected _scale: number = 1;
  get scale() {
    return this._scale;
  }

  constructor(container: HTMLElement, mode: EditorMode, id?: string | number) {
    this._id = id ?? CreateID();
    this._container = container;
    this._mode = mode;
    this.initCanvas();
    this.initEvent();
    this.initEditorGroup();
  }

  moveTo(x: number, y: number) {
    if (this._mode !== 'editor') {
      return;
    }
    this._offsetX = x;
    this._offsetY = y;
    this._stage.defaultLayer.setAttributes({
      x,
      y
    });
  }
  scaleTo(s: number) {
    if (this._mode !== 'editor') {
      return;
    }
    this._scale = s;
    this._stage.defaultLayer.setAttributes({
      scaleX: s,
      scaleY: s
    });
  }

  resizeLayer(width: number, height: number, x: number, y: number, scale: number) {
    this._offsetX = x;
    this._offsetY = y;
    this._scale = scale;
    this._stage.defaultLayer.setAttributes({
      x,
      y,
      scaleX: scale,
      scaleY: scale
    });
    this._canvas.style.width = width + 'px';
    this._canvas.style.height = height + 'px';
    this._canvas.width = width;
    this._canvas.height = height;

    this._container.style.width = width + 'px';
    this._container.style.height = height + 'px';
  }

  transformPosInLayer(pos: IPoint) {
    // pos in layer
    const inLayer = { x: pos.x - this._offsetX, y: pos.y - this._offsetY };
    return {
      x: inLayer.x / this._scale,
      y: inLayer.y / this._scale
    };
  }

  release() {
    this._stage.release();
    this._elements.forEach(el => el.release());
    this._elements = null;
    this._editorGroup = null;
    this._elementReadyCallBack = null;
  }

  initEditorGroup() {
    const group = createGroup({
      x: 0,
      y: 0,
      pickable: false,
      zIndex: 999999
    });
    this._stage.defaultLayer.add(group);
    this._editorGroup = group;
  }

  protected initCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this._container.clientWidth;
    canvas.height = this._container.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.pointerEvents = 'none';
    canvas.id = `_vchart_editor_layer_${this._id}_canvas`;
    this._container.appendChild(canvas);
    this._canvas = canvas;

    const stage = createStage({
      canvas: this._canvas,
      width: this._canvas.clientWidth,
      height: this._canvas.clientHeight,
      canvasControled: true,
      autoRender: true,
      disableDirtyBounds: true
    });
    // @ts-ignore
    this._stage = stage;
  }

  //
  protected initEvent() {
    this._stage.addEventListener('*', e => {
      // @ts-ignore
      this._onEvent(e);
    });
  }

  protected _onEvent(e: Event) {
    if (
      !(
        !e.target ||
        e.target === this._stage.defaultLayer ||
        e.target === this._stage ||
        (<any>e.target).name === 'root'
      )
    ) {
      this._isInActive = true;
      if (TriggerEvent[e.type]) {
        this._isTrigger = true;
      }
    }
  }

  tryEvent(e: MouseEvent) {
    if (TriggerEvent[e.type]) {
      this._isTrigger = false;
    }
    this._isInActive = false;
    const event = new MouseEvent(e.type, {
      view: window,
      ...e,
      clientX: e.clientX,
      clientY: e.clientY,
      movementX: e.movementX,
      movementY: e.movementY,
      relatedTarget: e.relatedTarget,
      screenX: e.screenX,
      screenY: e.screenY,
      bubbles: true,
      cancelable: true
    });
    this._canvas.dispatchEvent(event);
  }

  getAABBBounds() {
    const b = new Bounds();
    this._getAABBBounds(this._stage.defaultLayer, b, 0, 0);
    return b;
  }

  private _getAABBBounds(node: IGroup, b: Bounds, x: number, y: number) {
    node.getChildren?.().forEach(c => {
      if (c.type === 'group') {
        this._getAABBBounds(<IGroup>c, b, x + ((<IGroup>c).attribute.x ?? 0), y + ((<IGroup>c).attribute.y ?? 0));
      } else if ('AABBBounds' in c) {
        b.union((c.AABBBounds as Bounds).clone().translate(x, y));
      }
    });
  }

  addElements(el: BaseElement) {
    this._isElementReady = false;
    this._elements.push(el);
    el.onAfterRender(this._checkElementReady);
  }

  delElements(el: BaseElement) {
    const index = this._elements.findIndex(_el => el === _el);
    if (index >= 0) {
      this._elements.splice(index, 1);
      el.release();
    }
  }

  onElementReady(callBack: () => void) {
    this._elementReadyCallBack = callBack;
  }

  protected _checkElementReady = () => {
    if (this._elements.every(el => el.isRendered)) {
      this._isElementReady = true;
      this._elementReadyCallBack?.();
    }
  };

  getLayoutLineInLayer(): ILayoutLine[] {
    return [];
  }
}
