import type { IEditorData, IVChartEditorInitOption } from './interface';
import { EditorEvent } from './editor-event';
import { ChartLayer } from '../elements/chart/chart-layer';
import { EditorLayer } from './editor-layer';
import type { Include } from './../typings/commnt';
import { ElementsMap } from './../elements/index';
import type { IElementOption } from './../elements/interface';
import { isString } from '@visactor/vutils';

export class VChartEditor {
  protected _option: IVChartEditorInitOption;
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

  protected _data: IEditorData;

  constructor(option: IVChartEditorInitOption) {
    this._option = option;
    const { dom } = this._option;
    this._option.data.setLayers(this.getLayers);
    this._option.data.setDataKey(`_vchart_editor_${this._option.id}`);
    if (dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    if (!this._container) {
      this._container.style.position = 'relative';
    }
    this.initEvent();
  }

  getLayers = () => {
    return this._layers;
  };

  addElements(type: string, option: Include<Omit<IElementOption, 'layer'>>) {
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
    this._option.data.save();
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

  loadLasted() {
    if (!this._option.data) {
      return;
    }
    const layerData = this._option.data.load();
    if (!layerData) {
      return;
    }
    layerData.forEach(l => {
      if (l.type === 'chart') {
        const layer = new ChartLayer(this._container);
        this.addLayer(layer);
        l.elements.forEach(e => {
          const el = new ElementsMap[e.type]({
            layer: layer,
            rect: e.rect,
            id: e.id,
            type: e.type,
            attribute: e.attribute
          });
          if (!el) {
            return;
          }
          el.initWithOption();
          layer.addElements(el);
        });
      }
    });
  }
}
