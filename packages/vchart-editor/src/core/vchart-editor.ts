import { EditorEvent } from './editor-event';
import { ChartLayer } from '../elements/chart/chart-layer';
import { EditorLayer } from './editor-layer';
import type { Include } from './../typings/commnt';
import { ElementsMap } from './../elements/index';
import type { BaseElement } from '../elements/base-element';
import type { IElementOption } from './../elements/interface';
import { isString } from '@visactor/vutils';

export class VChartEditor {
  protected _option: { dom: string | HTMLElement };
  get option() {
    return this._option;
  }
  protected _container: HTMLElement;
  get container() {
    return this._container;
  }

  protected _layers: EditorLayer[] = [];
  get layers() {
    return this._layers;
  }

  protected _event: EditorEvent;

  constructor(option: { dom: string | HTMLElement }) {
    this._option = option;
    const { dom } = this._option;
    if (dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    if (!this._container) {
      this._container.style.position = 'relative';
    }
    this.initEvent();
  }

  addElements(type: string, option: Include<IElementOption>) {
    if (!ElementsMap[type]) {
      return;
    }
    let layer;
    if (type === 'chart') {
      layer = new ChartLayer(this._container);
      option.renderCanvas = layer.getCanvas();
    } else {
      layer = new EditorLayer(this._container);
    }
    this.addLayer(layer);
    option.layer = layer;
    const el = new ElementsMap[type](option);
    if (!el) {
      return;
    }
    el.initWithOption();
    layer.addElements(el);
  }

  initEvent() {
    this._event = new EditorEvent(this);
    this._event.initEvent();
  }

  resetLayoutZIndex() {
    this._layers.forEach((l, i) => {
      l.getCanvas().style.zIndex = 200 + i + '';
    });
  }

  addLayer(l: EditorLayer) {
    l.getCanvas().style.zIndex = 200 + this._layers.length + '';
    this._layers.push(l);
  }
}
