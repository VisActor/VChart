import { ChartEvent, Event_Source_Type } from './../constant/event';
import type { IElement, InteractionSpec } from '@visactor/vgrammar-core';
import type {
  CompilerListenerParameters,
  ICompiler,
  ICompilerModel,
  IGrammarItem,
  IProductMap,
  IRenderContainer,
  IRenderOption
} from './interface';
// eslint-disable-next-line no-duplicate-imports
import { LayoutState } from './interface';
import { GrammarType } from './interface/compilable-item';
import { isMobileLikeMode, isTrueBrowser } from '../util/env';
import { isString } from '../util/type';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isNil, isObject, isValid, Logger, LoggerLevel } from '@visactor/vutils';
import type { EventSourceType } from '../event/interface';
import type { IChart } from '../chart/interface';
import { createGroup, Stage, vglobal } from '@visactor/vrender-core';
import type { IColor, IEventTarget, IGroup, IStage } from '@visactor/vrender-core';
import type { IMorphConfig } from '../animation/spec';
import type { IVChart } from '../core/interface';
import type { IMark } from '../mark/interface';
import { Factory } from '../core/factory';
import type { Gesture } from '@visactor/vrender-kits';
import { hasCommited } from './util';

type EventListener = {
  type: string;
  callback: (...args: any[]) => void;
};

export class Compiler implements ICompiler {
  protected _rootMarks: IMark[] = [];

  protected _stage: IStage;

  protected _rootGroup: IGroup;

  getRootGroup() {
    return this._rootGroup;
  }

  protected _viewListeners: Map<(...args: any[]) => any, EventListener> = new Map();
  protected _windowListeners: Map<(...args: any[]) => any, EventListener> = new Map();
  protected _canvasListeners: Map<(...args: any[]) => any, EventListener> = new Map();

  isInited: boolean = false;

  private _nextRafId: number;

  protected _width: number;
  protected _height: number;

  protected _container: IRenderContainer;
  protected _option: IRenderOption;
  // 已释放标记
  private _released: boolean = false;

  /** 布局阶段 */
  private _layoutState?: LayoutState;

  protected _model: ICompilerModel = {
    [GrammarType.signal]: {},
    [GrammarType.data]: {},
    [GrammarType.mark]: {}
  };

  protected _interactions: (InteractionSpec & { seriesId?: number; regionId?: number })[];
  getModel() {
    return this._model;
  }

  private _compileChart: IChart = null;

  constructor(container: IRenderContainer, option: IRenderOption) {
    this._container = container;
    this._option = option;
  }

  /**
   * 获取 canvas dom
   * @returns HTMLCanvasElement | undefined
   */
  getCanvas(): HTMLCanvasElement | undefined {
    return this._stage?.window.getNativeHandler().nativeCanvas;
  }

  _gestureController?: Gesture;
  /**
   * 获取 渲染引擎
   */
  getStage(): IStage | undefined {
    return this._stage;
  }

  initView() {
    if (this._released) {
      return;
    }
    this.isInited = true;
    if (this._stage) {
      return;
    }
    const logger = new Logger(this._option.logLevel ?? LoggerLevel.Error);
    if (this._option?.onError) {
      logger.addErrorHandler((...args) => {
        this._option?.onError?.(...args);
      });
    }
    const { autoRefreshDpr, dpr, mode, gestureConfig, interactive, clickInterval, autoPreventDefault, options3d } =
      this._option;

    this._stage =
      this._option.stage ??
      (new Stage({
        width: this._width,
        height: this._height,
        container: this._container.dom ?? null,
        canvas: this._container.canvas ?? null,
        dpr,
        viewBox: this._option.viewBox,
        canvasControled: this._option.canvasControled,
        beforeRender: this._option.beforeRender,
        afterRender: this._option.afterRender,
        disableDirtyBounds: true,
        autoRender: true,
        pluginList: this._option.pluginList,
        enableHtmlAttribute: this._option.enableHtmlAttribute,
        optimize: this._option.optimize,
        supportsTouchEvents: this._option.supportsTouchEvents,
        supportsPointerEvents: this._option.supportsPointerEvents,
        event: {
          clickInterval: clickInterval,
          autoPreventDefault: autoPreventDefault
        },
        ReactDOM: this._option.ReactDOM,
        autoRefresh: isValid(autoRefreshDpr) ? autoRefreshDpr : !isValid(dpr)
      }) as unknown as IStage);

    this._stage.enableIncrementalAutoRender();

    if (options3d?.enable) {
      this._stage.set3dOptions(options3d);
    }

    const group = createGroup({
      x: 0,
      y: 0,
      width: this._width,
      height: this._height
    });
    group.name = 'root';
    this._stage.defaultLayer.appendChild(group);
    this._rootGroup = group;
    const GestureController =
      (isValid(gestureConfig) ? (gestureConfig as any) : isMobileLikeMode(mode)) &&
      interactive !== false &&
      Factory.getStageEventPlugin('gesture');

    if (GestureController) {
      this._gestureController = new GestureController(
        this._stage as unknown as IEventTarget,
        isObject(gestureConfig) ? gestureConfig : {}
      ) as Gesture;
    }
    // 允许手势

    // eventConfig: {
    //   gesture: isValid(gestureConfig) ? (gestureConfig as any) : isMobileLikeMode(mode),
    //   disable: interactive === false,

    // },
    // doLayout: () => {
    //   this._compileChart?.onLayout(this._view);
    // },
    // logger: logger,
    // logLevel: logger.level()
    this._setCanvasStyle();

    // emit afterRender event
    this.getStage().hooks.afterRender.tap('chart-event', this.handleStageRender);

    if (interactive !== false) {
      // 将 view 实例化之前监听的事件挂载到 view 上
      this._viewListeners.forEach(listener => {
        //this._view?.addEventListener(listener.type, listener.callback);
      });
    }
  }

  getLayoutState() {
    return this._layoutState;
  }

  updateLayoutTag() {
    this._layoutState = LayoutState.before;
  }

  protected handleStageRender = () => {
    this._compileChart?.getEvent()?.emit(ChartEvent.afterRender, { chart: this._compileChart });
  };

  private _setCanvasStyle() {
    if (!this._stage) {
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

  protected compileInteractions() {
    // this._view.removeAllInteractions();
    // if (this._interactions?.length) {
    //   const regionCombindInteractions = {};
    //   this._interactions.forEach(interaction => {
    //     if (interaction.regionId) {
    //       const interactionId = `${interaction.regionId}-${interaction.type}-${interaction.id ?? ''}`;
    //       const spec = regionCombindInteractions[interactionId];
    //       if (spec) {
    //         regionCombindInteractions[interactionId] = {
    //           ...spec,
    //           ...interaction,
    //           selector: [...spec.selector, ...(interaction as any).selector]
    //         };
    //       } else {
    //         regionCombindInteractions[interactionId] = interaction;
    //       }
    //     } else {
    //       this._view.interaction(interaction.type, interaction);
    //     }
    //   });
    //   Object.keys(regionCombindInteractions).forEach(key => {
    //     const interaction = this._view.interaction(regionCombindInteractions[key].type, regionCombindInteractions[key]);
    //     if (this._compileChart) {
    //       const region = this._compileChart.getRegionsInIds([regionCombindInteractions[key].regionId])[0];
    //       if (region) {
    //         region.interaction.addVgrammarInteraction(interaction.getStartState(), interaction);
    //       }
    //     }
    //   });
    // }
  }

  compile(ctx: { chart: IChart; vChart: IVChart }, option: any) {
    if (this._released) {
      return;
    }
    const { chart } = ctx;
    this._compileChart = chart;
    this.initView();
    if (!this._stage) {
      return;
    }

    chart.compile();
    chart.afterCompile();
    this.updateDepend();

    this.compileInteractions();
  }
  protected clearNextRender() {
    if (this._nextRafId) {
      vglobal.getCancelAnimationFrame()(this._nextRafId);
      this._nextRafId = null;

      return true;
    }

    return false;
  }

  clear(ctx: { chart: IChart; vChart: IVChart }, removeGraphicItems: boolean = false) {
    const { chart } = ctx;

    this.clearNextRender();
    chart.clear();
    this.releaseGrammar(removeGraphicItems);
  }

  renderNextTick(morphConfig?: IMorphConfig): void {
    if (this._released) {
      return;
    }
    if (this._nextRafId) {
      this.clearNextRender();
    }

    this._nextRafId = vglobal.getRequestAnimationFrame()(() => {
      this._nextRafId = null;
      this.render(morphConfig);
    }) as unknown as number;
  }

  protected _hasCommitedMark() {
    return this._rootMarks.some(hasCommited);
  }

  renderMarks(morphConfig?: IMorphConfig) {
    if (!this._hasCommitedMark()) {
      return;
    }

    // 更新所有的mark
    this._rootMarks.forEach(mark => {
      mark.render();
    });

    this._layoutState = LayoutState.layouting;
    this._compileChart?.onLayout();
    this._layoutState = LayoutState.reevaluate;

    if (this._hasCommitedMark()) {
      // 第二次更新所有的mark
      this._rootMarks.forEach(mark => {
        mark.render();
      });
    }
  }

  render(morphConfig?: IMorphConfig) {
    if (this._released) {
      return;
    }
    this.clearNextRender();

    this.initView();
    if (!this._stage) {
      return;
    }

    const { width, height } = this._rootGroup.attribute;

    // 更新rootGroup的宽高
    if (this._width !== width || this._height !== height) {
      this._rootGroup.setAttributes({ width: this._width, height: this._height });
    }

    this.renderMarks(morphConfig);
    if (this.clearNextRender()) {
      this.renderMarks(morphConfig);
    }
  }

  updateViewBox(viewBox: IBoundsLike, reRender: boolean = true) {
    if (!this._stage) {
      return;
    }
    const prevViewBox = this._stage.viewBox;
    if (
      viewBox &&
      (!prevViewBox ||
        prevViewBox.x1 !== viewBox.x1 ||
        prevViewBox.y1 !== viewBox.y1 ||
        prevViewBox.x2 !== viewBox.x2 ||
        prevViewBox.y2 !== viewBox.y2)
    ) {
      (this._stage as any).setViewBox(viewBox, reRender);
    }
  }

  resize(width: number, height: number, reRender: boolean = true) {
    if (!this._stage) {
      return;
    }
    const hasChange = this._width !== width || this._height !== height;

    this._width = width;
    this._height = height;

    if (hasChange) {
      this._stage.resize(width, height);
    }
    // todo resize
    if (reRender) {
      this.render({ morph: false });
    }
  }

  setBackground(color: IColor) {
    if (this._stage) {
      this._stage.background = color;
    }
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    if (!this._stage) {
      return;
    }

    // todo set size of stage
  }

  setViewBox(viewBox: IBoundsLike, reRender: boolean = true) {
    this.updateViewBox(viewBox, reRender);
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
      //todo
      this._stage?.addEventListener(type, wrappedCallback as any);
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
      wrappedCallback && this._stage?.removeEventListener(type, wrappedCallback);
      this._viewListeners.delete(callback);
    } else if (source === Event_Source_Type.window) {
      const windowObject = this._getGlobalThis();
      const wrappedCallback = this._windowListeners.get(callback)?.callback;
      wrappedCallback && windowObject?.removeEventListener(type, wrappedCallback);
      this._windowListeners.delete(callback);
    } else if (source === Event_Source_Type.canvas) {
      const canvasObject = this.getStage()?.window;
      const wrappedCallback = this._canvasListeners.get(callback)?.callback;
      canvasObject && wrappedCallback && canvasObject?.removeEventListener(type, wrappedCallback);
      this._canvasListeners.delete(callback);
    }
  }

  protected releaseEvent(): void {
    const stage = this.getStage();

    if (stage) {
      stage.hooks.afterRender.unTap('chart-event', this.handleStageRender);
    }

    // 相应的事件remove在model中完成
    this._viewListeners.clear();
    this._windowListeners.clear();
    this._canvasListeners.clear();
  }

  release(): void {
    this.clearNextRender();
    this.releaseEvent();
    this._option = this._container = null as any;
    // vgrammar release
    this._releaseModel();

    if (this._stage !== this._option?.stage) {
      // don't release the stage created by outside
      this._stage.release();
    }
    this._stage = null;

    this.isInited = false;
    this._compileChart = null;
    this._released = true;
  }

  /**
   * 释放VGrammar
   * @param removeGraphicItems 是否删除场景元素，在同步渲染，并且无动画时，必须设置为true，否则有绘图残留
   */
  releaseGrammar(removeGraphicItems: boolean = false) {
    this._releaseModel();
    if (removeGraphicItems) {
      // this._view?.removeAllGraphicItems();
    }
    // this._view?.removeAllGrammars();
  }

  protected _releaseModel() {
    // 释放model
    Object.keys(this._model).forEach(type => {
      Object.values((this._model as any)[type] as IProductMap<IGrammarItem>).forEach(grammarItemMap => {
        Object.values(grammarItemMap).forEach((item: IGrammarItem) => {
          item.removeProduct(true); // 保留 vgrammar 语法元素，下面一起清空
        });
      });
      (this._model as any)[type] = {};
    });
  }

  addRootMark(mark: IMark) {
    if (!this._rootMarks.includes(mark)) {
      this._rootMarks.push(mark);
    }
  }

  getRootMarks() {
    return this._rootMarks;
  }

  /** 添加语法元素 */
  addGrammarItem(grammarItem: IGrammarItem) {
    if (isNil(grammarItem)) {
      return;
    }
    const id = grammarItem.getProductId();
    const type = grammarItem.grammarType;
    if (isNil(this._model[type][id])) {
      this._model[type][id] = {};
    }
    this._model[type][id][grammarItem.id] = grammarItem;
  }

  /** 删除语法元素 */
  removeGrammarItem(grammarItem: IGrammarItem, reserveVGrammarModel?: boolean) {
    if (isNil(grammarItem)) {
      return;
    }
    const id = grammarItem.getProductId();
    const type = grammarItem.grammarType;
    const map = this._model[type][id];
    if (isValid(map)) {
      delete map[grammarItem.id];
      if (Object.keys(map).length === 0) {
        delete this._model[type][id];
      }
    }
    if (!reserveVGrammarModel) {
      // todo this._view?.removeGrammar(product);
    }
  }

  addInteraction(interaction: InteractionSpec & { seriesId?: number; regionId?: number }) {
    if (!this._interactions) {
      this._interactions = [];
    }

    this._interactions.push(interaction);
  }

  removeInteraction(seriesId: number) {
    if (!this._interactions) {
      return;
    }

    this._interactions = this._interactions.filter(entry => entry.seriesId !== seriesId);
  }

  /** 更新语法元素间的依赖关系，返回是否全部成功更新 */
  updateDepend(): boolean {
    // 全局更新依赖
    // Object.values(this._model).forEach(productMap => {
    //   Object.values(productMap).forEach(grammarItemMap => {
    //     const grammarItems = Object.values(grammarItemMap) as IGrammarItem[];

    //     // 获取编译产物的依赖项
    //     const dependList = grammarItems
    //       .reduce((depend, item) => {
    //         if (item.getDepend().length > 0) {
    //           return depend.concat(item.getDepend());
    //         }
    //         return depend;
    //       }, [] as IGrammarItem[])
    //       .filter(grammarItem => !!grammarItem)
    //       .map(grammarItem => grammarItem.getProductId());

    //     // 更新依赖
    //     grammarItems[0].depend(dependList);
    //   });
    // });
    return true;
  }

  private _getGlobalThis() {
    return isTrueBrowser(this._option.mode) ? globalThis : this.getStage()?.window;
  }
}
