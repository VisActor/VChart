import type { IEditorLayer } from './../core/interface';
import type { IRect } from '@visactor/vrender-core';
import { createRect } from '@visactor/vrender-core';
export class HightLightBox {
  protected _boxMap: { [key: string]: IRect } = {};

  private _layer: IEditorLayer;

  setLayer(layer: IEditorLayer) {
    Object.values(this._boxMap).forEach(box => {
      this._layer?.editorGroup?.removeChild?.(box);
    });
    this._boxMap = {};
    this._layer = layer;
  }

  addBox(key: string, style: any = {}) {
    if (!this._layer) {
      return;
    }
    if (this._boxMap[key]) {
      this._boxMap[key].setAttributes(style);
    } else {
      this._boxMap[key] = createRect({ visible: false, ...style });
      this._layer.editorGroup.add(this._boxMap[key]);
    }
  }

  showBox(key: string, style: any = {}) {
    this.addBox(key, { visible: true, ...style });
  }

  hiddenBox(key: string) {
    if (this._boxMap[key]) {
      this._boxMap[key].setAttributes({ visible: false });
    }
  }
}
