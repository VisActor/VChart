import { ChartEvent } from './../constant/event';
import type { IElement, IView } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import { View } from '@visactor/vgrammar-core';
import type {
  CompilerListenerParameters,
  CompilerModel,
  IGrammarItem,
  IProductMap,
  IRenderContainer,
  IRenderOption
} from './interface';
// eslint-disable-next-line no-duplicate-imports
import { GrammarType } from './interface/compilable-item';
import { toRenderMode, viewResizeSync } from './util';
import { isMobileLikeMode, isTrueBrowser } from '../util/env';
import { isString } from '../util/type';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isNil, isValid, Logger, LoggerLevel } from '@visactor/vutils';
import type { EventSourceType } from '../event/interface';
import type { IChart } from '../chart/interface';
import type { VChart } from '../core/vchart';
import type { IColor, Stage } from '@visactor/vrender-core';
import type { IMorphConfig } from '../animation/spec';
import { Event_Source_Type } from '../constant';

type EventListener = {
  type: string;
  callback: (...args: any[]) => void;
};

export class Compiler {
  protected _view: IView;
  /**
   * 获取 VGrammar View 实例
   */
  getVGrammarView() {
    return this._view;
  }
  protected _viewListeners: Map<(...args: any[]) => any, EventListener> = new Map();
  protected _windowListeners: Map<(...args: any[]) => any, EventListener> = new Map();
  protected _canvasListeners: Map<(...args: any[]) => any, EventListener> = new Map();

  isInited: boolean = false;
  // 是否已经销毁
  isReleased: boolean = false;

  protected _width: number;
  protected _height: number;

  protected _container: IRenderContainer;
  protected _option: IRenderOption;

  protected _model: CompilerModel = {
    [GrammarType.signal]: {},
    [GrammarType.data]: {},
    [GrammarType.mark]: {}
  };
  getModel() {
    return this._model;
  }

  private _compileChart: IChart = null;

  constructor(container: IRenderContainer, option: IRenderOption) {
    this._container = container;
    this._option = option;
  }

  getRenderer() {
    return this._view?.renderer;
  }

  /**
   * 获取 canvas dom
   * @returns HTMLCanvasElement | undefined
   */
  getCanvas(): HTMLCanvasElement | undefined {
    return this._view?.renderer.canvas();
  }

  /**
   * 获取 渲染引擎
   */
  getStage(): Stage | undefined {
    return this._view?.renderer.stage();
  }

  initView() {
    if (this.isReleased) {
      return;
    }
    this.isInited = true;
    if (this._view) {
      return;
    }
    const logger = new Logger(this._option.logLevel ?? LoggerLevel.Error);
    if (this._option?.onError) {
      logger.addErrorHandler((...args) => {
        this._option?.onError?.(...args);
      });
    }
    this._view = new View({
      width: this._width,
      height: this._height,
      container: this._container.dom ?? null,
      renderCanvas: this._container.canvas ?? null,
      hooks: (this._option as any).performanceHook, // vgrammar 事件改造后，性能回调函数放在了hooks中实现
      ...this._option,
      mode: toRenderMode(this._option.mode),
      autoFit: false,
      eventConfig: {
        gesture: isMobileLikeMode(this._option.mode),
        disable: this._option.interactive === false
      },
      doLayout: () => {
        this._compileChart?.onLayout(this._view);
      },
      logger: logger,
      logLevel: logger.level()
    });
    this._setCanvasStyle();

    // emit afterRender event
    this.getStage().hooks.afterRender.tap('chart-event', () => {
      this._compileChart?.getEvent()?.emit(ChartEvent.afterRender, { chart: this._compileChart });
    });

    const interactive = this._option.interactive;
    if (interactive !== false) {
      // 将 view 实例化之前监听的事件挂载到 view 上
      this._viewListeners.forEach(listener => {
        this._view?.addEventListener(listener.type, listener.callback);
      });
    }
  }

  private _setCanvasStyle() {
    if (!this._view) {
      return;
    }
    if (this._container.dom && !isString(this._container.dom)) {
      this._container.dom.style.display = 'block';
      this._container.dom.style.position = 'relative';
      const canvas = this.getCanvas();
      if (canvas) {
        canvas.style.display = 'block';
      }
    }
  }

  compile(ctx: { chart: IChart; vChart: VChart }, option: any) {
    const { chart } = ctx;
    this._compileChart = chart;
    this.initView();
    if (!this._view) {
      return;
    }

    chart.compile();
    chart.afterCompile();
    this.updateDepend();
  }

  clear(ctx: { chart: IChart; vChart: VChart }, removeGraphicItems: boolean = false) {
    const { chart } = ctx;
    chart.clear();
    this.releaseGrammar(removeGraphicItems);
  }

  async renderAsync(morphConfig?: IMorphConfig): Promise<any> {
    if (this.isReleased) {
      return;
    }
    this.initView();
    if (!this._view) {
      return Promise.reject('srView init fail');
    }
    await this._view?.runNextTick(morphConfig);
    return this;
  }

  renderSync(morphConfig?: IMorphConfig): void {
    this.initView();
    if (!this._view) {
      return;
    }
    this._view?.runSync(morphConfig);
  }

  updateViewBox(viewBox: IBoundsLike, reRender: boolean = true) {
    if (!this._view) {
      return;
    }

    this._view.renderer.setViewBox(viewBox, reRender);
  }

  async resize(width: number, height: number, reRender: boolean = true) {
    if (!this._view) {
      return;
    }
    this._width = width;
    this._height = height;

    await this._view.resize(width, height);
    if (reRender) {
      await this.renderAsync({ morph: false });
    }
  }

  resizeSync(width: number, height: number, reRender: boolean = true) {
    if (!this._view) {
      return;
    }
    this._width = width;
    this._height = height;

    viewResizeSync(this._view, width, height);
    if (reRender) {
      this.renderSync({ morph: false });
    }
  }

  setBackground(color: IColor) {
    this._view?.background(color);
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    if (!this._view) {
      return;
    }

    this._view.width(width);
    this._view.height(height);
  }

  setViewBox(viewBox: IBoundsLike, reRender: boolean = true) {
    if (!this._view) {
      return;
    }

    this._view.renderer.setViewBox(viewBox, reRender);
  }

  addEventListener(
    source: EventSourceType,
    type: string,
    callback: (params: CompilerListenerParameters) => void
  ): void {
    // TODO: 需要明确一下 interactive 的作用范围，同时考虑是否存在非交互行为的事件以及是否需要生效
    if (this._option.interactive === false) {
      return;
    }
    if (source === Event_Source_Type.chart) {
      const wrappedCallback = function (event: any, element: IElement | null) {
        const context = element?.mark?.getContext() ?? {};
        const modelId = isValid(context.modelId) ? context.modelId : null;
        const markId = isValid(context.markId) ? context.markId : null;
        const modelUserId = isValid(context.modelUserId) ? context.modelUserId : null;
        const markUserId = isValid(context.markUserId) ? context.markUserId : null;

        const params: CompilerListenerParameters = {
          event,
          type,
          source,
          item: element,
          datum: element?.getDatum?.() || null,
          markId,
          modelId,
          markUserId,
          modelUserId
        };
        callback.call(null, params);
      }.bind(this);
      this._viewListeners.set(callback, { type, callback: wrappedCallback });
      // 如果 view 已经初始化则立刻挂载监听
      // FIXME: 目前 vgrammar 类型声明没有对齐，事件相关类型声明并没有使用 SceneItem
      this._view?.addEventListener(type, wrappedCallback as any);
    } else if (source === Event_Source_Type.window) {
      const wrappedCallback = function wrappedCallback(event: any) {
        // TODO: vgrammar 暂未提供基于事件直接筛选相应 mark 的能力，这里无法获取到相应的 item
        const params: CompilerListenerParameters = {
          event,
          type,
          source,
          item: null,
          datum: null,
          markId: null,
          modelId: null,
          markUserId: null,
          modelUserId: null
        };
        callback.call(null, params);
      }.bind(this);
      this._windowListeners.set(callback, { type, callback: wrappedCallback });
      const windowObject = this._getGlobalThis();
      windowObject?.addEventListener(type, wrappedCallback);
    } else if (source === Event_Source_Type.canvas) {
      const wrappedCallback = function wrappedCallback(event: any) {
        // TODO: vgrammar 暂未提供基于事件直接筛选相应 mark 的能力，这里无法获取到相应的 item
        const params: CompilerListenerParameters = {
          event,
          type,
          source,
          item: null,
          datum: null,
          markId: null,
          modelId: null,
          markUserId: null,
          modelUserId: null
        };
        callback.call(null, params);
      }.bind(this);
      this._canvasListeners.set(callback, { type, callback: wrappedCallback });
      const canvasObject = this.getStage()?.window;
      canvasObject?.addEventListener(type, wrappedCallback);
    }
  }

  removeEventListener(
    source: EventSourceType,
    type: string,
    callback: (params: CompilerListenerParameters) => void
  ): void {
    if (this._option.interactive === false) {
      return;
    }
    if (source === Event_Source_Type.chart) {
      const wrappedCallback = this._viewListeners.get(callback)?.callback;
      wrappedCallback && this._view?.removeEventListener(type, wrappedCallback);
      this._viewListeners.delete(callback);
    } else if (source === Event_Source_Type.window) {
      const windowObject = this._getGlobalThis();
      const wrappedCallback = this._windowListeners.get(callback)?.callback;
      wrappedCallback && windowObject?.removeEventListener(type, wrappedCallback);
      this._windowListeners.delete(callback);
    } else if (source === Event_Source_Type.canvas) {
      const canvasObject = this._getGlobalThis();
      const wrappedCallback = this._canvasListeners.get(callback)?.callback;
      wrappedCallback && canvasObject?.removeEventListener(type, wrappedCallback);
      this._canvasListeners.delete(callback);
    }
  }

  protected releaseEvent(): void {
    // 相应的事件remove在model中完成
    this._viewListeners.clear();
    this._windowListeners.clear();
    this._canvasListeners.clear();
  }

  release(): void {
    this.releaseEvent();
    this._option = this._container = null as any;
    // vgrammar release
    this._releaseModel();
    this._view?.release();
    this._view = null;
    this.isInited = false;
    this.isReleased = true;
  }

  /**
   * 释放VGrammar
   * @param removeGraphicItems 是否删除场景元素，在同步渲染，并且无动画时，必须设置为true，否则有绘图残留
   */
  releaseGrammar(removeGraphicItems: boolean = false) {
    this._releaseModel();
    if (removeGraphicItems) {
      this._view?.removeAllGraphicItems();
    }
    this._view?.removeAllGrammars();
  }

  protected _releaseModel() {
    // 释放model
    Object.keys(this._model).forEach(type => {
      Object.values(this._model[type] as IProductMap<IGrammarItem>).forEach(grammarItemMap => {
        Object.values(grammarItemMap).forEach((item: IGrammarItem) => {
          item.removeProduct(true); // 保留 vgrammar 语法元素，下面一起清空
        });
      });
      this._model[type] = {};
    });
  }

  /** 添加语法元素 */
  addGrammarItem(grammarItem: IGrammarItem) {
    const product = grammarItem.getProduct();
    if (isNil(product)) {
      return;
    }
    const id = product.id();
    const type = grammarItem.grammarType;
    if (isNil(this._model[type][id])) {
      this._model[type][id] = {};
    }
    this._model[type][id][grammarItem.id] = grammarItem;
  }

  /** 删除语法元素 */
  removeGrammarItem(grammarItem: IGrammarItem, reserveVGrammarModel?: boolean) {
    const product = grammarItem.getProduct();
    if (isNil(product)) {
      return;
    }
    const id = product.id();
    const type = grammarItem.grammarType;
    const map = this._model[type][id];
    if (isValid(map)) {
      delete map[grammarItem.id];
      if (Object.keys(map).length === 0) {
        delete this._model[type][id];
      }
    }
    if (!reserveVGrammarModel) {
      this._view?.removeGrammar(product);
    }
  }

  /** 更新语法元素间的依赖关系，返回是否全部成功更新 */
  updateDepend(items?: IGrammarItem[]): boolean {
    if (isValid(items) && items.length > 0) {
      // 局部更新依赖
      return items.every(item => item.updateDepend());
    }
    // 全局更新依赖
    Object.values(this._model).forEach(productMap => {
      Object.values(productMap).forEach(grammarItemMap => {
        const grammarItems = Object.values(grammarItemMap) as IGrammarItem[];
        // 获取编译产物
        const product = grammarItems[0].getProduct();

        // 获取编译产物的依赖项
        const dependList = grammarItems
          .reduce((depend, item) => {
            if (item.getDepend().length > 0) {
              return depend.concat(item.getDepend());
            }
            return depend;
          }, [] as IGrammarItem[])
          .filter(grammarItem => !!grammarItem)
          .map(grammarItem => grammarItem.getProduct());

        // 更新依赖
        product.depend(dependList);
      });
    });
    return true;
  }

  private _getGlobalThis() {
    return isTrueBrowser(this._option.mode) ? globalThis : this.getStage()?.window;
  }
}
