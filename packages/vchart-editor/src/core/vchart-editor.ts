import { EditorController } from './editor-controller';
import type { EditorHandlerFunc, EditorMode, IEditorData, IVChartEditorInitOption } from './interface';
import { EditorEvent } from './editor-event';
import { ChartLayer } from '../elements/chart/chart-layer';
import { EditorLayer } from './editor-layer';
import type { Include } from './../typings/commnt';
import { ElementsMap } from './../elements/index';
import type { IElementOption } from './../elements/interface';
import { isString } from '@visactor/vutils';
import type { IDataParserConstructor } from '../elements/chart/data/interface';
import type { IChartTempConstructor } from '../elements/chart/template/interface';
import { EditorFactory } from './factory';

export class VChartEditor {
  static registerParser(key: string, parser: IDataParserConstructor) {
    EditorFactory.registerParser(key, parser);
  }
  static registerTemp(key: string, temp: IChartTempConstructor) {
    EditorFactory.registerTemp(key, temp);
  }

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

  protected _editorController: EditorController;
  get editorController() {
    return this._editorController;
  }

  protected _mode: EditorMode = 'view';

  constructor(option: IVChartEditorInitOption) {
    this._option = option;
    const { dom, mode } = this._option;
    this._mode = mode;

    this._option.data.setLayers(this.getLayers);
    this._option.data.setDataKey(`_vchart_editor_${this._option.id}`);
    if (dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    if (this._container) {
      this._container.style.position = 'relative';
    }
    this._editorController = new EditorController(this._container, {
      getTopLayer: () => {
        if (this._event.triggerLayer) {
          return this._event.triggerLayer;
        }
        return this._layers[0];
      }
    });
    this._editorController.addEndHandler(() => {
      this._option.data?.save?.();
    });
    this.initEvent();
  }

  getLayers = () => {
    return this._layers;
  };

  addElements(type: string, option: Include<Omit<IElementOption, 'layer' | 'controller' | 'mode'>>) {
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
    option.controller = this._editorController;
    option.mode = this._mode;
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
            attribute: e.attribute,
            controller: this._editorController,
            mode: this._mode
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

  setModel(mode: EditorMode) {
    if (mode === this._mode) {
      return;
    }
    this._mode = mode;
    this._layers.forEach(l => {
      l.elements.forEach(e => {
        e.setModel(this._mode);
      });
    });
    // clean overGraphic
    if (mode === 'view') {
      this._editorController.setOverGraphic(null, null, null);
    }
    // rerender to clean editor graphic
    this._layers.forEach(l => l.getStage().render());
  }

  release() {
    this._editorController.release();
    this._layers.forEach(l => l.release());
    this._layers = [];
  }
}
