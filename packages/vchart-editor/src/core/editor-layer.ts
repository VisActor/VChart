import type { VChartEditor } from './vchart-editor';
import type { IElement, VRenderPointerEvent } from './../elements/interface';
import { Bounds, Matrix, isValid } from '@visactor/vutils';
import type { EditorMode, IEditorElement, IEditorLayer, IElementPathRoot, ILayoutLine } from './interface';
import type { IStage, IGroup, IGraphic, INode } from '@visactor/vrender-core';
import { createGroup, createStage, container } from '@visactor/vrender-core';
import { loadBrowserEnv } from '@visactor/vrender-kits';
import { CreateID } from '../utils/common';
import { IgnoreEvent, IsWheelEvent, TriggerEvent } from './const';
import type { BaseElement } from '../elements/base-element';
import type { IPoint } from '../typings/space';
import { transformPointWithMatrix } from '../utils/space';
import { LayerZoomMove } from '../component/layer-zoom-move';
import { getZIndexInParent } from '../elements/chart/utils/layout';
// 加载浏览器环境
loadBrowserEnv(container);

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

  protected _container: HTMLDivElement;
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
  set isInActive(v: boolean) {
    this._isInActive = v;
  }

  protected _elements: IElement[] = [];
  get elements() {
    return this._elements;
  }

  protected _editorGroup: IGroup;
  get editorGroup() {
    return this._editorGroup;
  }

  protected _elementGroup: IGroup;
  get elementGroup() {
    return this._stage.defaultLayer;
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
  get scale() {
    return this._stage.defaultLayer.globalTransMatrix.a ?? 1;
  }

  protected _eventHandler: Map<string, ((e: Event) => void)[]> = new Map();

  private _zoomMove: LayerZoomMove;
  get zoomMove() {
    return this._zoomMove;
  }

  private _editor: VChartEditor;
  getEditor() {
    return this._editor;
  }

  constructor(
    container: HTMLDivElement,
    { mode, editor }: { mode: EditorMode; editor: VChartEditor },
    id?: string | number
  ) {
    this._id = id ?? CreateID();
    this._container = container;
    this._editor = editor;
    this._mode = mode;
    this.initCanvas();
    this.initEvent();
    this.initEditorGroup();
    if (this._mode === 'editor') {
      this._zoomMove = new LayerZoomMove(this._stage.defaultLayer, editor, container);
    }
  }

  resizeLayer(width: number, height: number, x?: number, y?: number, scale?: number) {
    if (isValid(x) && isValid(y) && isValid(scale)) {
      this._stage.defaultLayer.setAttributes({
        postMatrix: new Matrix(scale, 0, 0, scale, x, y)
      });
    }
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
    this._zoomMove.moveTo({ x: 0, y: 0 });
  }

  transformPosToLayer = (pos: IPoint) => {
    // pos in layer
    return transformPointWithMatrix(this._stage.defaultLayer.globalTransMatrix.getInverse(), pos);
  };

  transformPosToClient = (pos: IPoint) => {
    // pos in layer
    return transformPointWithMatrix(this._stage.defaultLayer.globalTransMatrix, pos);
  };

  release() {
    this._zoomMove?.release();
    this._elements.forEach(el => el.release());
    this._stage.release();
    this._stage = null;
    this._elements = null;
    this._editorGroup = null;
    this._elementGroup = null;
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

    const elementGroup = createGroup({
      x: 0,
      y: 0,
      pickable: false,
      zIndex: 999999
    });
    this._stage.defaultLayer.add(elementGroup);
    this._elementGroup = elementGroup;
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
      dpr: window.devicePixelRatio,
      event: {
        clickInterval: 300
      }
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
          const { x: nodePosX, y: nodePosY } = transformPointWithMatrix(inverse, { x: e.canvas.x, y: e.canvas.y });
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

  getPathWithPos(pos: IPoint) {
    for (let i = 0; i < this._elements.length; i++) {
      const element = this._elements[i];
      const path = element.getTargetWithPos?.(pos);
      if (path) {
        return path;
      }
    }
    // 如果没有匹配到就使用 第一个 chart 的 第一个 region 做兜底 path
    const chartEl = this._elements.find(e => e.type === 'chart');
    if (chartEl) {
      return chartEl.getTargetWithPosBackup(pos);
    }
    return null;
  }

  updatePath(path: IElementPathRoot) {
    if (!path) {
      return null;
    }
    const el = this._elements.find(e => e.id === path.elementId);
    if (!el) {
      return null;
    }
    return el.updatePath(path);
  }

  getPosWithPath(path: IElementPathRoot) {
    if (!path) {
      return null;
    }
    const el = this._elements.find(e => e.id === path.elementId);
    if (!el) {
      return null;
    }
    return el.getPosWithPath(path);
  }

  on(eventType: string, cb: (e: Event) => void) {
    let list = this._eventHandler.get(eventType);
    if (!list) {
      list = [];
      this._eventHandler.set(eventType, list);
    }
    list.push(cb);
  }

  off(eventType: string, cb: (e: Event) => void) {
    const list = this._eventHandler.get(eventType);
    if (list && list.indexOf(cb) >= 0) {
      list.splice(list.indexOf(cb), 1);
    }
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

  tryEvent(e: MouseEvent | WheelEvent) {
    if (this._zoomMove?.wheelState !== 'none' || this._zoomMove?.dragState !== 'none') {
      return;
    }
    if (IgnoreEvent[e.type]) {
      return;
    }
    if (TriggerEvent[e.type]) {
      this._isTrigger = false;
    }
    this._isInActive = false;
    const eventCreate = IsWheelEvent[e.type] ? WheelEvent : MouseEvent;
    const event = new eventCreate(e.type, {
      view: window,
      ...e,
      ctrlKey: e.ctrlKey,
      deltaMode: (<WheelEvent>e).deltaMode,
      deltaX: (<WheelEvent>e).deltaX,
      deltaY: (<WheelEvent>e).deltaY,
      deltaZ: (<WheelEvent>e).deltaZ,
      detail: (<WheelEvent>e).detail,
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
      if ((<IGraphic>c).attribute.visible === false || c === this._editorGroup) {
        return;
      }
      if (c.type === 'group') {
        this._getAABBBounds(<IGroup>c, b, x + ((<IGroup>c).attribute.x ?? 0), y + ((<IGroup>c).attribute.y ?? 0));
      } else if ('AABBBounds' in c) {
        b.union((c.AABBBounds as Bounds).clone().translate(x, y));
      }
    });
  }

  addElements(el: IElement) {
    this._isElementReady = false;
    this._elements.push(el);
    el.onAfterRender(this._checkElementReady);
    this._checkElementReady();
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
  removeElement(id: string | number, triggerHistory: boolean = true) {
    const index = this.elements.findIndex(e => e.id === id);
    if (index >= 0) {
      if (triggerHistory) {
        this.elements[index].beforeDelete();
      }
      this.elements[index].release();
      this.elements.splice(index, 1);
      this._stage.renderNextFrame();
    }
  }

  changeElementLayoutZIndex(
    elementId: string,
    opt: { zIndex?: number; action: 'toTop' | 'toBottom' | 'levelUp' | 'levelDown' }
  ) {
    const el = this._elements.find(e => e.id === elementId);
    if (!el) {
      return;
    }
    const mark = el.geElementRootMark();
    if (!mark) {
      return;
    }
    const parent = mark.parent;
    (<any>opt).childFilter = (c: INode) => {
      if (c === this._editorGroup) {
        return false;
      }
      return true;
    };
    let zIndex = getZIndexInParent(parent, mark, opt);
    if (zIndex < 0) {
      zIndex += 100;
      this._elements.find(e => e.updateLayoutZIndex(zIndex + 1, false));
    }
    el.updateLayoutZIndex(zIndex, true);
  }
}
