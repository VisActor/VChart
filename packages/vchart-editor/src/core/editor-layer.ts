import type { IEditorElement, IEditorLayer } from './interface';
import type { IStage, IGroup } from '@visactor/vrender-core';
import { createGroup, createStage } from '@visactor/vrender-core';
import { CreateID } from '../utils/common';
import { TriggerEvent } from './const';
import type { BaseElement } from '../elements/base-element';

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

  constructor(container: HTMLElement, id?: string | number) {
    this._id = id ?? CreateID();
    this._container = container;
    this.initCanvas();
    this.initEvent();
    this.initEditorGroup();
  }

  release() {
    this._stage.release();
    this._elements.forEach(el => el.release());
    this._elements = null;
    this._editorGroup = null;
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
    //
  }

  addElements(el: BaseElement) {
    this._elements.push(el);
  }

  delElements(el: BaseElement) {
    const index = this._elements.findIndex(_el => el === _el);
    if (index >= 0) {
      this._elements.splice(index, 1);
    }
  }
}
