import type { ICommonInitOption } from './interface';
/* eslint-disable no-console */
import type { IGraphic } from '@visactor/vrender';
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
  protected _finishHandler: (() => void)[] = [];
  protected _runHandler: ((type: string) => void)[] = [];
  protected _endHandler: EditorHandlerFunc[] = [];

  protected _option: {
    getTopLayer: () => IEditorLayer;
  } & ICommonInitOption;

  constructor(
    public container: HTMLElement,
    opt: {
      getTopLayer: () => IEditorLayer;
    } & ICommonInitOption
  ) {
    this._option = opt;
  }

  //
  setEditorElements(el: IEditorElement, _event?: PointerEvent) {
    if (this._currentEditorElements?.id === el?.id && this._currentEditorElements?.layer === el?.layer) {
      if (this._currentEditorElements !== el) {
        this._currentEditorElements.editorFinish();
        this._currentEditorElements = el;
      }
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
      this._finishHandler.forEach(h => h());
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

  addFinishHandler(handler: () => void) {
    this._finishHandler.push(handler);
  }
  removeFinishHandler(handler: () => void) {
    const index = this._finishHandler.findIndex(h => h === handler);
    if (index >= 0) {
      this._finishHandler.slice(index, 1);
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

  protected _overGraphicCache: {
    graphic: IGraphic;
    id: string | number;
  } = {
    graphic: null,
    id: null
  };

  clearOverCache() {
    this._overGraphicCache = {
      graphic: null,
      id: null
    };
  }
  hasOverCache() {
    return !!this._overGraphicCache.id;
  }

  // over border
  setOverGraphic(graphic: IGraphic, id: string | number, event: PointerEvent) {
    this._overGraphicCache.id = id;
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
    this.removeOverGraphic();
  }

  _addOverGraphic(g: IGraphic) {
    if (this._currentOverGraphic) {
      this.removeOverGraphic();
    }
    const layer = this._currentEditorElements?.layer ?? this._option.getTopLayer();
    if (!layer) {
      return;
    }
    this._currentOverGraphic = g;
    layer.editorGroup.add(this._currentOverGraphic);
  }

  removeOverGraphic() {
    if (!this._currentOverGraphic) {
      return;
    }
    this._currentOverGraphic.setAttributes({
      stroke: 'red'
    });
    this._currentOverGraphic.parent?.removeChild(this._currentOverGraphic);
    this._currentOverGraphic = null;
    this._currentOverGraphicId = null;
  }

  deleteCurrentElement(triggerHistory: boolean = true) {
    if (!this._currentEditorElements) {
      return;
    }
    const el = this._currentEditorElements;
    if (el.type !== 'graphics') {
      return;
    }
    this.removeEditorElements();
    el.layer.removeElement(el.id, triggerHistory);
  }

  release() {
    this._startHandler = null;
    this._finishHandler = null;
    this._runHandler = null;
    this._endHandler = null;
  }
}
