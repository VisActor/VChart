import type { VRenderPointerEvent } from './../elements/interface';
import { BoxSelection } from './../component/box-selection';
import type { EditorLayer } from './editor-layer';
import { MouseEvents, TriggerEvent } from './const';
import type { VChartEditor } from './vchart-editor';
import type { TransformComponent2 } from '../component/transform-component2';
import { isPointInBounds } from '../utils/space';

export class EditorEvent {
  protected _editor: VChartEditor;
  get editor() {
    return this._editor;
  }
  protected _triggerLayer: EditorLayer;
  get triggerLayer() {
    return this._triggerLayer;
  }

  protected _eventMap: { [key: string]: (e: Event) => void } = {};

  protected _boxSelection: BoxSelection;

  protected _mutationObserver: MutationObserver;

  constructor(editor: VChartEditor) {
    this._editor = editor;
    if (this._editor.option.mode === 'editor') {
      this._boxSelection = new BoxSelection(null, this);
    }
    this._mutationObserver = new window.MutationObserver(this._triggerLayerStyleChange);
  }

  _triggerLayerStyleChange = () => {
    if (!this._triggerLayer) {
      return;
    }
    this.setCursor(this._triggerLayer.getCanvas().style.cursor);
  };

  initEvent() {
    MouseEvents.forEach(eventType => {
      this._eventMap[eventType] = e => {
        this._handlerEvent(eventType, e);
      };
      document.addEventListener(eventType, this._eventMap[eventType], true);
    });

    document.addEventListener('keydown', this._keyEvent);
  }

  protected _keyEvent = (ev: KeyboardEvent) => {
    // remove delete in editor
    // if (DeleteElementKeyCode[ev.key] === true) {
    //   this._editor.deleteElement();
    // }
  };

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
      this._mutationObserver.disconnect();
      this._triggerLayer.getCanvas().style.zIndex =
        20 + this._editor.layers.findIndex(l => l === this._triggerLayer) + '';
    }
    if (l === null) {
      this._editor.editorController.removeEditorElements();
      return;
    }
    this._triggerLayer = l;
    this._boxSelection?.setLayer(this._triggerLayer);
    if (this._triggerLayer) {
      this._triggerLayer.getCanvas().style.zIndex = '100';
      this._mutationObserver.observe(this._triggerLayer.getCanvas(), {
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }

  release() {
    MouseEvents.forEach(eventType => {
      document.removeEventListener(eventType, this._eventMap[eventType]);
    });
    document.removeEventListener('keydown', this._keyEvent);
  }

  setElementPickable(able: boolean) {
    this._editor.layers.forEach(l => {
      l.elements.forEach(e => (e.pickable = able));
    });
  }

  setElementsOverAble(able: boolean) {
    this._editor.layers.forEach(l => {
      l.elements.forEach(e => (e.overAble = able));
    });
  }

  setCursor(cursor: string) {
    this._editor.container.style.cursor = cursor;
  }

  setCursorSyncToTriggerLayer() {
    this._triggerLayerStyleChange();
  }

  private _currentEditorBox: TransformComponent2 = null;

  isCurrentLayoutEditorBox(editorBox: TransformComponent2) {
    return this._currentEditorBox === editorBox;
  }
  setCurrentLayoutEditorBox(editorBox: TransformComponent2) {
    this._currentEditorBox = editorBox;
  }
  getCurrentEditorBox() {
    return this._currentEditorBox;
  }

  isEventInLayoutEditorBox(e: VRenderPointerEvent) {
    if (!this._currentEditorBox || !e) {
      return false;
    }
    if (isPointInBounds(e.canvas, this._currentEditorBox.rect.AABBBounds)) {
      return true;
    }
    return false;
  }
}
