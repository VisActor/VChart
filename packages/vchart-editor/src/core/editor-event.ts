import type { EditorLayer } from './editor-layer';
import { MouseEvents, TriggerEvent } from './const';
import type { VChartEditor } from './vchart-editor';

export class EditorEvent {
  protected _editor: VChartEditor;
  protected _triggerLayer: EditorLayer;

  constructor(editor: VChartEditor) {
    this._editor = editor;
  }

  initEvent() {
    MouseEvents.forEach(eventType => {
      this._editor.container.addEventListener(eventType, e => {
        if (e.target !== this._editor.container) {
          return;
        }

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
                this.changeTriggerLayer(layer);
              }
              break;
            }
          }
        }
        if (!hasTrigger && TriggerEvent[e.type]) {
          this.changeTriggerLayer(null);
        }
      });
    });
  }

  changeTriggerLayer(l: EditorLayer) {
    if (this._triggerLayer === l) {
      return;
    }
    if (this._triggerLayer) {
      this._triggerLayer.getCanvas().style.zIndex =
        200 + this._editor.layers.findIndex(l => l === this._triggerLayer) + '';
    }
    this._triggerLayer = l;
    if (this._triggerLayer) {
      this._triggerLayer.getCanvas().style.zIndex = '10000';
    }
    // TODO: remove log before release mvp
    // eslint-disable-next-line no-console
    console.log(this._triggerLayer);
  }
}
