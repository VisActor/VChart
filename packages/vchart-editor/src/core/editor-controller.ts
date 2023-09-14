/* eslint-disable no-console */
import { LayoutEditorComponent } from './../component/layout-component';
import type { IRect } from './../typings/space';
import { createRect } from '@visactor/vrender';
import type { IRect as IRenderRect } from '@visactor/vrender';
import type { IEditorElement, EditorHandlerFunc, IEditorLayer } from './interface';
import { isPointInRect } from '../utils/space';
import { MinSize } from './const';
export class EditorController {
  protected _currentEditorElements: IEditorElement = null;
  protected _currentEditorBox: LayoutEditorComponent = null;
  protected _currentOverEl: IEditorElement = null;
  protected _currentOverBorder: IRenderRect = null;

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

  setEditorElements(el: IEditorElement, event: PointerEvent) {
    if (this._currentEditorElements?.id === el?.id && this._currentEditorElements?.layer === el?.layer) {
      return;
    }
    if (this._currentEditorBox?.isEditor) {
      return;
    }
    if (this._currentEditorBox) {
      this._currentEditorBox.release();
      this._currentEditorBox = null;
      this._currentEditorElements = null;
    }

    if (el) {
      this._currentEditorElements = el;
      // layout editor
      this._currentEditorBox = new LayoutEditorComponent(el, {
        container: this.container,
        startHandler: () => {
          // do thing
          console.log('editor start');
          this._startHandler.forEach(h => h(this._currentOverEl));
        },
        updateHandler: data => {
          // TODO: 吸附
          console.log('editor update');
          let hasChange = false;
          if (data.width < MinSize) {
            data.width = MinSize;
            hasChange = true;
          }
          if (data.height < MinSize) {
            data.height = MinSize;
            hasChange = true;
          }
          if (this._currentOverBorder) {
            this._currentOverBorder.setAttributes(data);
          }
          if (hasChange) {
            return data;
          }
          return undefined;
        },
        endHandler: data => {
          this._currentEditorElements.updateAttribute({ layout: data });
          this._endHandler.forEach(h => h(this._currentEditorElements));
          console.log('editor end');
        },
        event: event
      });
      this._startHandler.forEach(h => h(this._currentOverEl));
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

  // over border
  setOverElement(el: IEditorElement | null, event: PointerEvent) {
    if (this._currentOverEl?.id === el?.id) {
      return;
    }
    if (el) {
      this._addOverBorder(el.rect);
      this._currentOverEl = el;
      return;
    } else if (this._currentOverBorder) {
      const rect = (<HTMLElement>event.target).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (isPointInRect({ x, y }, this._currentOverEl.rect)) {
        return;
      }
    }
    this._removeOverBorder();
  }

  _addOverBorder(rect: IRect) {
    if (this._currentOverBorder) {
      this._removeOverBorder();
    }
    const layer = this._currentEditorElements?.layer ?? this._opt.getTopLayer();
    if (!layer) {
      return;
    }
    this._currentOverBorder = createRect({
      ...rect,
      fill: false,
      stroke: 'blue',
      lineWidth: 2,
      // shadowBlur: 4,
      // shadowColor: 'blue',
      pickable: false
    });
    layer.editorGroup.add(this._currentOverBorder);
    console.log('add over border');
  }

  _removeOverBorder() {
    if (!this._currentOverBorder) {
      return;
    }
    this._currentOverBorder.setAttributes({
      stroke: 'red'
    });
    this._currentOverBorder.parent.removeChild(this._currentOverBorder);
    this._currentOverBorder = null;
    this._currentOverEl = null;
    console.log('remove over border');
  }

  release() {
    this._currentEditorBox?.release();
    this._startHandler = null;
    this._endHandler = null;
  }
}
