import { HightLightBox } from './../component/hight-light-box';
import { EditorController } from './editor-controller';
import type { EditorMode, IEditorData, IElementPathRoot, IHistory, IVChartEditorInitOption } from './interface';
import { EditorEvent } from './editor-event';
import { ChartLayer } from '../elements/chart/chart-layer';
import { EditorLayer } from './editor-layer';
import type { Include } from '../typings/common';
import { ElementsMap } from './../elements/index';
import type { IElementOption, VRenderPointerEvent } from './../elements/interface';
import { isString, Bounds, isValidNumber, EventEmitter } from '@visactor/vutils';
import type { IDataParserConstructor } from '../elements/chart/data/interface';
import type { IChartTempConstructor } from '../elements/chart/template/interface';
import { EditorFactory } from './factory';
import { getCommonHistoryUse } from '../elements/common/editor-history';
import { EditorData } from './editor-data';
import type { EditorChart } from '../elements/chart/chart';
import type { IPoint } from '../typings/space';

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

  protected _hightLightBox: HightLightBox;
  get hightLightBox() {
    return this._hightLightBox;
  }

  protected _event: EditorEvent;

  emitter: EventEmitter = new EventEmitter();

  protected _data: IEditorData;

  protected _editorController: EditorController;
  get editorController() {
    return this._editorController;
  }

  protected _mode: EditorMode = 'view';

  protected _width: number;
  protected _height: number;
  protected _needResize: boolean = false;

  protected _commonHistoryUse: IHistory['use'];
  protected _editorData: EditorData;
  get editorData() {
    return this._editorData;
  }

  constructor(option: IVChartEditorInitOption) {
    this._option = option;
    const { dom, mode } = this._option;
    this._mode = mode;
    this._editorData = new EditorData(this, this._option.data);
    this._hightLightBox = new HightLightBox();

    this._commonHistoryUse = getCommonHistoryUse(this);

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
      // this._option.data?.save?.();
    });
    this.initEvent();
  }

  getLayers = () => {
    return this._layers;
  };

  addElements(
    type: string,
    option: Include<
      Omit<IElementOption, 'layer' | 'controller' | 'mode' | 'commonHistoryUse' | 'editorData' | 'editorEvent'>
    >,
    triggerHistory: boolean = true
  ) {
    if (!ElementsMap[type]) {
      return;
    }
    let layer = this.layers[0];
    if (type === 'chart') {
      layer = new ChartLayer(this._container, { mode: this._mode, editor: this }, option.id);
      this.addLayer(layer);
      option.renderCanvas = layer.getCanvas();
    } else {
      if (!layer) {
        layer = new EditorLayer(this._container, { mode: this._mode, editor: this }, option.id);
        this.addLayer(layer);
      }
    }
    option.layer = layer;
    option.controller = this._editorController;
    option.mode = this._mode;
    option.getAllLayers = () => this._layers;
    option.editorData = this._editorData;
    option.editorEvent = this._event;
    option.commonHistoryUse = this._commonHistoryUse;
    const el = new ElementsMap[type](option as unknown as IElementOption);
    if (!el) {
      return;
    }
    el.initWithOption();
    layer.addElements(el);
    if (triggerHistory) {
      el.afterAdd();
    }
  }

  deleteElement(id?: string, triggerHistory: boolean = true) {
    if (id) {
      this._layers.forEach(l => l.removeElement(id, triggerHistory));
    } else {
      this._editorController.deleteCurrentElement(triggerHistory);
    }
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
    l.onElementReady(this._checkLayerReady);
    this._layers.push(l);
    if (this._layers.length === 1) {
      this._event.changeTriggerLayer(l, null);
      this._hightLightBox.setLayer(l);
    }
  }

  protected _checkLayerReady = () => {
    if (this._layers.every(l => l.isElementReady)) {
      this._afterAllLayerReady();
      return true;
    }
    return false;
  };

  protected _afterAllLayerReady() {
    if (this._needResize && this._width && this._height) {
      this.resize(this._width, this._height);
    }
  }

  async loadLasted(width?: number, height?: number) {
    if (!this._option.data) {
      return;
    }
    // remove last
    this._layers.forEach(l => l.release());
    this._layers = [];

    const layerData = await this._option.data.load();
    if (!layerData) {
      return;
    }
    layerData.forEach(l => {
      if (l.type === 'chart') {
        const layer = new ChartLayer(this._container, { mode: this._mode, editor: this });
        this.addLayer(layer);
        l.elements.forEach(e => {
          const el = new ElementsMap[e.type]({
            layer: layer,
            rect: e.rect,
            id: e.id,
            type: e.type,
            attribute: e.attribute,
            controller: this._editorController,
            mode: this._mode,
            getAllLayers: () => this._layers,
            editorData: this._editorData,
            editorEvent: this._event,
            commonHistoryUse: this._commonHistoryUse
          });
          if (!el) {
            return;
          }
          el.initWithOption();
          layer.addElements(el);
        });
      }
    });
    if (width && height) {
      this._width = width;
      this._height = height;
      if (this._mode === 'view') {
        this._needResize = true;
        this._checkLayerReady();
      }
    }
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

  resize(width: number, height: number) {
    if (!isValidNumber(width) || !isValidNumber(height)) {
      return;
    }
    if (this._mode !== 'view') {
      return;
    }
    // padding
    this._width = width;
    this._height = height;
    const b = new Bounds();
    if (this._layers.length === 0) {
      return;
    }
    this._needResize = false;
    this._layers.forEach(l => {
      b.union(l.getAABBBounds());
    });
    // padding
    b.expand(12);
    const contentWidth = b.width();
    const contentHeight = b.height();
    if (contentWidth === 0 || contentWidth === Infinity || contentHeight === 0 || contentHeight === Infinity) {
      return;
    }
    const scale = Math.min(width / b.width(), height / b.height(), 1);
    const finalWidth = contentWidth * scale;
    const finalHeight = contentHeight * scale;
    const posX = (width - finalWidth) * 0.5 - b.x1 * scale;
    const posY = (height - finalHeight) * 0.5 - b.y1 * scale;
    this._layers.forEach(l => {
      l.resizeLayer(width, height, posX, posY, scale);
    });
  }

  reLayoutToCenter() {
    const b = new Bounds();
    if (this._layers.length === 0) {
      return;
    }
    this._needResize = false;
    this._layers.forEach(l => {
      b.union(l.getAABBBounds());
    });
    const contentWidth = b.width();
    const contentHeight = b.height();
    if (contentWidth === 0 || contentWidth === Infinity || contentHeight === 0 || contentHeight === Infinity) {
      return;
    }

    this.clearCurrentEditorElement();
    this.editorController.setEditorElements(null, null);
    const offsetX = (this._width - contentWidth) * 0.5 - b.x1;
    const offsetY = (this._height - contentHeight) * 0.5 - b.y1;
    this._layers.forEach(l => {
      l.reLayoutWithOffset(offsetX, offsetY);
    });
  }

  onLayerEvent(eventType: string, cb: (e: Event) => void) {
    this._layers.forEach(l => l.on(eventType, cb));
  }

  offLayerEvent(eventType: string, cb: (e: Event) => void) {
    this._layers.forEach(l => l.off(eventType, cb));
  }

  getPathWithEvent(e: PointerEvent) {
    return this._layers[0]?.getPathWithPos?.({ x: e.offsetX, y: e.offsetY });
  }

  getPathWithPos(pos: IPoint) {
    return this._layers[0]?.getPathWithPos?.(pos);
  }

  getPosWithPath(path: IElementPathRoot) {
    return this._layers[0]?.getPosWithPath?.(path);
  }

  hightLightWithPos(pos: IPoint, boxKey: string, style?: any) {
    const path = this._layers[0]?.getPathWithPos?.(pos);
    if (path) {
      this._hightLightBox.showBox(boxKey, style ? { ...path.rect, ...style } : path.rect);
    } else {
      this._hightLightBox.hiddenBox(boxKey);
    }
  }

  clearHightLightPos(boxKey: string) {
    this._hightLightBox.hiddenBox(boxKey);
  }

  getChartElements() {
    const charts: EditorChart[] = [];
    this._layers.forEach(l => {
      l.elements.forEach(e => {
        if (l.type === 'chart') {
          charts.push(e as EditorChart);
        }
      });
    });
    return charts;
  }

  zoomTo(zoom: number, center?: IPoint) {
    this._layers.forEach(l => {
      l.zoomMove.zoomTo(zoom, center);
    });
  }

  clearCurrentEditorElement() {
    this._layers.forEach(l => {
      l.elements.forEach(e => {
        e.clearCurrentEditorElement();
      });
    });
  }
}
