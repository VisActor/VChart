import type { ISeries } from '../series/interface/series';
import { arrayParser } from '../data/parser/array';
import type { ILayoutConstructor, LayoutCallBack } from '../layout/interface';
import type { IDataValues, IMarkStateSpec, IInitOption } from '../typings/spec/common';
// eslint-disable-next-line no-duplicate-imports
import { RenderModeEnum } from '../typings/spec/common';
import type { ISeriesConstructor } from '../series/interface';
import type {
  DimensionIndexOption,
  IChart,
  IChartConstructor,
  IChartSpecInfo,
  IChartSpecTransformer
} from '../chart/interface';
import type { IComponentConstructor } from '../component/interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../component/interface/type';
import type {
  EventCallback,
  EventParams,
  EventParamsDefinition,
  EventQuery,
  EventType,
  IEvent,
  IEventDispatcher
} from '../event/interface';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { IFields, Transform, DataView } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import { DataSet, dataViewParser } from '@visactor/vdataset';
import type { Stage } from '@visactor/vrender-core';
import { isString, isValid, isNil, array, debounce, functionTransform } from '../util';
import { createID } from '../util/id';
import { convertPoint } from '../util/space';
import { isTrueBrowser } from '../util/env';
import { warn } from '../util/debug';
import { mergeSpec, mergeSpecWithFilter } from '../util/spec/merge-spec';
import { specTransform } from '../util/spec/transform';
import { getThemeObject } from '../util/theme/common';
import { Factory } from './factory';
import { Event } from '../event/event';
import { EventDispatcher } from '../event/event-dispatcher';
import type { GeoSourceType } from '../typings/geo';
import type { GeoSourceOption } from '../series/map/geo-source';
// eslint-disable-next-line no-duplicate-imports
import { getMapSource } from '../series/map/geo-source';
// eslint-disable-next-line no-duplicate-imports
import type { IMark, MarkConstructor } from '../mark/interface';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../data/register';
import { dataToDataView } from '../data/initialize';
import { stackSplit } from '../data/transforms/stack-split';
import { copyDataView } from '../data/transforms/copy-data-view';
import type { ITooltipHandler } from '../typings/tooltip';
import type { Tooltip } from '../component/tooltip';
import type {
  Datum,
  IPoint,
  IRegionQuerier,
  IShowTooltipOption,
  ISpec,
  Maybe,
  MaybeArray,
  StringOrNumber
} from '../typings';
import { AnimationStateEnum } from '../animation/interface';
import type { IBoundsLike, ILogger } from '@visactor/vutils';
import { ThemeManager } from '../theme/theme-manager';
import type { ITheme } from '../theme';
import type { IModel, IUpdateSpecResult } from '../model/interface';
import { Compiler } from '../compile/compiler';
import type { IMorphConfig } from '../animation/spec';
import type { ILegend } from '../component/legend/interface';
import { getCanvasDataURL, URLToImage } from '../util/image';
import { ChartEvent, DEFAULT_CHART_HEIGHT, DEFAULT_CHART_WIDTH, VGRAMMAR_HOOK_EVENT } from '../constant';
// eslint-disable-next-line no-duplicate-imports
import {
  isArray,
  isEmpty,
  Logger,
  merge as mergeOrigin,
  isFunction,
  LoggerLevel,
  isEqual,
  get,
  cloneDeep
} from '@visactor/vutils';
import type {
  DataLinkAxis,
  DataLinkSeries,
  IGlobalConfig,
  IVChart,
  IVChartRenderOption,
  VChartRenderActionSource
} from './interface';
import { InstanceManager } from './instance-manager';
import type { IAxis } from '../component/axis';
import { setPoptipTheme } from '@visactor/vrender-components';
import { calculateChartSize, mergeUpdateResult } from '../chart/util';
import { Region } from '../region/region';
import { Layout } from '../layout/base-layout';
import { registerGroupMark } from '../mark/group';
import { registerVGrammarCommonAnimation } from '../animation/config';
import { View, registerFilterTransform, registerMapTransform } from '@visactor/vgrammar-core';
import { VCHART_UTILS } from './util';
import { ExpressionFunction } from './expression-function';
import { registerBrowserEnv, registerNodeEnv } from '../env';
import { mergeTheme, preprocessTheme } from '../util/spec';
import { darkTheme, registerTheme } from '../theme/builtin';
import type { IChartPluginService } from '../plugin/chart/interface';
import { ChartPluginService } from '../plugin/chart/plugin-service';

export class VChart implements IVChart {
  readonly id = createID();

  /**
   *  按需注册图表和组件
   * @param comps
   * @since 1.5.1
   */
  static useRegisters(comps: (() => void)[]) {
    comps.forEach((fn: () => void) => {
      if (typeof fn === 'function') {
        // 确保元素是函数类型
        fn();
      } else {
        console.error('Invalid function:', fn);
      }
    });
  }

  /**
   * 注册自定义图表
   * @param charts 图表类
   * @description 若用于按需加载，1.5.1版本后，请统一使用 `useRegisters` API，例如:`VChart.useRegisters([registerLineChart])`。
   */
  static useChart(charts: IChartConstructor[]) {
    charts.forEach(c => Factory.registerChart(c.type, c));
  }
  /**
   * 注册自定义系列
   * @param series 系列类
   * @description  若用于按需加载，1.5.1版本后，统一使用 `useRegisters` API，例如 `VChart.useRegisters([registerLineSeries])`。
   */
  static useSeries(series: ISeriesConstructor[]) {
    series.forEach(s => Factory.registerSeries(s.type, s));
  }
  /**
   * 注册自定义组件
   * @param components 组件类
   * @description 若用于按需加载，1.5.1版本后，统一使用 `useRegisters` API，例如 `VChart.useRegisters([registerCartesianLinearAxis])`。
   */
  static useComponent(components: IComponentConstructor[]) {
    components.forEach(c => Factory.registerComponent(c.type, c));
  }
  /**
   * 注册自定义 Mark
   * @param marks Mark 图元类
   */
  static useMark(marks: MarkConstructor[]) {
    marks.forEach(m => Factory.registerMark(m.constructorType ?? m.type, m));
  }
  /**
   * 注册自定义布局
   * @param layouts 布局类
   */
  static useLayout(layouts: ILayoutConstructor[]) {
    layouts.forEach(l => Factory.registerLayout(l.type, l));
  }
  /**
   * 注册 DataSet 数据方法
   * @param name 数据 transform 方法名称
   * @param transform 具体的 Transform 执行方法
   */
  static registerDataSetTransform(name: string, transform: Transform) {
    Factory.registerTransform(name, transform);
  }

  /**
   * 注册函数（全局注册）
   * @param key 函数名称
   * @param fun 函数内容
   */
  static registerFunction(key: string, fun: Function) {
    if (!key || !fun) {
      return;
    }
    ExpressionFunction.instance().registerFunction(key, fun);
  }

  /**
   * 注销函数（全局注销）
   * @param key 函数名称
   */
  static unregisterFunction(key: string) {
    if (!key) {
      return;
    }
    ExpressionFunction.instance().unregisterFunction(key);
  }

  /**
   * 获取函数（全局）
   * @param key
   * @returns
   */
  static getFunction(key: string): Function | null {
    if (!key) {
      return null;
    }
    return ExpressionFunction.instance().getFunction(key);
  }

  /**
   * 获取函数列表（全局获取）
   * @returns
   */
  static getFunctionList(): string[] | null {
    return ExpressionFunction.instance().getFunctionNameList();
  }

  /**
   * 注册地图数据
   * @param key 地图名称
   * @param source 地图数据
   * @param option 地图数据配置
   */
  static registerMap(key: string, source: GeoSourceType, option?: GeoSourceOption) {
    const impl = Factory.getImplementInKey('registerMap');
    impl && impl(key, source, option);
  }

  /**
   * 注销地图数据
   * @param key 地图名称
   */
  static unregisterMap(key: string) {
    const impl = Factory.getImplementInKey('unregisterMap');
    impl && impl(key);
  }

  /**
   * 根据地图名称获取地图数据
   * @param key 地图名称
   * @returns 地图数据
   */
  static getMap(key: string): GeoSourceType {
    return getMapSource(key);
  }

  /**
   * 全局关闭 tooltip
   * @param excludeId 可选，指定不需要关闭 tooltip 的实例 id
   */
  static hideTooltip(excludeId: MaybeArray<number> = []): void {
    InstanceManager.forEach(instance => instance?.hideTooltip?.(), excludeId);
  }

  /** 获取 Logger */
  static getLogger(): ILogger {
    return Logger.getInstance();
  }

  /** 图表实例管理器 */
  static readonly InstanceManager = InstanceManager;
  /** 主题管理器 */
  static readonly ThemeManager = ThemeManager;

  /** 全局配置 */
  static globalConfig: IGlobalConfig = {
    uniqueTooltip: true
  };

  /** 工具方法 */
  static readonly Utils = VCHART_UTILS;

  protected _originalSpec: any;
  protected _spec: any;
  getSpec() {
    return this._spec;
  }

  protected _specInfo: IChartSpecInfo;
  getSpecInfo() {
    return this._specInfo;
  }

  private _viewBox: IBoundsLike;
  private _chart!: Maybe<IChart>;
  private _chartSpecTransformer!: Maybe<IChartSpecTransformer>;
  private _compiler: Compiler;
  private _event: Maybe<IEvent>;
  private _userEvents: {
    eType: EventType;
    query: EventQuery | EventCallback<EventParamsDefinition[EventType]>;
    handler?: EventCallback<EventParamsDefinition[EventType]>;
  }[] = [];
  private _eventDispatcher: Maybe<IEventDispatcher>;
  private _dataSet!: Maybe<DataSet>;
  getDataSet() {
    return this._dataSet;
  }

  private _container?: HTMLElement;
  private _canvas?: HTMLCanvasElement | OffscreenCanvas | string;
  private _stage?: Stage;

  private _autoSize: boolean = true;
  private _option: IInitOption = {
    mode: RenderModeEnum['desktop-browser'],
    onError: (msg: string) => {
      throw new Error(msg);
    },
    optimize: {
      disableCheckGraphicWidthOutRange: true
    }
  };

  private _currentSize: { width: number; height: number };
  private _observer: ResizeObserver = null;

  private _currentThemeName: string;
  private _currentTheme: ITheme;

  private _onError?: (...args: any[]) => void;

  private _context: any = {}; // 存放用户在model初始化前通过实例方法传入的配置等
  private _isReleased: boolean;

  private _chartPlugin?: IChartPluginService;

  constructor(spec: ISpec, options: IInitOption) {
    this._option = mergeOrigin(this._option, { animation: (spec as any).animation !== false }, options);
    this._onError = this._option?.onError;

    const { dom, renderCanvas, mode, stage, poptip, ...restOptions } = this._option;
    const isTrueBrowseEnv = isTrueBrowser(mode);

    if (isTrueBrowseEnv && dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    if (renderCanvas) {
      this._canvas = renderCanvas;
    }
    if (stage) {
      this._stage = stage as unknown as Stage; // FIXME: 等待 vrender 解决类型和接口不匹配的问题 @zhouxinyu
    }

    if (mode !== 'node' && !this._container && !this._canvas && !this._stage) {
      this._option?.onError('please specify container or renderCanvas!');
      return;
    }
    // 根据 mode 配置动态加载浏览器或 node 环境代码
    if (isTrueBrowseEnv) {
      registerBrowserEnv();
    } else if (mode === 'node') {
      registerNodeEnv();
    }

    this._viewBox = this._option.viewBox;
    this._currentThemeName = ThemeManager.getCurrentThemeName();
    this._setNewSpec(spec);
    this._updateCurrentTheme();
    this._currentSize = this.getCurrentSize();
    this._compiler = new Compiler(
      {
        dom: this._container ?? 'none',
        canvas: renderCanvas
      },
      {
        mode: this._option.mode,
        stage,
        pluginList: poptip !== false ? ['poptipForText'] : [],
        ...restOptions,
        background: this._getBackground(),
        onError: this._onError
      }
    );
    this._compiler.setSize(this._currentSize.width, this._currentSize.height);
    this._eventDispatcher = new EventDispatcher(this, this._compiler);
    this._event = new Event(this._eventDispatcher, mode);
    this._compiler.initView();
    // TODO: 如果通过 updateSpec 更新主题字体的验证
    // 设置全局字体
    this.getStage()?.setTheme({
      text: { fontFamily: this._currentTheme?.fontFamily as string }
    });
    this._initDataSet(this._option.dataSet);
    this._autoSize = isTrueBrowseEnv ? spec.autoFit ?? this._option.autoFit ?? true : false;
    this._bindResizeEvent();
    this._bindVGrammarViewEvent();
    this._initChartPlugin();

    InstanceManager.registerInstance(this);
  }

  /** 设置新 spec，返回是否成功 */
  private _setNewSpec(spec: any, forceMerge?: boolean): boolean {
    if (!spec) {
      return false;
    }
    if (isString(spec)) {
      spec = JSON.parse(spec);
    }
    if (forceMerge && this._originalSpec) {
      spec = mergeSpec({}, this._originalSpec, spec);
    }
    this._originalSpec = spec;
    this._spec = this._getSpecFromOriginalSpec();
    return true;
  }

  private _getSpecFromOriginalSpec() {
    // 转换在实例上注册的函数 + 深拷贝 spec，保证 _originalSpec 和 _spec 的不同
    const spec = specTransform(this._originalSpec) as any;
    // because of in data-init, data will be set as array;
    spec.data = spec.data ?? [];
    return spec;
  }

  private _initChartSpec(spec: any, actionSource: VChartRenderActionSource) {
    // 如果用户注册了函数，在配置中替换相应函数名为函数内容
    if (VChart.getFunctionList() && VChart.getFunctionList().length) {
      spec = functionTransform(spec, VChart);
    }
    this._spec = spec;
    if (!this._chartSpecTransformer) {
      this._chartSpecTransformer = Factory.createChartSpecTransformer(this._spec.type, {
        type: this._spec.type,
        getTheme: () => this._currentTheme ?? {},
        animation: this._option.animation
      });
    }

    this._chartSpecTransformer.transformSpec(this._spec);

    // 插件生命周期
    this._chartPluginApply('onAfterChartSpecTransform', this._spec, actionSource);

    this._specInfo = this._chartSpecTransformer?.transformModelSpec(this._spec);

    // 插件生命周期
    this._chartPluginApply('onAfterModelSpecTransform', this._spec, this._specInfo, actionSource);
  }

  private _updateSpecInfo() {
    if (!this._chartSpecTransformer) {
      this._chartSpecTransformer = Factory.createChartSpecTransformer(this._spec.type, {
        type: this._spec.type,
        getTheme: () => this._currentTheme ?? {}
      });
    }
    this._specInfo = this._chartSpecTransformer?.createSpecInfo(this._spec);
  }

  private _initChart(spec: any) {
    if (!this._compiler) {
      this._option?.onError('compiler is not initialized');
      return;
    }
    if (this._chart) {
      this._option?.onError('chart is already initialized');
      return;
    }

    // 放到这里而不是放到chart内的考虑
    // 用户spec更新，也许会有core上图表实例的内容存在
    // 如果要支持spec的类似Proxy监听，更新逻辑应当从这一层开始。如果在chart上做，就需要在再向上发送spec更新消息，不是很合理。
    // todo: 问题1 存不存在 chart 需要在这个阶段处理的特殊字段？目前没有，但是理论上可以有？
    const chart = Factory.createChart(spec.type, spec, {
      type: spec.type,
      globalInstance: this,
      eventDispatcher: this._eventDispatcher!,
      dataSet: this._dataSet!,
      container: this._container,
      canvas: this._canvas,
      map: new Map(),
      mode: this._option.mode || RenderModeEnum['desktop-browser'],
      modeParams: this._option.modeParams,
      getCompiler: () => this._compiler,
      performanceHook: this._option.performanceHook,
      viewBox: this._viewBox,
      animation: this._option.animation,
      getTheme: () => this._currentTheme ?? {},
      getSpecInfo: () => this._specInfo ?? {},

      layout: this._option.layout,
      onError: this._onError,
      disableTriggerEvent: this._option.disableTriggerEvent === true
    });
    if (!chart) {
      this._option?.onError('init chart fail');
      return;
    }
    this._chart = chart;
    this._chart.setCanvasRect(this._currentSize.width, this._currentSize.height);
    this._chart.created();
    this._chart.init();
    this._event.emit(ChartEvent.initialized, {});
  }

  private _releaseData() {
    if (this._dataSet) {
      // Object.values(this._dataSet.dataViewMap).forEach(d => {
      //   d.target.removeAllListeners();
      //   d.destroy();
      // });
      this._dataSet.dataViewMap = {};
      this._dataSet = null;
    }
  }

  private _bindVGrammarViewEvent() {
    if (!this._compiler) {
      return;
    }
    this._compiler.getVGrammarView().addEventListener(VGRAMMAR_HOOK_EVENT.ALL_ANIMATION_END, () => {
      this._event.emit(ChartEvent.animationFinished, {});
    });
    this._compiler.getVGrammarView().addEventListener(VGRAMMAR_HOOK_EVENT.AFTER_VRENDER_NEXT_RENDER, () => {
      this._event.emit(ChartEvent.renderFinished, {});
    });
  }

  private _bindResizeEvent() {
    if (this._autoSize) {
      if (this._container) {
        const ResizeObserverWindow: any = window.ResizeObserver;
        this._observer = new ResizeObserverWindow(this._onResize);
        this._observer?.observe(this._container);
      }
      window.addEventListener('resize', this._onResize);
    }
  }

  private _unBindResizeEvent() {
    if (this._autoSize) {
      window.removeEventListener('resize', this._onResize);
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
    }
  }

  getCurrentSize() {
    return calculateChartSize(
      this._spec,
      {
        container: this._container,
        canvas: this._canvas,
        mode: this._option.mode || RenderModeEnum['desktop-browser'],
        modeParams: this._option.modeParams
      },
      {
        width: this._currentSize?.width ?? DEFAULT_CHART_WIDTH,
        height: this._currentSize?.height ?? DEFAULT_CHART_HEIGHT
      }
    );
  }

  private _doResize() {
    const { width, height } = this.getCurrentSize();
    if (this._currentSize.width !== width || this._currentSize.height !== height) {
      this._currentSize = { width, height };
      this.resizeSync(width, height);
    }
  }

  private _onResize = debounce((...args: any[]) => {
    this._doResize();
  }, 100);

  private _initDataSet(dataSet?: DataSet) {
    if (dataSet instanceof DataSet) {
      this._dataSet = dataSet;
    } else {
      this._dataSet = new DataSet();
    }
    registerDataSetInstanceParser(this._dataSet, 'dataview', dataViewParser);
    registerDataSetInstanceParser(this._dataSet, 'array', arrayParser);
    registerDataSetInstanceTransform(this._dataSet, 'stackSplit', stackSplit);
    registerDataSetInstanceTransform(this._dataSet, 'copyDataView', copyDataView);
    // 注册 dataset transform
    for (const key in Factory.transforms) {
      registerDataSetInstanceTransform(this._dataSet, key, Factory.transforms[key]);
    }
    // 注册 dataview parser
    for (const key in Factory.dataParser) {
      registerDataSetInstanceParser(this._dataSet, key, Factory.dataParser[key]);
    }
  }

  /** 在修改图表配置后重新渲染 */
  updateCustomConfigAndRerender(
    updateSpecResult: IUpdateSpecResult | (() => IUpdateSpecResult),
    sync?: boolean,
    option: IVChartRenderOption = {}
  ) {
    if (this._isReleased || !updateSpecResult) {
      return undefined;
    }
    if (isFunction(updateSpecResult)) {
      updateSpecResult = updateSpecResult();
    }
    this._reCompile(updateSpecResult);
    if (sync) {
      return this._renderSync(option);
    }
    return this._renderAsync(option);
  }

  /** 执行自定义的回调修改图表配置，并重新编译（不渲染） */
  protected _updateCustomConfigAndRecompile(updateSpecResult: IUpdateSpecResult, option: IVChartRenderOption = {}) {
    if (!updateSpecResult) {
      return false;
    }
    this._reCompile(updateSpecResult);
    return this._beforeRender(option);
  }

  protected _reCompile(updateResult: IUpdateSpecResult, morphConfig?: IMorphConfig) {
    if (updateResult.reMake) {
      this._releaseData();
      this._initDataSet();
      // 释放图表等等
      this._chartSpecTransformer = null;
      this._chart.release();
      this._chart = null as unknown as IChart;
      // 如果不需要动画，那么释放item，避免元素残留
      this._compiler?.releaseGrammar(this._option?.animation === false || this._spec?.animation === false);
      // chart 内部事件 模块自己必须删除
      // 内部模块删除事件时，调用了event Dispatcher.release() 导致用户事件被一起删除
      // 外部事件现在需要重新添加
      this._userEvents.forEach(e => this._event?.on(e.eType as any, e.query as any, e.handler as any));

      if (updateResult.reSize) {
        this._doResize();
      }
    } else {
      if (updateResult.reCompile) {
        // recompile
        // 清除之前的所有 compile 内容
        this._compiler?.clear({ chart: this._chart, vChart: this }, !this._option.animation || !this._spec.animation);
        // TODO: 释放事件？ vgrammar 的 view 应该不需要释放，响应的stage也没有释放，所以事件可以不绑定
        // 重新绑定事件
        // TODO: 释放XX？
        // 重新compile
        this._compiler?.compile({ chart: this._chart, vChart: this }, {});
      }
      if (updateResult.reSize) {
        const { width, height } = this.getCurrentSize();
        this._chart.onResize(width, height, false);
        this._compiler.resize(width, height, false);
      }
    }
  }

  /** 渲染之前的步骤，返回是否成功 */
  protected _beforeRender(option: IVChartRenderOption = {}): boolean {
    // 如果 vchart 实例已经卸载，终止渲染
    if (this._isReleased) {
      return false;
    }
    // 如果图表已经实例化，跳过该步骤
    if (this._chart) {
      return true;
    }

    const { transformSpec, actionSource } = option;
    if (transformSpec) {
      // 初始化图表 spec
      this._initChartSpec(this._spec, 'render');
    }

    // 插件生命周期
    this._chartPluginApply('onBeforeInitChart', this._spec, actionSource);

    // 实例化图表
    this._option.performanceHook?.beforeInitializeChart?.();
    this._initChart(this._spec);
    this._option.performanceHook?.afterInitializeChart?.();
    // 如果实例化失败，终止渲染
    if (!this._chart || !this._compiler) {
      return false;
    }

    // compile
    this._option.performanceHook?.beforeCompileToVGrammar?.();
    this._compiler.compile({ chart: this._chart, vChart: this }, { performanceHook: this._option.performanceHook });
    this._option.performanceHook?.afterCompileToVGrammar?.();
    return true;
  }

  /** 渲染之后的步骤 */
  protected _afterRender(): boolean {
    if (this._isReleased) {
      return false;
    }
    this._updateAnimateState();
    this._event.emit(ChartEvent.rendered, {});
    return true;
  }

  /**
   * **同步方法** 渲染图表。
   * @param morphConfig 图表 morph 动画配置，可选
   * @returns VChart 实例
   */
  renderSync(morphConfig?: IMorphConfig) {
    return this._renderSync({
      morphConfig,
      transformSpec: true,
      actionSource: 'render'
    });
  }

  /**
   * **异步方法** 渲染图表。
   * @param morphConfig 图表 morph 动画配置，可选
   * @returns VChart 实例
   */
  async renderAsync(morphConfig?: IMorphConfig) {
    return this._renderAsync({
      morphConfig,
      transformSpec: true,
      actionSource: 'render'
    });
  }

  protected _renderSync(option: IVChartRenderOption = {}) {
    const self = this as unknown as IVChart;
    if (!this._beforeRender(option)) {
      return self;
    }
    // 填充数据绘图
    this._compiler?.render(option.morphConfig);
    this._afterRender();
    return self;
  }

  protected async _renderAsync(option: IVChartRenderOption = {}) {
    return this._renderSync(option);
  }

  private _updateAnimateState() {
    if (this._option.animation) {
      this._chart?.getAllRegions().forEach(region => {
        region.animate?.updateAnimateState(AnimationStateEnum.update, true);
      });
      this._chart?.getAllComponents().forEach(component => {
        component.animate?.updateAnimateState(AnimationStateEnum.update, true);
      });
    }
  }

  /**
   * 销毁图表
   */
  release() {
    if ((this._onResize as any)?.cancel) {
      (this._onResize as any).cancel();
    }
    this._chartPluginApply('disposeAll');
    this._chartSpecTransformer = null;
    this._chart?.release();
    this._compiler?.release();
    this._eventDispatcher?.release();
    this._unBindResizeEvent();
    // resetID(); // 为什么要重置ID呢？

    this._releaseData();

    this._chart = null;
    this._compiler = null;
    this._spec = null;
    this._originalSpec = null;
    // this._option = null;
    this._userEvents = null;
    this._event = null;
    this._eventDispatcher = null;
    this._isReleased = true;

    InstanceManager.unregisterInstance(this);
  }

  /**
   * **异步方法** 更新数据。
   * @param id 数据 id
   * @param data 数据值
   * @param options 数据参数
   * @returns VChart 实例
   */
  async updateData(id: StringOrNumber, data: DataView | Datum[] | string, options?: IParserOptions): Promise<IVChart> {
    return this.updateDataSync(id, data, options);
  }

  private _updateDataById(id: StringOrNumber, data: DataView | Datum[] | string, options?: IParserOptions) {
    const preDV = this._spec.data.find((dv: any) => dv.name === id || dv.id === id);
    if (preDV) {
      if (preDV.id === id) {
        preDV.values = data;
      } else if (preDV.name === id) {
        preDV.parse(data, options);
      }
    } else {
      if (isArray(data)) {
        this._spec.data.push({
          id,
          values: data
        });
      } else {
        this._spec.data.push(data);
      }
    }
  }

  /**
   * **异步方法** 批量更新数据。
   * @param list 待更新的数据列表
   * @returns VChart 实例
   */
  async updateDataInBatches(list: { id: string; data: Datum[]; options?: IParserOptions }[]): Promise<IVChart> {
    if (this._chart) {
      this._chart.updateFullData(
        list.map(({ id, data, options }) => {
          return { id, values: data, parser: options };
        })
      );
      this._chart.updateGlobalScaleDomain();
      this._compiler.render();
      return this as unknown as IVChart;
    }

    this._spec.data = array(this._spec.data);
    list.forEach(({ id, data, options }) => {
      this._updateDataById(id, data, options);
    });
    return this as unknown as IVChart;
  }

  /**
   * **同步方法** 更新数据
   * @param id 数据 id
   * @param data 数据值
   * @param options 数据参数
   * @returns VChart 实例
   */
  updateDataSync(id: StringOrNumber, data: DataView | Datum[] | string, options?: IParserOptions) {
    if (isNil(this._dataSet)) {
      return this as unknown as IVChart;
    }
    if (this._chart) {
      this._chart.updateData(id, data, true, options);

      // after layout
      this._compiler.render();
      return this as unknown as IVChart;
    }
    this._spec.data = array(this._spec.data);

    this._updateDataById(id, data, options);
    return this as unknown as IVChart;
  }

  /**
   * **同步方法** 更新数据
   * @param data 图表配置结构中的数据对象
   * @returns VChart 实例
   * @since 1.3.0
   */
  updateFullDataSync(data: IDataValues | IDataValues[], reRender: boolean = true) {
    if (this._chart) {
      this._chart.updateFullData(data);
      if (reRender) {
        this._compiler.render();
      }
      return this as unknown as IVChart;
    }
    const list: IDataValues[] = array(data);
    list.forEach(d => {
      // only support update this attrs
      const { id, values, parser, fields } = d;
      const preDV = (this._spec.data as DataView[]).find(dv => dv.name === id);
      if (preDV) {
        preDV.setFields(cloneDeep(fields) as IFields);
        preDV.parse(values, cloneDeep(parser) as IParserOptions);
      } else {
        // new data
        const dataView = dataToDataView(d, <DataSet>this._dataSet, this._spec.data, {
          onError: this._option?.onError
        });
        this._spec.data.push(dataView);
      }
    });
    return this as unknown as IVChart;
  }

  /**
   * **异步方法** 更新数据
   * @param data 图表配置结构中的数据对象
   * @returns VChart 实例
   * @since 1.3.0
   */
  async updateFullData(data: IDataValues | IDataValues[], reRender: boolean = true) {
    return this.updateFullDataSync(data, reRender);
  }

  /**
   * **异步方法** spec 更新
   * @param spec
   * @param forceMerge
   * @returns
   */
  async updateSpec(spec: ISpec, forceMerge: boolean = false, morphConfig?: IMorphConfig) {
    const result = this._updateSpec(spec, forceMerge);
    await this.updateCustomConfigAndRerender(result, false, {
      morphConfig,
      transformSpec: true,
      actionSource: 'updateSpec'
    });
    return this as unknown as IVChart;
  }

  /**
   * **同步方法** spec 更新
   * @param spec
   * @param forceMerge
   * @returns
   */
  updateSpecSync(spec: ISpec, forceMerge: boolean = false, morphConfig?: IMorphConfig) {
    const result = this._updateSpec(spec, forceMerge);
    this.updateCustomConfigAndRerender(result, true, {
      morphConfig,
      transformSpec: true,
      actionSource: 'updateSpec'
    });
    return this as unknown as IVChart;
  }

  /** 更新 spec 并重新编译（不渲染），返回是否成功 */
  updateSpecAndRecompile(spec: ISpec, forceMerge: boolean = false, option: IVChartRenderOption = {}) {
    const result = this._updateSpec(spec, forceMerge);
    return this._updateCustomConfigAndRecompile(result, {
      actionSource: 'updateSpecAndRecompile',
      ...option
    });
  }

  private _updateSpec(spec: ISpec, forceMerge: boolean = false): IUpdateSpecResult | undefined {
    const lastSpec = this._spec;
    if (!this._setNewSpec(spec, forceMerge)) {
      return undefined;
    }

    if (!isEqual(lastSpec.theme, this._spec.theme)) {
      this._setCurrentTheme();
    }

    const reSize = this._shouldChartResize(lastSpec);
    this._compiler?.getVGrammarView()?.updateLayoutTag();

    return mergeUpdateResult(this._chart.updateSpec(this._spec), {
      change: reSize,
      reMake: false,
      reCompile: false,
      reSize
    });
  }

  /**
   * **异步方法** spec 更新
   * @param filter
   * @param spec
   * @param forceMerge
   * @returns
   * @sync 1.4.0
   */
  async updateModelSpec(
    filter: string | { type: string; index: number } | ((model: IModel) => boolean),
    spec: unknown,
    forceMerge: boolean = false,
    morphConfig?: IMorphConfig
  ) {
    if (!spec || !this._spec) {
      return this as unknown as IVChart;
    }
    if (isString(spec)) {
      spec = JSON.parse(spec);
    }

    if (!isFunction(filter)) {
      // find spec and update
      mergeSpecWithFilter(this._spec, filter, spec, forceMerge);
    }

    if (this._chart) {
      const model = this._chart.getModelInFilter(filter);
      if (model) {
        return this._updateModelSpec(model, spec, false, forceMerge, morphConfig);
      }
    }
    return this as unknown as IVChart;
  }

  /**
   * **同步方法** spec 更新
   * @param filter
   * @param spec
   * @param forceMerge
   * @returns
   * @sync 1.4.0
   */
  updateModelSpecSync(
    filter: string | { type: string; index: number } | ((model: IModel) => boolean),
    spec: unknown,
    forceMerge: boolean = false,
    morphConfig?: IMorphConfig
  ) {
    if (!spec || !this._spec) {
      return this as unknown as IVChart;
    }
    if (isString(spec)) {
      spec = JSON.parse(spec);
    }

    if (!isFunction(filter)) {
      // find spec and update
      mergeSpecWithFilter(this._spec, filter, spec, forceMerge);
    }

    if (this._chart) {
      const model = this._chart.getModelInFilter(filter);
      if (model) {
        return this._updateModelSpec(model, spec, true, forceMerge, morphConfig) as IVChart;
      }
    }
    return this as unknown as IVChart;
  }

  /**
   * **同步方法** 模块 spec 更新
   * @param model
   * @param spec
   * @param forceMerge
   * @returns
   */
  protected _updateModelSpec(
    model: IModel,
    spec: unknown,
    sync: boolean = false,
    forceMerge: boolean = false,
    morphConfig?: IMorphConfig
  ) {
    if (forceMerge) {
      spec = mergeSpec({}, model.getSpec(), spec);
    }

    const result = model.updateSpec(spec);
    model.reInit(spec);
    if (result.change || result.reCompile || result.reMake || result.reSize || result.reRender) {
      this._chart.reDataFlow();
    }

    return this.updateCustomConfigAndRerender(result, sync, {
      morphConfig,
      transformSpec: false,
      actionSource: 'updateModelSpec'
    });
  }

  /**
   * **异步方法**，图表尺寸更新方法
   * @param width 宽度
   * @param height 高度
   * @returns VChart 当前实例
   */
  async resize(width: number, height: number) {
    return this.resizeSync(width, height);
  }

  /**
   * **同步方法**，图表尺寸更新方法
   * @param width 宽度
   * @param height 高度
   * @returns VChart 当前实例
   */
  resizeSync(width: number, height: number) {
    if (!this._beforeResize(width, height)) {
      return this as unknown as IVChart;
    }
    this._compiler.resize?.(width, height);
    return this._afterResize();
  }

  protected _beforeResize(width: number, height: number): boolean {
    if (!this._chart || !this._compiler) {
      return false;
    }
    // 如果宽高未变化，不需要重新执行 resize，防止当图表初始化时会执行一次多余的 resize
    const chartCanvasRect = this._chart.getCanvasRect();
    if (chartCanvasRect && chartCanvasRect.width === width && chartCanvasRect.height === height) {
      return false;
    }

    // 插件生命周期
    this._chartPluginApply('onBeforeResize', width, height);

    this._option.performanceHook?.beforeResizeWithUpdate?.();
    this._chart.onResize(width, height, false);
    this._option.performanceHook?.afterResizeWithUpdate?.();

    return true;
  }

  protected _afterResize() {
    if (!this._isReleased) {
      // emit resize event
      this._event.emit(ChartEvent.afterResize, { chart: this._chart });
    }
    return this as unknown as IVChart;
  }

  /**
   * 更新绘制区域
   * @param viewBox 绘制区域
   * @param reRender 是否重新渲染，默认为 true
   * @param reLayout 是否重新布局，默认为 true
   * @returns
   */
  updateViewBox(viewBox: IBoundsLike, reRender: boolean = true, reLayout: boolean = true) {
    if (!this._chart || !this._compiler) {
      return this as unknown as IVChart;
    }
    this._viewBox = viewBox;
    // 更新 layout 参数
    this._chart.updateViewBox(viewBox, reLayout);
    if (reLayout) {
      // 重新布局
      this._compiler.render();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._chart.onEvaluateEnd();
    }
    // 获取 compiler
    this._compiler.updateViewBox(viewBox, reRender);
    return this as unknown as IVChart;
  }

  // 事件相关方法
  on(eType: EventType, handler: EventCallback<EventParams>): void;
  on(eType: EventType, query: EventQuery, handler: EventCallback<EventParams>): void;
  on(eType: EventType, query: EventQuery | EventCallback<EventParams>, handler?: EventCallback<EventParams>): void {
    if (!this._userEvents) {
      // userEvents正常情况下有默认值，如果!userEvents，说明此时chart被release了，就可以终止流程
      return;
    }
    this._userEvents.push({
      eType,
      query: typeof query === 'function' ? null : query,
      handler: typeof query === 'function' ? query : handler
    });
    this._event?.on(eType as any, query as any, handler as any);
  }
  off(eType: string, handler?: EventCallback<EventParams>): void {
    if (!this._userEvents || this._userEvents.length === 0) {
      return;
    }
    if (handler) {
      const index = this._userEvents.findIndex(e => e.eType === eType && e.handler === handler);
      if (index >= 0) {
        this._userEvents.splice(index, 1);
        this._event?.off(eType, handler);
      }
    } else {
      this._userEvents.forEach(e => {
        if (e.eType === eType) {
          this._event?.off(eType, e.handler);
        }
      });
      this._userEvents = this._userEvents.filter(e => e.eType !== eType);
    }
  }

  // 状态相关方法
  /**
   * 更新或设置图元状态
   * @param state 状态筛选器
   * @param filter 筛选器
   */
  updateState(
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean //series + mark 筛选
  ): void {
    if (!this._chart) {
      return;
    }
    this._chart.updateState(state, filter);
  }

  /**
   * 更新图元选中状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setSelected(
    datum: MaybeArray<any> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ): void {
    if (!this._chart) {
      return;
    }
    this._chart.setSelected(datum, filter, region);
  }

  /**
   * 更新图元 hover 状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setHovered(
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ): void {
    if (!this._chart) {
      return;
    }
    this._chart.setHovered(datum, filter, region);
  }

  // 主题相关方法
  /**
   * 当 spec 或者 currentThemeName 有变化时需要调用此方法对 currentTheme 进行更新
   * @param nextThemeName 通过 setCurrentTheme 方法新设的主题
   */
  private _updateCurrentTheme(nextThemeName?: string) {
    const optionTheme: Maybe<string | ITheme> = this._option.theme;
    const specTheme: Maybe<string | ITheme> = this._spec?.theme;

    if (nextThemeName) {
      this._currentThemeName = nextThemeName;
    }

    // 处理 specTheme 和 optionTheme, merge -> transform
    // 优先级 currentTheme < optionTheme < specTheme
    if (!isEmpty(optionTheme) || !isEmpty(specTheme)) {
      if (
        (isString(optionTheme) && (!specTheme || isString(specTheme))) ||
        (isString(specTheme) && (!optionTheme || isString(optionTheme)))
      ) {
        const finalTheme = mergeTheme(
          {},
          getThemeObject(this._currentThemeName, true),
          getThemeObject(optionTheme, true),
          getThemeObject(specTheme, true)
        );
        this._currentTheme = finalTheme;
      } else {
        const finalTheme = mergeTheme(
          {},
          getThemeObject(this._currentThemeName),
          getThemeObject(optionTheme),
          getThemeObject(specTheme)
        );
        this._currentTheme = preprocessTheme(finalTheme);
      }
    } else {
      this._currentTheme = getThemeObject(this._currentThemeName, true);
    }

    // 设置 poptip 的主题
    setPoptipTheme(get(this._currentTheme, 'component.poptip'));
    // 设置背景色
    this._compiler?.setBackground(this._getBackground());
  }

  private _shouldChartResize(oldSpec: ISpec): boolean {
    let resize = false;

    if (isNil(this._spec.width)) {
      this._spec.width = oldSpec.width;
    } else if (this._spec.width !== oldSpec.width) {
      resize = true;
    }

    if (isNil(this._spec.height)) {
      this._spec.height = oldSpec.height;
    } else if (this._spec.height !== oldSpec.height) {
      resize = true;
    }

    const lasAutoSize = this._autoSize;
    this._autoSize = isTrueBrowser(this._option.mode) ? this._spec.autoFit ?? this._option.autoFit ?? true : false;
    if (this._autoSize !== lasAutoSize) {
      resize = true;
    }
    return resize;
  }

  private _getBackground() {
    const specBackground = typeof this._spec.background === 'string' ? this._spec.background : null;
    // spec > spec.theme > initOptions.theme
    return specBackground || (this._currentTheme.background as string) || this._option.background;
  }

  /**
   * 获取当前主题，会返回完整的主题配置（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为`ThemeManager`统一设置的主题）
   * */
  getCurrentTheme() {
    return getThemeObject(this._currentThemeName);
  }

  /**
   * 获取当前主题名称（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为`ThemeManager`统一设置的主题）
   */
  getCurrentThemeName() {
    return this._currentThemeName;
  }

  /**
   * **异步方法**， 设置当前主题。
   * **注意，如果在 spec 上配置了 theme，则 spec 上的 theme 优先级更高。**
   * @param name 主题名称
   * @returns
   */
  async setCurrentTheme(name: string) {
    if (!ThemeManager.themeExist(name)) {
      return this as unknown as IVChart;
    }
    const result = this._setCurrentTheme(name);
    await this.updateCustomConfigAndRerender(result, false, {
      transformSpec: false,
      actionSource: 'setCurrentTheme'
    });
    return this as unknown as IVChart;
  }

  /**
   * **同步方法** 设置当前主题。
   * **注意，如果在 spec 上配置了 theme，则 spec 上的 theme 优先级更高。**
   * @param name 主题名称
   * @returns
   */
  setCurrentThemeSync(name: string) {
    if (!ThemeManager.themeExist(name)) {
      return this as unknown as IVChart;
    }
    const result = this._setCurrentTheme(name);
    this.updateCustomConfigAndRerender(result, true, {
      transformSpec: false,
      actionSource: 'setCurrentTheme'
    });
    return this as unknown as IVChart;
  }

  protected _setCurrentTheme(name?: string): IUpdateSpecResult {
    this._updateCurrentTheme(name);
    this._initChartSpec(this._getSpecFromOriginalSpec(), 'setCurrentTheme');
    this._chart?.setCurrentTheme();
    return { change: true, reMake: false };
  }

  // Tooltip 相关方法
  private _getTooltipComponent(): Tooltip | undefined {
    const tooltip = this._chart?.getComponentsByType(ComponentTypeEnum.tooltip)[0] as unknown as Tooltip;
    return tooltip;
  }

  /**
   * 自定义 TooltipHandler
   * @param tooltipHandler
   */
  setTooltipHandler(tooltipHandler: ITooltipHandler) {
    this._context.tooltipHandler = tooltipHandler;
    const tooltip = this._getTooltipComponent();
    if (tooltip) {
      tooltip.tooltipHandler?.release?.();
      tooltip.tooltipHandler = tooltipHandler;
    }
  }

  /**
   * 获取用户定义的 TooltipHandler
   * @returns ITooltipHandler
   */
  getTooltipHandlerByUser(): ITooltipHandler | undefined {
    return this._context?.tooltipHandler;
  }

  /**
   * 获取 TooltipHandler
   * @returns
   */
  getTooltipHandler(): ITooltipHandler | undefined {
    const tooltip = this._getTooltipComponent();
    if (tooltip) {
      return tooltip.tooltipHandler;
    }
    return this._context.tooltipHandler;
  }

  /**
   * 手动调用展示 tooltip
   * @param datum 原始数据
   * @param options
   * @returns
   */
  showTooltip(datum: Datum, options: IShowTooltipOption): boolean {
    const tooltip = this._getTooltipComponent();
    return (isValid(datum) && tooltip?.showTooltip(datum, options) !== 'none') ?? false;
  }

  /**
   * 手动调用，关闭 tooltip
   * @returns
   */
  hideTooltip(): boolean {
    const tooltip = this._getTooltipComponent();
    return tooltip?.hideTooltip() ?? false;
  }

  // 图例相关 api
  /**
   * 根据图例组件 id 获取图例数据
   * @param id 组件 id
   * @returns
   */
  getLegendDataById(id: string) {
    const legendComponent = this._chart?.getComponentByUserId(id) as ILegend;
    if (legendComponent) {
      return legendComponent.getLegendData();
    }
    return [];
  }

  /**
   * 根据图例组件索引获取图例数据
   * @param index 图例索引，默认为 0
   * @returns
   */
  getLegendDataByIndex(index: number = 0) {
    const legends = this._chart?.getComponentsByType(ComponentTypeEnum.discreteLegend) as unknown as ILegend[];

    if (legends && legends[index]) {
      return legends[index].getLegendData();
    }

    return [];
  }

  /**
   * 根据图例组件 id 获取当前图例的选中项
   * @param id 组件 id
   * @returns
   */
  getLegendSelectedDataById(id: string) {
    const legendComponent = this._chart?.getComponentByUserId(id) as ILegend;
    if (legendComponent) {
      return legendComponent.getSelectedData();
    }
    return [];
  }

  /**
   * 根据图例组件索引获取当前图例的选中项
   * @param index 图例索引，默认为 0
   * @returns
   */
  getLegendSelectedDataByIndex(index: number = 0) {
    const legends = this._chart?.getComponentsByType(ComponentTypeEnum.discreteLegend) as unknown as ILegend[];

    if (legends && legends[index]) {
      return legends[index].getSelectedData();
    }

    return [];
  }

  /**
   * 根据图例组件 id 更新图例选中数据
   * @param id
   * @returns
   */
  setLegendSelectedDataById(id: string, selectedData: StringOrNumber[]) {
    const legendComponent = this._chart?.getComponentByUserId(id) as ILegend;
    if (legendComponent) {
      legendComponent.setSelectedData(selectedData);
    }
  }

  /**
   * 根据图例组件索引更新图例选中数据
   * @param index 图例索引，默认为 0
   * @returns
   */
  setLegendSelectedDataByIndex(index: number = 0, selectedData: StringOrNumber[]) {
    const legends = this._chart?.getComponentsByType(ComponentTypeEnum.discreteLegend) as unknown as ILegend[];

    if (legends && legends[index]) {
      legends[index].setSelectedData(selectedData);
    }
  }

  // 保存图片相关的方法
  /**
   * **异步方法**返回一个包含图片展示的 data URI。
   * @returns data URI
   */
  async getDataURL() {
    const stage = this.getStage();
    if (this._chart && stage) {
      // 因为 vrender 是 autoRender 的，它不能确认第几帧才是完整的图表，所以这里调用一次 render 以保证获取到的是完整的画布
      stage.render();
      const canvas = this._chart.getCanvas();
      const url = await getCanvasDataURL(canvas, {
        onError: this._onError
      });
      return url;
    }
    this._option?.onError(new ReferenceError(`render is not defined`));

    return null;
  }

  /**
   * **异步方法** 导出图表图片，只支持浏览器端。
   * @param name 保存的图片名称
   * @returns
   */
  async exportImg(name?: string) {
    if (!isTrueBrowser(this._option.mode)) {
      this._option?.onError(new TypeError(`non-browser environment can not export img`));
      return;
    }

    const dataURL = await this.getDataURL();
    if (dataURL) {
      URLToImage(name, dataURL);
    } else {
      this._option?.onError(new ReferenceError(`render is not defined`));
    }
  }
  /**
   * 导出绘制了图表内容的 canvas
   * @returns HTMLCanvasElement
   */
  exportCanvas(): HTMLCanvasElement | undefined {
    const stage = this.getStage();
    if (this._chart && stage) {
      return stage.toCanvas();
    }
    this._option?.onError(new ReferenceError(`render is not defined`));
    return undefined;
  }

  /**
   * 目前仅支持 node 环境，用于 node 端的图片导出
   * @returns
   */
  getImageBuffer() {
    if (this._option.mode !== 'node') {
      this._option?.onError(new TypeError('getImageBuffer() now only support node environment.'));
      return;
    }
    const stage = this.getStage();
    if (stage) {
      stage.render();
      const buffer = stage.window.getImageBuffer();
      return buffer;
    }
    this._option?.onError(new ReferenceError(`render is not defined`));

    return null;
  }

  // 布局相关的方法
  /**
   * 设置自定义布局
   */
  setLayout(layout: LayoutCallBack) {
    this._option.layout = layout;
    this._chart?.setLayout(layout);
  }
  /**
   * 强制重新布局
   */
  reLayout() {
    this._chart?.setLayoutTag(true);
  }

  /**
   * 获取编译器实例
   * @returns
   */
  getCompiler() {
    return this._compiler;
  }

  /**
   * Get the chart instance
   * 获取 Chart 图表实例。
   * @returns Chart 实例
   */
  getChart() {
    return this._chart;
  }

  /**
   * Get the renderer instance.
   * 获取渲染引擎实例。
   * @returns the instance of VRender Stage
   */
  getStage(): Stage {
    return this._compiler.getStage();
  }

  /**
   * 获取 canvas dom
   * @returns HTMLCanvasElement | undefined
   */
  getCanvas(): HTMLCanvasElement | undefined {
    return this._compiler?.getCanvas();
  }

  /**
   * 获取图表的 dom 容器
   * @returns
   */
  getContainer(): Maybe<HTMLElement> {
    // 用户传入 dom container
    if (isValid(this._container)) {
      return this._container;
    }

    // 用户传入 canvas
    let canvasNode: Maybe<HTMLCanvasElement>;
    if (isString(this._canvas)) {
      canvasNode = document?.getElementById(this._canvas) as HTMLCanvasElement;
    } else {
      canvasNode = this._canvas as HTMLCanvasElement;
    }
    if (isValid(canvasNode)) {
      return canvasNode.parentElement;
    }

    // 用户传入 stage
    return this.getCanvas()?.parentElement;
  }

  /**
   * 获取图表所有的组件实例
   * @returns 组件实例
   */
  getComponents() {
    return this._chart.getAllComponents();
  }

  /**
   * setDimensionIndex could trigger mark state, tooltip, crosshair
   * @param value dimension value
   * @param opt option for set trigger
   */
  setDimensionIndex(value: StringOrNumber, opt: DimensionIndexOption = {}) {
    return this._chart?.setDimensionIndex(value, opt);
  }

  /** 停止正在进行的所有动画 */
  stopAnimation() {
    this._compiler?.getVGrammarView()?.animate?.stop();
  }

  /** 暂停正在进行的所有动画 */
  pauseAnimation() {
    this._compiler?.getVGrammarView()?.animate?.pause();
  }

  /** 恢复暂停时正在进行的所有动画 */
  resumeAnimation() {
    this._compiler?.getVGrammarView()?.animate?.resume();
  }

  // TODO: 后续需要考虑滚动场景
  /**
   * Convert the data corresponding to the graph into coordinates
   * 将图形对应的数据转换为坐标，该数据需要从传入图表的数据集中获取，如果数据不存在数据集中，可以使用 `convertValueToPosition` 方法
   * @param datum 要转化的数据 the datum（from data source）to convert
   * @param dataLinkInfo 数据的绑定信息，the data link info, could be seriesId or seriesIndex, default is { seriesIndex: 0 }
   * @param isRelativeToCanvas 是否相对画布坐标 Whether relative to canvas coordinates
   * @returns
   */
  convertDatumToPosition(
    datum: Datum,
    dataLinkInfo: DataLinkSeries = {},
    isRelativeToCanvas: boolean = false
  ): IPoint | null {
    if (!this._chart) {
      return null;
    }
    if (isEmpty(datum)) {
      return null;
    }
    const { seriesId, seriesIndex = 0 } = dataLinkInfo;

    let series: ISeries;
    if (isValid(seriesId)) {
      series = this._chart.getSeriesInUserId(seriesId);
    } else if (isValid(seriesIndex)) {
      series = this._chart.getSeriesInIndex([seriesIndex])?.[0];
    }

    if (series) {
      const keys = Object.keys(datum);
      const handledDatum = series
        .getViewData()
        // eslint-disable-next-line eqeqeq
        .latestData.find((viewDatum: Datum) => keys.every(k => viewDatum[k] == datum[k]));
      const seriesLayoutStartPoint = series.getRegion().getLayoutStartPoint();
      let point: IPoint;
      if (handledDatum) {
        point = series.dataToPosition(handledDatum);
      } else {
        point = series.dataToPosition(datum);
      }
      return convertPoint(point, seriesLayoutStartPoint, isRelativeToCanvas);
    }

    return null;
  }

  // TODO: 1. 后续需要考虑滚动场景 2. 极坐标场景支持
  convertValueToPosition(
    value: StringOrNumber,
    dataLinkInfo: DataLinkAxis,
    isRelativeToCanvas?: boolean
  ): number | null;
  convertValueToPosition(
    value: [StringOrNumber, StringOrNumber],
    dataLinkInfo: DataLinkSeries,
    isRelativeToCanvas?: boolean
  ): IPoint | null;
  convertValueToPosition(
    value: StringOrNumber | [StringOrNumber, StringOrNumber],
    dataLinkInfo: DataLinkAxis | DataLinkSeries,
    isRelativeToCanvas: boolean = false
  ): number | IPoint | null {
    if (!this._chart || isNil(value) || isEmpty(dataLinkInfo)) {
      return null;
    }

    if (!isArray(value)) {
      // 如果单个值，则默认使用 axis 绑定信息
      const { axisId, axisIndex } = dataLinkInfo as DataLinkAxis;
      let axis;
      if (isValid(axisId)) {
        axis = this._chart.getComponentsByKey('axes').find(s => s.userId === axisId);
      } else if (isValid(axisIndex)) {
        axis = this._chart.getComponentsByKey('axes')?.[axisIndex];
      }
      if (!axis) {
        warn('Please check whether the `axisId` or `axisIndex` is set!');
        return null;
      }

      const pointValue = (axis as IAxis)?.valueToPosition(value);
      if (isRelativeToCanvas) {
        const axisLayoutStartPoint = axis.getLayoutStartPoint();
        const axisOrient = (axis as IAxis).getOrient();
        return (
          pointValue +
          (axisOrient === 'bottom' || axisOrient === 'top' ? axisLayoutStartPoint.x : axisLayoutStartPoint.y)
        );
      }

      return pointValue;
    }
    const { seriesId, seriesIndex } = dataLinkInfo as DataLinkSeries;
    let series;
    if (isValid(seriesId)) {
      series = this._chart.getSeriesInUserId(seriesId);
    } else if (isValid(seriesIndex)) {
      series = this._chart.getSeriesInIndex([seriesIndex])?.[0];
    }

    if (!series) {
      warn('Please check whether the `seriesId` or `seriesIndex` is set!');
      return null;
    }

    return convertPoint(
      (series as ISeries).valueToPosition(value[0], value[1]),
      series.getRegion().getLayoutStartPoint(),
      isRelativeToCanvas
    );
  }

  /**
   * 获取实例函数
   * @param key 函数名称
   * @returns
   */
  getFunction(key: string): Function | null {
    return ExpressionFunction.instance().getFunction(key);
  }

  /**
   * 注册实例函数（对内包装一层，区分名字，避免重名问题）
   * @param key 函数名称
   * @param fun 函数内容
   * @returns
   */
  registerFunction(key: string, fun: Function) {
    if (!key || !fun) {
      return;
    }
    ExpressionFunction.instance().registerFunction(key, fun);
  }

  /**
   * 注销实例函数
   * @param key 函数名称
   */
  unregisterFunction(key: string) {
    if (!key) {
      return;
    }
    ExpressionFunction.instance().unregisterFunction(key);
  }

  /**
   * 获取实例函数列表
   * @returns
   */
  getFunctionList() {
    return ExpressionFunction.instance().getFunctionNameList();
  }

  /** 设置运行时 spec */
  setRuntimeSpec(spec: any) {
    this._spec = spec;
    this._updateSpecInfo();
  }

  private _initChartPlugin() {
    const pluginList = Factory.getChartPlugins();
    if (pluginList.length > 0) {
      this._chartPlugin = new ChartPluginService(this);
      this._chartPlugin.load(pluginList.map(p => new p()));
      // 插件生命周期
      this._chartPluginApply('onInit', this._spec);
    }
  }

  private _chartPluginApply(funcName: keyof IChartPluginService, ...args: any[]) {
    if (!this._chartPlugin || !this._chartPlugin[funcName]) {
      return;
    }
    (this._chartPlugin[funcName] as (...args: any[]) => any).apply(this._chartPlugin, args);
  }
}

export const registerVChartCore = () => {
  // install region module
  Factory.registerRegion('region', Region);
  // install layout module
  Factory.registerLayout('base', Layout);
  // install essential marks
  registerGroupMark();
  // install essential vgrammar transform
  View.useRegisters([registerFilterTransform, registerMapTransform]);
  // install animation
  registerVGrammarCommonAnimation();
  // install default theme
  registerTheme(darkTheme.name, darkTheme);
  // set default logger level to Level.error
  Logger.getInstance(LoggerLevel.Error);
};

registerVChartCore();
