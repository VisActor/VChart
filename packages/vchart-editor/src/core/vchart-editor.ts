import { v4 as uuid } from 'uuid';

import { HighlightBox } from '../component/highlight-box';
import { EditorController } from './editor-controller';
import type {
  EditorMode,
  EditorState,
  IEditorData,
  IElementPathRoot,
  IHistory,
  IVChartEditorInitOption
} from './interface';
import { EditorEvent } from './editor-event';
import { ChartLayer } from '../elements/chart/chart-layer';
import { EditorLayer } from './editor-layer';
import type { Include } from '../typings/common';
import { ElementsMap } from './../elements/index';
import type { IElementOption } from './../elements/interface';
import { isString, Bounds, isValidNumber, EventEmitter, isEmpty } from '@visactor/vutils';
import type { IDataParserConstructor } from '../elements/chart/data/interface';
import type { IChartTempConstructor } from '../elements/chart/template/interface';
import { EditorFactory } from './factory';
import { getCommonHistoryUse } from '../elements/common/editor-history';
import { EditorData } from './editor-data';
import type { EditorChart } from '../elements/chart/chart';
import type { IPoint } from '../typings/space';
import { setupSimpleTextEditor } from '../elements/chart/utils/text';
import { EditorActionMode, EditorActiveTool } from './enum';
import type { ITextAttribute, ITextGraphicAttribute } from '@visactor/vrender';

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
  protected _container: HTMLDivElement;
  get container() {
    return this._container;
  }

  protected _layers: EditorLayer[] = [];
  get layers() {
    return this._layers;
  }

  protected _highlightBox: HighlightBox;
  get hightLightBox() {
    return this._highlightBox;
  }

  protected _event: EditorEvent;
  get event() {
    return this._event;
  }

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

  // 编辑器状态
  private _state: EditorState = {};
  get state() {
    return this._state;
  }
  setState(newState: Partial<EditorState>) {
    // Merge the new state with the current state
    this._state = {
      ...this._state,
      ...newState
    };

    this.emitter.emit('onStateChange', {
      state: this._state
    });
  }

  constructor(option: IVChartEditorInitOption) {
    this._option = option;
    const { dom, mode } = this._option;
    this._mode = mode;
    this._editorData = new EditorData(this, this._option.data);
    this._highlightBox = new HighlightBox();

    this._commonHistoryUse = getCommonHistoryUse(this);

    this._option.data.setLayers(this.getLayers);
    this._option.data.setDataKey(`_vchart_editor_${this._option.id}`);
    if (dom) {
      this._container = (isString(dom) ? document?.getElementById(dom) : dom) as HTMLDivElement;
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

    // TODO: 先在这里调试，待迁移至飞书图表编辑器中 @张苏
    document.addEventListener('pointerdown', e => {
      if (this.state.activeTool === EditorActiveTool.text && this.state.actionMode === EditorActionMode.addTool) {
        this.setState({
          activeTool: null,
          actionMode: null
        });
        const defaultTextAttributes: Partial<ITextGraphicAttribute> = {
          fontFamily: 'D-Din',
          textAlign: 'start',
          textBaseline: 'top',
          fontSize: 16,
          fill: '#000'
        };
        setupSimpleTextEditor({
          textAttributes: defaultTextAttributes,
          anchor: {
            left: e.clientX,
            top: e.clientY,
            width: 0,
            height: 0
          },
          container: this.layers[0].container,
          needExpression: false,
          onSubmit: (text: string) => {
            if (isEmpty(text)) {
              return;
            }
            this.addElements('text', {
              id: uuid(),
              attribute: {
                text: text.split('\n'),
                ...defaultTextAttributes,
                ...this.layers[0].transformPosToLayer({ x: e.offsetX, y: e.offsetY })
              }
            });
          }
        });
      }
    });

    document.addEventListener('pointermove', e => {
      if (this.state.activeTool === EditorActiveTool.text && this.state.actionMode === EditorActionMode.addTool) {
        this.event.setCursor('text');
      } else {
        this.event.setCursorSyncToTriggerLayer();
      }
    });

    // [
    //   'perLayerDrag',
    //   'perLayerWheel',
    //   'onLayerWheelStart',
    //   'onLayerDragStart',
    //   'onLayerDragOver',
    //   'onLayerWheelOver'
    // ].forEach(e => {
    //   this.emitter.on(e, () => {
    //     console.log(e);
    //   });
    // });
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
      this._highlightBox.setLayer(l);
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
    // padding
    this._width = width;
    this._height = height;
    if (this._mode === 'view') {
      this._resizeToCenter();
    } else if (this._mode === 'editor') {
      this._resizeCanvas();
    }
  }

  private _resizeToCenter() {
    const width = this._width;
    const height = this._height;
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

  private _resizeCanvas() {
    this._layers.forEach(l => l.resizeLayer(this._width, this._height));
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
    const scale = this._layers[0].scale;
    const clientWidth = this._width / scale;
    const clientHeight = this._height / scale;
    // 清除当前的选中 编辑元素 与 over元素
    this.clearCurrentEditorElement();
    this._editorController.removeOverGraphic();
    this.editorController.setEditorElements(null, null);
    // 还是保留这种原始可以保持编辑效果与回退
    const offsetX = (clientWidth - contentWidth) * 0.5 - b.x1;
    const offsetY = (clientHeight - contentHeight) * 0.5 - b.y1;
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

  highlightWithPos(pos: IPoint, boxKey: string, style?: any) {
    // console.log('highlightWithPos');
    const path = this._layers[0]?.getPathWithPos?.(pos);
    if (path && !path.isBackup) {
      this._highlightBox.showBox(boxKey, style ? { ...path.rect, ...style } : path.rect);
    } else {
      this._highlightBox.hiddenBox(boxKey);
    }
  }

  highlightWithPath(path: IElementPathRoot, boxKey: string, style?: any) {
    if (path && !path.isBackup) {
      this._layers[0]?.updatePath?.(path);
      this._highlightBox.showBox(boxKey, style ? { ...path.rect, ...style } : path.rect);
    } else {
      this._highlightBox.hiddenBox(boxKey);
    }
  }

  clearHighlightPos(boxKey: string) {
    this._highlightBox.hiddenBox(boxKey);
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
