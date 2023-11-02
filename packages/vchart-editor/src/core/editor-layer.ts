import { BoxSelection } from './../component/box-selection';
import type { VRenderPointerEvent } from './../elements/interface';
import { Bounds, isValid } from '@visactor/vutils';
import type { EditorMode, IEditorElement, IEditorLayer, ILayoutLine } from './interface';
import type { IStage, IGroup, IGraphic } from '@visactor/vrender-core';
import { createGroup, createStage } from '@visactor/vrender-core';
import { CreateID } from '../utils/common';
import { IgnoreEvent, TriggerEvent } from './const';
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
  get container() {
    return this._container;
  }

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

  protected _boxSelection: BoxSelection;
  get boxSelection() {
    return this._boxSelection;
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

  protected _eventHandler: Map<string, ((e: Event) => void)[]> = new Map();

  constructor(container: HTMLElement, mode: EditorMode, id?: string | number) {
    this._id = id ?? CreateID();
    this._container = container;
    this._mode = mode;
    this.initCanvas();
    this.initEvent();
    this.initEditorGroup();
    this.initBoxSelection();
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
    this._canvas.width = width * this._stage.dpr;
    this._canvas.height = height * this._stage.dpr;

    this._container.style.width = width + 'px';
    this._container.style.height = height + 'px';

    // @ts-ignore
    this._stage.setViewBox(0, 0, width, height, true);
  }

  reLayoutWithOffset(offsetX: number, offsetY: number) {
    this._elements.forEach(el => el.moveBy(offsetX, offsetY));
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
    this._elements.forEach(el => el.release());
    this._stage.release();
    this._stage = null;
    this._elements = null;
    this._editorGroup = null;
    this._elementReadyCallBack = null;
    this._eventHandler.clear();
    this._eventHandler = null;
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
    canvas.width = this._container.clientWidth * window.devicePixelRatio;
    canvas.height = this._container.clientHeight * window.devicePixelRatio;
    canvas.style.width = this._container.clientWidth + 'px';
    canvas.style.height = this._container.clientHeight + 'px';

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
      disableDirtyBounds: true,
      dpr: window.devicePixelRatio
    });
    // @ts-ignore
    this._stage = stage;
  }

  protected initBoxSelection() {
    this._boxSelection = new BoxSelection(this);
  }

  //
  protected initEvent() {
    this._stage.addEventListener('*', e => {
      // @ts-ignore
      this._onEvent(e);
    });
  }

  getEventPath(e: VRenderPointerEvent) {
    const path = [];
    // @ts-ignore
    if (e.target === this._stage.defaultLayer || e.target === this._stage) {
      path.push({
        percentX: e.canvas.x / this._container.clientWidth,
        percentY: e.canvas.y / this._container.clientHeight
      });
    } else {
      let node = e.target;
      while (node !== this._stage.defaultLayer) {
        const parent = node.parent;
        let index = -1;
        // eslint-disable-next-line no-loop-func
        parent.forEachChildren((n, i) => {
          if (n === node) {
            index = i;
            return true;
          }
          return false;
        });
        const result = { index };
        if (path.length === 0) {
          const inverse = node.globalTransMatrix.getInverse();
          const nodePosX = inverse.a * e.canvas.x + inverse.c * e.canvas.y + inverse.e;
          const nodePosY = inverse.b * e.canvas.x + inverse.d * e.canvas.y + inverse.f;
          // @ts-ignore
          result.percentX = nodePosX / node.AABBBounds.width();
          // @ts-ignore
          result.percentY = nodePosY / node.AABBBounds.height();
        }
        path.unshift(result);
        node = parent;
      }
    }
    return path;
  }

  getPosWithPath(path: any[]) {
    let node = this._stage.defaultLayer as IGraphic;
    if (path.length === 1) {
      return {
        x: this._container.clientWidth * path[0].percentX,
        y: this._container.clientHeight * path[0].percentY
      };
    }
    const nodePos = { x: 0, y: 0 };
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      let lastNode = node;
      if (isValid(p.index)) {
        // eslint-disable-next-line no-loop-func
        node.forEachChildren((n, i) => {
          if (i === p.index) {
            node = n as IGraphic;
            return true;
          }
          return false;
        });
      }
      if (node === lastNode) {
        // not found
        return { x: -1, y: -1 };
      }
      lastNode = node;
      if (isValid(p.percentX)) {
        nodePos.x = node.AABBBounds.width() * p.percentX;
        nodePos.y = node.AABBBounds.height() * p.percentY;
      }
    }
    const matrix = node.globalTransMatrix;
    nodePos.x = matrix.a * nodePos.x + matrix.c * nodePos.y + matrix.e;
    nodePos.y = matrix.b * nodePos.x + matrix.d * nodePos.y + matrix.f;
    return nodePos;
  }

  on(eventType: string, cb: (e: Event) => void) {
    let list = this._eventHandler.get(eventType);
    if (!list) {
      list = [];
      this._eventHandler.set(eventType, list);
    }
    list.push(cb);
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
    const callList = this._eventHandler.get(e.type);
    if (callList) {
      callList.forEach(cb => cb(e));
    }
    // const path = this.getEventPath(e as any);
    // const pos = this.getPosWithPath(path);
  }

  tryEvent(e: MouseEvent) {
    if (IgnoreEvent[e.type]) {
      return;
    }
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
      if (c === this._editorGroup) {
        return;
      }
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
  removeElement(id: string | number) {
    const index = this.elements.findIndex(e => e.id === id);
    if (index >= 0) {
      this.elements[index].release();
      this.elements.splice(index, 1);
      this._stage.renderNextFrame();
    }
  }
}
