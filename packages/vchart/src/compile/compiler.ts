import { ChartEvent, Event_Source_Type } from './../constant/event';
import type {
  CompilerListenerParameters,
  ICompiler,
  ICompilerModel,
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
import { isObject, isValid } from '@visactor/vutils';
import type { EventSourceType } from '../event/interface';
import type { IChart } from '../chart/interface';
import { createGroup, Stage, vglobal, waitForAllSubLayers } from '@visactor/vrender-core';
import type { IColor, IEventTarget, IGroup, IStage } from '@visactor/vrender-core';
import type { IMorphConfig } from '../animation/spec';
import type { IVChart, IVChartRenderOption } from '../core/interface';
import { type IGraphicContext, type IMark, type IMarkGraphic } from '../mark/interface';
import { Factory } from '../core/factory';
import type { Gesture } from '@visactor/vrender-kits';
import { findMarkGraphic, getDatumOfGraphic } from '../util/mark';
import { diffMarks, findSimpleMarks, traverseGroupMark } from './util';
import { log } from '../util/debug';

type EventListener = {
  type: string;
  callback: (...args: any[]) => void;
};

export class Compiler implements ICompiler {
  private _count: number = 0;
  /**
   *  更新后缓存的mark
   */
  private _cachedMarks: IMark[];

  private _progressiveMarks?: IMark[];

  /**
   * 增量渲染相关的raf id
   */
  private _progressiveRafId?: number;

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

    const {
      autoRefreshDpr,
      dpr,
      mode,
      gestureConfig,
      interactive,
      clickInterval,
      autoPreventDefault,
      options3d,
      background
    } = this._option;
    this._stage =
      this._option.stage ??
      (new Stage({
        background,
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
        ticker: this._option.ticker,
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
    // 之前vgrammar 设置了一些默认配置
    (this._stage as any).setTheme({
      symbol: {
        shape: 'circle',
        size: 8
      },
      text: {
        fontSize: 14,
        fill: '#000000'
      }
    });

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

  protected handleLayoutEnd = () => {
    this._compileChart?.getEvent()?.emit(ChartEvent.afterMarkLayoutEnd, { chart: this._compileChart });
  };

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

  compile(ctx: { chart: IChart; vChart: IVChart }, option?: IVChartRenderOption) {
    if (this._released) {
      return;
    }
    const { chart } = ctx;
    this._compileChart = chart;
    this.initView();
    if (!this._stage) {
      return;
    }

    if (option?.actionSource !== 'render' && this._cachedMarks) {
      this.reuseOrMorphing(option.morphConfig);
      // 清除缓存
      this._cachedMarks = null;
    }

    chart.compile();
    chart.afterCompile();
  }
  protected clearNextRender() {
    if (this._nextRafId) {
      vglobal.getSpecifiedCancelAnimationFrame(10)(this._nextRafId);
      this._nextRafId = null;

      return true;
    }

    return false;
  }

  clear(ctx: { chart: IChart; vChart: IVChart }) {
    const { chart } = ctx;

    this.clearNextRender();
    chart.clear();
  }

  renderNextTick(morphConfig?: IMorphConfig): void {
    if (this._released) {
      return;
    }
    if (this._nextRafId) {
      this.clearNextRender();
    }

    this._nextRafId = vglobal.getSpecifiedRequestAnimationFrame(10)(() => {
      this._nextRafId = null;
      this.render(morphConfig);
    }) as unknown as number;
  }

  protected _commitedAll() {
    return this._rootMarks.some(mark => {
      return traverseGroupMark(mark, m => m.commit());
    });
  }

  protected _hasCommitedMark() {
    return this._rootMarks.some(mark => {
      return traverseGroupMark(mark, m => m.isCommited(), null, null, true);
    });
  }

  private _handleAfterNextRender = () => {
    if (this._stage && !this._option.disableDirtyBounds) {
      this._stage.enableDirtyBounds();
    }
  };

  private _doRender(immediately: boolean) {
    if (this._stage) {
      this._rootMarks.forEach(g => {
        traverseGroupMark(
          g,
          m => {
            if (!this._progressiveMarks) {
              m.runAnimation();
            }
            m.clearExitGraphics();
          },
          null,
          true
        );
      });

      // 全量渲染的时候先关闭dirty bounds 提升性能
      this._stage.disableDirtyBounds();
      this._stage.afterNextRender(this._handleAfterNextRender);

      if (immediately) {
        this._stage.render();
      }
    }
  }

  renderMarks() {
    if (!this._hasCommitedMark()) {
      return;
    }

    log(`--- start of renderMarks(${this._count}) ---`);
    this.clearProgressive();

    // 更新所有的mark
    this._rootMarks.forEach(mark => {
      mark.render();
    });

    if (this._layoutState === LayoutState.before) {
      // 需要更新布局
      this._layoutState = LayoutState.layouting;
      this._compileChart?.onLayout();
      this._layoutState = LayoutState.reevaluate;

      if (this._hasCommitedMark()) {
        // 第二次更新所有的mark
        this._rootMarks.forEach(mark => {
          mark.render();
        });
      }
      this.handleLayoutEnd();
    }

    this.findProgressiveMarks();

    this._doRender(true);
    this.doPreProgressive();

    log(`--- start of renderMarks(${this._count}) ---`);
    this._count++;
  }

  reuseOrMorphing(morphConfig: IMorphConfig = {}) {
    const { reuse = true, morph = true, morphAll = false, animation = {}, enableExitAnimation = false } = morphConfig;
    const newMarks = findSimpleMarks(this._rootMarks);
    const { update, exit } = diffMarks(this._cachedMarks, newMarks, { morph, morphAll, reuse });

    update.forEach(({ prev, next }) => {
      // const enableMarkMorphConfig =
      //   prev.every(mark => mark.getMarkConfig().morph) && next.every(mark => mark.getMarkConfig().morph);

      // 优先复用
      if (reuse && prev.length === 1 && next.length === 1 && prev[0].type === next[0].type) {
        next[0].reuse(prev[0]);
      } else {
        // 执行morphing
        const prevMark = prev.filter(item => item.getMarkConfig().morph)[0];
        prevMark &&
          next.forEach(item => {
            item.getMarkConfig().morph && item.prepareMorph(prevMark);
          });
      }
    });

    // todo 离场元素执行exit动画
    exit.forEach(({ prev }) => {
      prev.forEach(m => {
        m.removeProduct();
      });
    });
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

    this.renderMarks();
    if (this.clearNextRender()) {
      this.renderMarks();
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
      this._commitedAll();

      // todo resize
      if (reRender) {
        this.render({ morph: false });
      }
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
      const rootGroup = this.getRootGroup();
      const wrappedCallback = function (event: any) {
        const graphic = event.target;
        let markGraphic: IMarkGraphic = null;

        if (graphic) {
          if (isValid(graphic.context)) {
            markGraphic = graphic;
          } else {
            markGraphic = findMarkGraphic(rootGroup, graphic) as unknown as IMarkGraphic;
          }
        }
        const context = (markGraphic?.context ?? {}) as Partial<IGraphicContext>;
        const markId = isValid(context.markId) ? context.markId : null;
        const modelId = isValid(context.modelId) ? context.modelId : null;
        const modelUserId = isValid(context.modelUserId) ? context.modelUserId : null;
        const markUserId = isValid(context.markUserId) ? context.markUserId : null;

        const params: CompilerListenerParameters = {
          event,
          type,
          source,
          item: markGraphic,
          datum: getDatumOfGraphic(markGraphic), // 是否要区分图元
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
    this.releaseGrammar(true);

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
    // this._releaseModel();
    if (removeGraphicItems) {
      // 彻底删除图形
      this._rootMarks.forEach(g => {
        traverseGroupMark(
          g,
          m => {
            m.removeProduct();
          },
          null,
          true
        );
      });
    } else {
      this._cachedMarks = findSimpleMarks(this._rootMarks);
    }
    this._rootMarks = [];
  }

  // protected _releaseModel() {
  //   // 释放model
  //   Object.keys(this._model).forEach(type => {
  //     Object.values((this._model as any)[type] as IProductMap<IGrammarItem>).forEach(grammarItemMap => {
  //       Object.values(grammarItemMap).forEach((item: IGrammarItem) => {
  //         item.removeProduct(true); // 保留 vgrammar 语法元素，下面一起清空
  //       });
  //     });
  //     (this._model as any)[type] = {};
  //   });
  // }

  addRootMark(mark: IMark) {
    if (!this._rootMarks.includes(mark)) {
      this._rootMarks.push(mark);
    }
  }

  getRootMarks() {
    return this._rootMarks;
  }

  removeRootMark(mark: IMark) {
    const index = this._rootMarks.findIndex(m => m === mark);

    if (index >= 0) {
      this._rootMarks.splice(index, 1);

      return true;
    }
    return false;
  }

  private _getGlobalThis() {
    return isTrueBrowser(this._option.mode) ? globalThis : this.getStage()?.window;
  }

  private _combineIncrementalLayers() {
    if (this._stage) {
      waitForAllSubLayers(this._stage).then(() => {
        // stage might be null in current tick
        if (this._stage) {
          this._stage.defaultLayer.combineSubLayer();
        }
      });
    }
  }

  private findProgressiveMarks() {
    const marks: IMark[] = [];

    this._rootMarks.forEach(mark => {
      traverseGroupMark(mark, m => {
        if (m.isProgressive()) {
          marks.push(m);
        }
      });
    });

    if (!marks.length) {
      this._progressiveMarks = null;
      return null;
    }

    this._progressiveMarks = marks;

    this._combineIncrementalLayers();

    return marks;
  }

  private doPreProgressive() {
    if (this._progressiveMarks && this._progressiveMarks.some(mark => mark.isDoingProgressive())) {
      const raf = vglobal.getSpecifiedRequestAnimationFrame(10);
      this._progressiveRafId = raf(this.handleProgressiveFrame);
    } else if (this._progressiveMarks && this._progressiveMarks.every(mark => mark.canAnimateAfterProgressive())) {
      this._progressiveMarks.forEach(mark => {
        mark.runAnimation();
      });
    } else if (this._progressiveMarks) {
      this._progressiveMarks = null;
    }
  }

  /** 监听frame事件，更新增量元素的mark */
  private handleProgressiveFrame = () => {
    if (this._progressiveMarks.length) {
      this._progressiveMarks.forEach(mark => {
        if (mark.isDoingProgressive()) {
          mark.renderProgressive();
        }
      });
    }

    this.doPreProgressive();
  };

  /** 清除 */
  private clearProgressive() {
    if (this._progressiveRafId) {
      const cancelRaf = vglobal.getSpecifiedCancelAnimationFrame(10);
      cancelRaf(this._progressiveRafId);
    }

    if (this._progressiveMarks && this._progressiveMarks.length) {
      this._progressiveMarks.forEach(entry => {
        entry.clearProgressive();
      });

      this._progressiveMarks = null;
    }
  }
}
