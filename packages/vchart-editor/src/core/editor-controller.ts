/* eslint-disable no-console */
import type { IGraphic } from '@visactor/vrender-core';
import type { IEditorElement, EditorHandlerFunc, IEditorLayer, IEditorController } from './interface';

export class EditorController implements IEditorController {
  protected _currentEditorElements: IEditorElement = null;
  get currentEditorElement() {
    return this._currentEditorElements;
  }
  protected _currentOverGraphic: IGraphic = null;
  protected _currentOverGraphicId: string | number = null;
  get currentOverGraphicId() {
    return this._currentOverGraphicId;
  }

  protected _startHandler: EditorHandlerFunc[] = [];
  protected _endHandler: EditorHandlerFunc[] = [];
  protected _runHandler: ((type: string) => void)[] = [];

  protected _opt: {
    getTopLayer: () => IEditorLayer;
  };

  constructor(
    public container: HTMLElement,
    opt: {
      getTopLayer: () => IEditorLayer;
    }
  ) {
    this._opt = opt;
  }

  //
  setEditorElements(el: IEditorElement, _event: PointerEvent) {
    if (this._currentEditorElements?.id === el?.id && this._currentEditorElements?.layer === el?.layer) {
      return;
    }
    if (this._currentEditorElements) {
      this.removeEditorElements();
    }

    if (el) {
      this._currentEditorElements = el;
      this._startHandler.forEach(h => h(this._currentEditorElements));
    }
  }

  removeEditorElements() {
    if (this._currentEditorElements) {
      this._currentEditorElements.editorFinish();
      this._endHandler.forEach(h => h(this._currentEditorElements));
      this._currentEditorElements = null;
    }
  }

  addStartHandler(handler: EditorHandlerFunc) {
    this._startHandler.push(handler);
  }
  removeStartHandler(handler: EditorHandlerFunc) {
    const index = this._startHandler.findIndex(h => h === handler);
    if (index >= 0) {
      this._startHandler.slice(index, 1);
    }
  }
  addEndHandler(handler: EditorHandlerFunc) {
    this._endHandler.push(handler);
  }
  removeEndHandler(handler: EditorHandlerFunc) {
    const index = this._endHandler.findIndex(h => h === handler);
    if (index >= 0) {
      this._endHandler.slice(index, 1);
    }
  }

  editorEnd() {
    this._endHandler.forEach(h => h(this._currentEditorElements));
  }

  addRunHandler(handler: (type: string) => void) {
    this._runHandler.push(handler);
  }
  removeRunHandler(handler: (type: string) => void) {
    const index = this._runHandler.findIndex(h => h === handler);
    if (index >= 0) {
      this._runHandler.slice(index, 1);
    }
  }

  editorRun(type: string) {
    this._runHandler.forEach(h => h(type));
  }

  // over border
  setOverGraphic(graphic: IGraphic, id: string | number, event: PointerEvent) {
    if (this._currentOverGraphicId === id) {
      return;
    }
    if (graphic) {
      this._addOverGraphic(graphic);
      this._currentOverGraphicId = id;
      return;
    } else if (this._currentOverGraphic && event) {
      const rect = (<HTMLElement>event.target).getBoundingClientRect?.();
      if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (this._currentOverGraphic.containsPoint(x, y)) {
          return;
        }
      }
    }
    this._removeOverGraphic();
  }

  _addOverGraphic(g: IGraphic) {
    if (this._currentOverGraphic) {
      this._removeOverGraphic();
    }
    const layer = this._currentEditorElements?.layer ?? this._opt.getTopLayer();
    if (!layer) {
      return;
    }
    this._currentOverGraphic = g;
    layer.editorGroup.add(this._currentOverGraphic);
  }

  _removeOverGraphic() {
    if (!this._currentOverGraphic) {
      return;
    }
    this._currentOverGraphic.setAttributes({
      stroke: 'red'
    });
    this._currentOverGraphic.parent.removeChild(this._currentOverGraphic);
    this._currentOverGraphic = null;
    this._currentOverGraphicId = null;
  }

  deleteCurrentElement() {
    if (!this._currentEditorElements) {
      return;
    }
    const el = this._currentEditorElements;
    if (el.type !== 'graphics') {
      return;
    }
    this.removeEditorElements();
    el.layer.removeElement(el.id);
  }

  release() {
    this._startHandler = null;
    this._endHandler = null;
  }
}
