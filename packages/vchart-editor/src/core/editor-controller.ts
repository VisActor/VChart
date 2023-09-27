/* eslint-disable no-console */
import type { IGraphic } from '@visactor/vrender';
import type { IEditorElement, EditorHandlerFunc, IEditorLayer, IEditorController } from './interface';

export class EditorController implements IEditorController {
  protected _currentEditorElements: IEditorElement = null;
  protected _currentOverGraphic: IGraphic = null;
  protected _currentOverGraphicId: string | number = null;

  protected _startHandler: EditorHandlerFunc[] = [];
  protected _endHandler: EditorHandlerFunc[] = [];

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
    console.log('setEditorElements', el.id, el.layer.id);
    if (this._currentEditorElements?.id === el?.id && this._currentEditorElements?.layer === el?.layer) {
      return;
    }
    if (this._currentEditorElements) {
      this.removeEditorElements();
    }

    if (el) {
      console.log('add new editor box', el.id, el.layer.id);
      this._currentEditorElements = el;
      this._startHandler.forEach(h => h(this._currentEditorElements));
    }
  }

  removeEditorElements() {
    if (this._currentEditorElements) {
      this._currentEditorElements.editorFinish();
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

  // over border
  setOverGraphic(graphic: IGraphic, id: string | number, event: PointerEvent) {
    if (this._currentOverGraphicId === id) {
      return;
    }
    if (graphic) {
      this._addOverGraphic(graphic);
      this._currentOverGraphicId = id;
      return;
    } else if (this._currentOverGraphic) {
      const rect = (<HTMLElement>event.target).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (this._currentOverGraphic.containsPoint(x, y)) {
        return;
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

  release() {
    this._startHandler = null;
    this._endHandler = null;
  }
}
