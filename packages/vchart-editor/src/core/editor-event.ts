import type { ILayoutAttribute, IRect } from './../typings/space';
import { isArray } from '@visactor/vutils';
import type { IEditorElement } from './interface';
import type { EditorLayer } from './editor-layer';
import { MouseEvents, TriggerEvent } from './const';
import type { VChartEditor } from './vchart-editor';

export class EditorEvent {
  protected _editor: VChartEditor;
  protected _triggerLayer: EditorLayer;
  get triggerLayer() {
    return this._triggerLayer;
  }

  constructor(editor: VChartEditor) {
    this._editor = editor;
  }

  initEvent() {
    MouseEvents.forEach(eventType => {
      document.addEventListener(
        eventType,
        e => {
          this._handlerEvent(eventType, e);
        },
        true
      );
    });
  }

  protected _handlerEvent(eventType: keyof HTMLElementEventMap, e: Event) {
    if (e.target !== this._editor.container) {
      return;
    }
    e.stopImmediatePropagation();

    let hasTrigger = false;
    let hasActive = false;
    //  current trigger layer first
    if (this._triggerLayer) {
      this._triggerLayer.tryEvent(e as MouseEvent);
      if (this._triggerLayer.isInActive) {
        hasActive = true;
        hasTrigger = true;
      }
    }
    if (!hasActive) {
      for (let i = this._editor.layers.length - 1; i >= 0; i--) {
        const layer = this._editor.layers[i];
        if (layer === this._triggerLayer) {
          continue;
        }
        layer.tryEvent(e as MouseEvent);
        if (layer.isInActive) {
          hasActive = true;
          if (TriggerEvent[e.type]) {
            hasTrigger = true;
            this.changeTriggerLayer(layer, e as PointerEvent);
          }
          break;
        }
      }
    }
    if (!hasTrigger && TriggerEvent[e.type]) {
      this.changeTriggerLayer(null, e as PointerEvent);
    }
    if (!hasActive) {
      this._editor.editorController.setOverGraphic(null, null, e as PointerEvent);
    }
  }

  changeTriggerLayer(l: EditorLayer, event: PointerEvent) {
    if (this._triggerLayer === l) {
      return;
    }
    if (this._triggerLayer) {
      this._triggerLayer.getCanvas().style.zIndex =
        20 + this._editor.layers.findIndex(l => l === this._triggerLayer) + '';
    }
    this._triggerLayer = l;
    if (this._triggerLayer) {
      this._triggerLayer.getCanvas().style.zIndex = '100';
    }

    if (this._triggerLayer === null) {
      this._editor.editorController.removeEditorElements();
    }
  }

  _parseActiveElement(el: IEditorElement | IEditorElement[]): IEditorElement {
    if (!isArray(el)) {
      return el;
    }
    if (el.length === 0) {
      return null;
    }
    let rect: IRect;
    el.forEach((_e, i) => {
      if (i === 0) {
        rect = { ..._e.rect };
      } else {
        rect.x = Math.min(rect.x, _e.rect.x);
        rect.y = Math.min(rect.y, _e.rect.y);
        rect.width = Math.max(rect.width, _e.rect.width + _e.rect.x - rect.x);
        rect.width = Math.max(rect.height, _e.rect.height + _e.rect.y - rect.y);
      }
    });
    const groupEl: IEditorElement = {
      type: 'group',
      id: '_editor_element_group',
      layer: this._triggerLayer ?? el[0].layer,
      rect: { ...rect },
      editProperties: {
        move: true,
        rotate: false,
        resize: false
      },
      editorFinish: () => {
        // nothing
      },
      updateAttribute: attr => {
        const layoutData = attr.layout as ILayoutAttribute;
        if (!layoutData) {
          return false;
        }
        const offsetX = layoutData.x - rect.x;
        const offsetY = layoutData.y - rect.y;
        el.forEach(_e => {
          _e.updateAttribute({
            layout: {
              ..._e.rect,
              x: _e.rect.x + offsetX,
              y: _e.rect.y + offsetY
            }
          });
        });
        return false;
      }
    };
    return groupEl;
  }
}
