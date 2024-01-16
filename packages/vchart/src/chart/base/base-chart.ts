import type { IRegionConstructor } from '../../region/interface';
import { ChartData } from '../chart-meta/data';
import type { ICrossHair } from '../../component/crosshair/interface/spec';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
import type {
  Datum,
  IMarkStateSpec,
  IVisual,
  IVisualSpecScale,
  IRegionQuerier,
  MaybeArray,
  IPadding,
  IRect,
  StringOrNumber,
  IChartSpec,
  IDataValues,
  ILayoutRect,
  ILayoutOrientPadding
} from '../../typings';
import type { ILayoutItem, LayoutCallBack } from '../../layout/interface';
import { GlobalScale } from '../../scale/global-scale';
import type { ILayoutModelState, IModel, IModelOption, IModelSpecInfo, IUpdateSpecResult } from '../../model/interface';
import type {
  IChart,
  IChartLayoutOption,
  IChartRenderOption,
  IChartOption,
  IChartEvaluateOption,
  ILayoutParams,
  DimensionIndexOption,
  IChartSpecTransformerOption,
  IChartSpecTransformer
} from '../interface';
import type { ICartesianSeries, ISeries, ISeriesConstructor } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import type { IRegion } from '../../region/interface';
import { ComponentTypeEnum } from '../../component/interface';
// eslint-disable-next-line no-duplicate-imports
import type { IComponent, IComponentConstructor } from '../../component/interface';
import { MarkTypeEnum, type IMark } from '../../mark/interface';
import type { IEvent } from '../../event/interface';
import type { DataView } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset/es/data-set';
import { Factory } from '../../core/factory';
import { Event } from '../../event/event';
import {
  isArray,
  isValid,
  createID,
  calcPadding,
  normalizeLayoutPaddingSpec,
  array,
  convertBackgroundSpec
} from '../../util';
import { Stack } from '../stack';
import { BaseModel } from '../../model/base-model';
import { BaseMark } from '../../mark/base/base-mark';
import { DEFAULT_CHART_WIDTH, DEFAULT_CHART_HEIGHT } from '../../constant/base';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { has, isFunction, isEmpty, isNil, isString, isEqual } from '@visactor/vutils';
import { getDataScheme } from '../../theme/color-scheme/util';
import type { IRunningConfig as IMorphConfig, IView } from '@visactor/vgrammar-core';
import { CompilableBase } from '../../compile/compilable-base';
import type { IStateInfo } from '../../compile/mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { STATE_VALUE_ENUM } from '../../compile/mark/interface';
import { ChartEvent, VGRAMMAR_HOOK_EVENT } from '../../constant';
import type { IGlobalScale } from '../../scale/interface';
import { DimensionEventEnum } from '../../event/events/dimension';
import type { ITooltip } from '../../component/tooltip/interface';
import type { IRectMark } from '../../mark/rect';
import { calculateChartSize, mergeUpdateResult } from '../util';
import { isDiscrete } from '@visactor/vscale';
import { updateDataViewInData } from '../../data/initialize';

export class BaseChart<T extends IChartSpec> extends CompilableBase implements IChart {
  readonly type: string = 'chart';
  readonly seriesType: string;
  readonly transformerConstructor: new (option: IChartSpecTransformerOption) => IChartSpecTransformer;

  readonly id: number = createID();

  protected _transformer: IChartSpecTransformer;

  //FIXME: 转换后的 spec 需要声明 ITransformedChartSpec
  protected _spec: T;
  getSpec() {
    return this._spec;
  }
  setSpec(s: T) {
    // TODO 通过spec设置进行图表更新
    this._spec = s;
  }

  getOption() {
    return this._option;
  }

  protected _regions: IRegion[] = [];
  // 系列
  protected _series: ISeries[] = [];
  // 组件
  protected _components: IComponent[] = [];

  // 布局
  protected _layoutFunc: LayoutCallBack;
  protected _layoutRect: IRect = {
    x: 0,
    y: 0,
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT
  };
  getLayoutRect() {
    return this._layoutRect;
  }
  protected _viewRect: ILayoutRect = {
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT
  };
  getViewRect() {
    return this._viewRect;
  }
  protected _viewBox: IBoundsLike = {
    x1: 0,
    y1: 0,
    x2: DEFAULT_CHART_WIDTH,
    y2: DEFAULT_CHART_HEIGHT
  };

  protected _layoutTag: boolean = true;
  getLayoutTag() {
    return this._layoutTag;
  }
  setLayoutTag(tag: boolean, morphConfig?: IMorphConfig, reLayout: boolean = true): boolean {
    this._layoutTag = tag;
    if (this.getCompiler()?.getVGrammarView()) {
      this.getCompiler().getVGrammarView().updateLayoutTag();
      tag && reLayout && this.getCompiler().renderAsync(morphConfig);
    }
    return this._layoutTag;
  }

  // 模块参数
  protected _modelOption: IModelOption;

  // 全局通道
  // protected _globalScale: { [key: string]: IBaseScale } = {};
  protected _globalScale: IGlobalScale;

  // mark & model 的 id 映射
  protected _idMap: Map<number, IModel | IMark> = new Map();

  protected _event: IEvent;
  getEvent() {
    return this._event;
  }

  // data
  protected _dataSet: DataSet;
  protected _chartData: ChartData;
  get chartData() {
    return this._chartData;
  }

  protected declare _option: IChartOption;

  // 模块内的需要动态影像图表的属性
  readonly state: ILayoutModelState = {
    layoutUpdateRank: 1
  };

  // stack
  protected _stack: Stack;
  protected _canStack: boolean;

  padding: IPadding = { top: 0, left: 0, right: 0, bottom: 0 };
  protected _paddingSpec: ILayoutOrientPadding;

  protected _canvasRect: ILayoutRect;

  // background
  protected _backgroundMark: IRectMark;

  constructor(spec: T, option: IChartOption) {
    super(option);
    this._paddingSpec = normalizeLayoutPaddingSpec(spec.padding ?? option.getTheme().padding);

    this._event = new Event(option.eventDispatcher, option.mode);
    this._dataSet = option.dataSet;
    this._chartData = new ChartData(this._dataSet, this._option?.onError);
    this._modelOption = {
      ...option,
      mode: this._option.mode,
      map: this._idMap,
      getChartLayoutRect: () => this._layoutRect,
      getChartViewRect: () => this._viewRect,
      getChart: () => this,
      globalScale: this._globalScale,
      onError: this._option?.onError,
      disableTriggerEvent: this._option?.disableTriggerEvent === true,
      getSeriesData: this._chartData.getSeriesData.bind(this._chartData)
    };

    this._spec = spec;
  }

  created() {
    this._transformer = new this.transformerConstructor({
      type: this.type,
      seriesType: this.seriesType,
      getTheme: this._option.getTheme,
      animation: this._option.animation
    });
    // data
    this._chartData.parseData(this._spec.data);
    // scale
    this._createGlobalScale();
    // background
    this._spec.background && typeof this._spec.background === 'object' && this._createBackground();
    // 基础内容
    this._createLayout();
    // 基于spec 创建元素。
    // region
    this._transformer.forEachRegionInSpec(this._spec, this._createRegion.bind(this));
    // series
    this._transformer.forEachSeriesInSpec(this._spec, this._createSeries.bind(this));
    // components
    this._transformer.forEachComponentInSpec(this._spec, this._createComponent.bind(this), this._option.getSpecInfo());
  }

  init() {
    // 元素创建完毕后再执行各元素的初始化 方便各元素能获取到其他模块
    this._regions.forEach(r => r.init({}));
    this._series.forEach(s => s.init({}));
    this._components.forEach(c => c.init({ dataSet: this._dataSet }));

    // event
    this._initEvent();

    // TODO: to component
    // stack
    if (this._canStack) {
      this._stack = new Stack(this);
      this._stack.init();
    }
    // data flow start
    this.reDataFlow();
  }

  reDataFlow() {
    this._series.forEach(s => s.getRawData()?.markRunning());
    this._series.forEach(s => s.fillData());
    this.updateGlobalScaleDomain();
  }

  onResize(width: number, height: number, reRender: boolean = true): void {
    const canvasRect = {
      width,
      height
    };
    this._canvasRect = canvasRect;
    this._updateLayoutRect(this._option.viewBox);
    this.setLayoutTag(true, null, reRender);
  }

  updateViewBox(viewBox: IBoundsLike, reLayout: boolean) {
    this._option.viewBox = viewBox;
    this._updateLayoutRect(viewBox);
    this.setLayoutTag(true, null, reLayout);
  }

  private _createBackground() {
    const backgroundStyle = convertBackgroundSpec(this._spec.background);
    if (backgroundStyle) {
      this._backgroundMark = Factory.createMark(MarkTypeEnum.group, 'chart-background', {
        model: this as any,
        map: this._option.map,
        getCompiler: this.getCompiler,
        globalScale: this._globalScale
      }) as IRectMark;
      this._backgroundMark.created();
      this._backgroundMark.setStyle({
        ...backgroundStyle,
        x: () => this._viewBox.x1,
        y: () => this._viewBox.y1,
        width: () => this._viewBox.x2 - this._viewBox.x1,
        height: () => this._viewBox.y2 - this._viewBox.y1
      });
    }
  }

  protected _createRegion(constructor: IRegionConstructor, specInfo: IModelSpecInfo) {
    if (!constructor) {
      return;
    }

    const { spec, ...others } = specInfo;
    const region = new constructor(spec, {
      ...this._modelOption,
      ...others
    });
    if (region) {
      region.created();
      this._regions.push(region);
    }
  }

  protected _createSeries(constructor: ISeriesConstructor, specInfo: IModelSpecInfo) {
    if (!constructor) {
      return;
    }

    const { spec, ...others } = specInfo;

    let region: IRegion | undefined;
    if (isValid(spec.regionId)) {
      region = this.getRegionsInUserId(spec.regionId);
    } else if (isValid(spec.regionIndex)) {
      region = this.getRegionsInIndex([spec.regionIndex])[0];
    }

    if (!region && !(region = this._regions[0])) {
      return;
    }

    const series = new constructor(spec, {
      ...this._modelOption,
      ...others,
      type: spec.type,
      region,
      globalScale: this._globalScale,
      sourceDataList: this._chartData.dataList
    });

    if (series) {
      series.created();
      this._series.push(series);
      region.addSeries(series);
    }
  }

  getAllSeries = (): ISeries[] => {
    return this._series ?? [];
  };

  getSeriesById(id: number): ISeries | undefined {
    return this._series.find(x => x.id === id);
  }

  protected _createComponent(constructor: IComponentConstructor, specInfo: IModelSpecInfo) {
    const component = constructor.createComponent(specInfo, {
      ...this._modelOption,
      type: constructor.type,
      getAllRegions: this.getAllRegions,
      getRegionsInIndex: this.getRegionsInIndex,
      getRegionsInIds: this.getRegionsInIds,
      getRegionsInUserIdOrIndex: this.getRegionsInUserIdOrIndex,
      getAllSeries: this.getAllSeries,
      getSeriesInIndex: this.getSeriesInIndex,
      getSeriesInIds: this.getSeriesInIds,
      getSeriesInUserIdOrIndex: this.getSeriesInUserIdOrIndex,
      getAllComponents: this.getComponents,
      getComponentByIndex: this.getComponentByIndex,
      getComponentByUserId: this.getComponentByUserId,
      getComponentsByKey: this.getComponentsByKey
    });
    if (!component) {
      return;
    }
    component.created();
    this._components.push(component);
  }

  getAllComponents(): IComponent[] {
    return this._components;
  }

  getAllModels(): IModel[] {
    return [].concat(this.getAllSeries(), this.getAllComponents(), this.getAllRegions());
  }

  getModelInFilter(filter: string | { type: string; index: number } | ((model: IModel) => boolean)) {
    if (isString(filter)) {
      return this.getAllModels().find(m => m.userId === filter);
    } else if (isFunction(filter)) {
      return this.getAllModels().find(m => filter(m));
    }
    let index = 0;
    return this.getAllModels().find(m => {
      if ((m.specKey ?? m.type) === filter.type) {
        if (index === filter.index) {
          return true;
        }
        index++;
      }
      return false;
    });
  }

  private _createLayout() {
    this._updateLayoutRect(this._option.viewBox);
    this._initLayoutFunc();
  }

  setLayout(layout: LayoutCallBack) {
    // 统一自定义 layout 到 option 中
    this._option.layout = layout;
    this._initLayoutFunc();
  }

  /** 可以通过设置 layout = null 来取消自定义布局。启用spec上的布局配置 */
  private _initLayoutFunc() {
    this._layoutFunc = this._option.layout;
    if (!this._layoutFunc) {
      // 判断是否使用3d的layout
      let use3dLayout = false;
      // 查找是否需要使用3d布局模块
      if ((this._spec as any).zField || (this._spec.series && this._spec.series.some((s: any) => s.zField))) {
        use3dLayout = true;
      }
      const constructor = Factory.getLayoutInKey(this._spec.layout?.type ?? (use3dLayout ? 'layout3d' : 'base'));
      if (constructor) {
        const layout = new constructor(this._spec.layout, {
          onError: this._option?.onError
        });
        this._layoutFunc = layout.layoutItems.bind(layout);
      }
    }
  }

  layout(params: ILayoutParams): void {
    this._option.performanceHook?.beforeLayoutWithSceneGraph?.();
    if (this.getLayoutTag()) {
      this._event.emit(ChartEvent.layoutStart, { chart: this });

      this.onLayoutStart(params);
      const elements = this.getLayoutElements();
      this._layoutFunc(this, elements, this._layoutRect, this._viewBox);
      this._event.emit(ChartEvent.afterLayout, { elements });
      this.setLayoutTag(false);
      this.onLayoutEnd(params);

      this._event.emit(ChartEvent.layoutEnd, { chart: this });
    }
    this._option.performanceHook?.afterLayoutWithSceneGraph?.();
  }

  // 通知所有需要通知的元素 onLayout 钩子
  onLayoutStart(option: IChartLayoutOption) {
    const elements = this.getAllModels();
    elements.forEach(element => element.onLayoutStart(this._layoutRect, this._viewRect, option));
  }

  // 通知所有需要通知的元素 onLayoutEnd 钩子
  onLayoutEnd(option: IChartLayoutOption) {
    const elements = this.getAllModels();
    elements.forEach(element => element.onLayoutEnd(option));
  }

  onEvaluateEnd(option: IChartEvaluateOption) {
    const elements = [...this._components, ...this._regions, ...this._series];
    elements.forEach(element => element.onEvaluateEnd(option));
  }

  getLayoutElements(): ILayoutItem[] {
    return this.getAllModels()
      .map(i => i.layout)
      .filter(i => !!i);
  }

  // 区域
  getRegionsInIndex = (index?: number[]): IRegion[] => {
    if (!index || index.length === 0) {
      return [this._regions[0]];
    }
    return this._regions.filter((_r, i) => index.includes(i));
  };

  getAllRegions = () => {
    return this._regions;
  };

  getRegionsInIds = (ids: number[]): IRegion[] => {
    if (!ids) {
      return [];
    }
    return this._regions.filter(r => ids.includes(r.id));
  };

  getRegionsInQuerier = (region?: MaybeArray<IRegionQuerier>) => {
    if (region) {
      return this._regions.filter((r, index) => {
        return array(region).some(
          regionFilter =>
            (isValid(regionFilter.regionId) && regionFilter.regionId === r.userId) || regionFilter.regionIndex === index
        );
      });
    }
    return this._regions;
  };

  getRegionsInUserId = (userId: StringOrNumber): IRegion | undefined => {
    if (!userId) {
      return undefined;
    }
    return this._regions.find(r => r.userId === userId);
  };

  getRegionsInUserIdOrIndex = (user_ids?: StringOrNumber[], index?: number[]): IRegion[] => {
    const regions = this.getAllRegions();
    return regions.filter(r => {
      if (user_ids?.length) {
        return r.userId && user_ids.includes(r.userId);
      } else if (index?.length) {
        return index.includes(r.getSpecIndex());
      }
      return true;
    });
  };

  // 模块
  getComponents = () => {
    return this._components;
  };

  // 区域
  getSeriesInIndex = (index?: number[]): ISeries[] => {
    if (!index || index.length === 0) {
      return [this._series[0]];
    }
    return this._series.filter((_r, i) => index.includes(i));
  };

  getSeriesInIds = (ids?: number[]): ISeries[] => {
    if (!ids) {
      return [];
    }
    return this._series.filter(r => ids.includes(r.id));
  };

  getSeriesInUserId = (userId: StringOrNumber): ISeries | undefined => {
    if (!userId) {
      return undefined;
    }
    return this._series.find(r => r.userId === userId);
  };

  getSeriesInUserIdOrIndex = (user_ids?: StringOrNumber[], index?: number[]): ISeries[] => {
    const series = this.getAllSeries();
    return series.filter(s => {
      if (user_ids?.length) {
        return s.userId && user_ids.includes(s.userId);
      } else if (index?.length) {
        return index.includes(s.getSpecIndex());
      }
      return true;
    });
  };

  getComponentByIndex = (key: string, index: number) => {
    const components = this._components.filter(c => (c.specKey || c.type) === key);
    if (!components || components.length === 0) {
      return undefined;
    }
    return components[index];
  };

  getComponentsByKey = (key: string) => {
    return this._components.filter(c => (c.specKey || c.type) === key);
  };

  getComponentByUserId = (userId: StringOrNumber) => {
    const component = this._components.find(s => s.userId === userId);
    if (component) {
      return component;
    }
    return undefined;
  };

  getModelById(id: number): IModel | undefined {
    const model = this._idMap.get(id);
    if (model && model instanceof BaseModel) {
      return model;
    }
    return undefined;
  }

  getModelByUserId(userId: StringOrNumber): IModel | undefined {
    // TODO: 考虑通过 map 结构优化获取方式 & 补充所有 model 的寻找方法
    const series = this._series.find(s => s.userId === userId);
    if (series) {
      return series;
    }
    const region = this._regions.find(s => s.userId === userId);
    if (region) {
      return region;
    }
    const component = this._components.find(s => s.userId === userId);
    if (component) {
      return component;
    }
    return undefined;
  }

  getAllMarks(): IMark[] {
    const items = Array.from(this._idMap.values());
    return items.filter(item => item && item instanceof BaseMark) as IMark[];
  }

  getMarkById(id: number): IMark | undefined {
    const mark = this._idMap.get(id);
    if (mark && mark instanceof BaseMark) {
      return mark;
    }
    return undefined;
  }

  updateData(id: StringOrNumber, data: unknown, updateGlobalScale: boolean = true, options?: IParserOptions) {
    const dv = this._dataSet.getDataView(id as string);
    if (dv) {
      dv.markRunning();
      dv.parseNewData(data, options);
    }

    if (updateGlobalScale) {
      this.updateGlobalScaleDomain();
    }
    this.getAllModels().forEach(model => model.onDataUpdate());
  }

  updateFullData(data: IDataValues | IDataValues[], updateGlobalScale: boolean = true) {
    array(data).forEach(d => {
      const dv = this._dataSet.getDataView(d.id);
      if (dv) {
        dv.markRunning();
      }
    });
    array(data).forEach(d => {
      const dv = this._dataSet.getDataView(d.id);
      if (dv) {
        updateDataViewInData(dv, d, true);
      }
    });
    if (updateGlobalScale) {
      this.updateGlobalScaleDomain();
    }
    this.getAllModels().forEach(model => model.onDataUpdate());
  }

  onRender(option: IChartRenderOption) {
    // do nothing
  }

  setCanvasRect(width: number, height: number) {
    this._canvasRect = { width, height };
  }

  getCanvasRect(): Omit<IRect, 'x' | 'y'> {
    if (this._canvasRect) {
      return this._canvasRect;
    }

    this._canvasRect = calculateChartSize(this._spec, this._option, {
      width: DEFAULT_CHART_WIDTH,
      height: DEFAULT_CHART_HEIGHT
    });

    return this._canvasRect;
  }

  getSeriesData(id: StringOrNumber | undefined, index: number | undefined): DataView | undefined {
    return this._chartData.getSeriesData(id, index);
  }

  private _transformSpecScale() {
    const scales: IChartSpec['scales'] = this._spec.scales ?? [];
    let colorScaleSpec: IVisualSpecScale<any, any> = scales.find(s => s.id === 'color');
    const colorScheme = this.getColorScheme();
    if (!colorScaleSpec) {
      colorScaleSpec = {
        type: 'ordinal',
        id: 'color',
        domain: null,
        range: null
      };
      scales.push(colorScaleSpec);
      if (this._spec.color) {
        const colorSpec = this._spec.color as string[] | IVisual<string>;

        // range array
        if (isArray(colorSpec)) {
          colorScaleSpec.range = colorSpec;
        } else {
          const tempSpec = colorSpec as IVisualSpecScale<any, any>;
          Object.prototype.hasOwnProperty.call(tempSpec, 'type') && (colorScaleSpec.type = tempSpec.type);
          Object.prototype.hasOwnProperty.call(tempSpec, 'domain') && (colorScaleSpec.domain = tempSpec.domain);
          Object.prototype.hasOwnProperty.call(tempSpec, 'range') && (colorScaleSpec.range = tempSpec.range);
          Object.prototype.hasOwnProperty.call(tempSpec, 'specified') &&
            (colorScaleSpec.specified = tempSpec.specified);
        }
      }
    }
    // 如果没有range设置
    // length === 0 就认为是没有配置，用户配置 color: [] 依然认为是无效配置，启用主题色板
    if (!colorScaleSpec.range?.length) {
      colorScaleSpec.range = getDataScheme(colorScheme);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      colorScaleSpec.rangeTheme = true;
    }
    return scales;
  }

  // 全局通道
  private _createGlobalScale() {
    this._globalScale = new GlobalScale(this._transformSpecScale(), this);
    this._modelOption.globalScale = this._globalScale;
  }

  updateGlobalScaleDomain() {
    const domainSet = new Set();
    this._series.forEach(s => {
      const keys = s.getSeriesKeys();
      keys && keys.forEach(k => domainSet.add(k));
    });
    // domain
    const domain = Array.from(domainSet);
    // 如果 global scale 当前没有 domain 的话，就使用这个domain
    // 整理了目前会影响全局 scale 的逻辑，但是当前这个节点使用这个逻辑可行
    // 但是考虑到组件也可能会有修改 scale 的逻辑
    // 增加一个属性设置优先级也许是必须的？
    this._globalScale.updateScaleDomain(domain);
  }

  updateGlobalScale(result: IUpdateSpecResult) {
    mergeUpdateResult(result, this._globalScale.updateSpec(this._transformSpecScale()));
  }

  updateGlobalScaleTheme() {
    const colorSpec = this._globalScale.getScaleSpec('color');
    const colorScheme = this.getColorScheme();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (colorSpec.rangeTheme) {
      colorSpec.range = getDataScheme(colorScheme);
      this._globalScale.getScale('color').range(colorSpec.range);
    }
  }

  updateSpec(spec: T) {
    const result = {
      change: false,
      reMake: false,
      reRender: false,
      reSize: false,
      reCompile: false
    };
    // 需要重新布局
    this.setLayoutTag(true, null, false);
    // 第一版简易逻辑如果配置项出现增删，直接重新创建chart
    // 如果出现类型不同，同上
    if (spec.type !== this.type) {
      result.reMake = true;
      return result;
    }
    // spec set & transformSpec
    // diff meta length;
    const currentKeys = Object.keys(this._spec).sort();
    const nextKeys = Object.keys(spec).sort();
    if (JSON.stringify(currentKeys) !== JSON.stringify(nextKeys)) {
      result.reMake = true;
      return result;
    }
    const oldSpec = this._spec;
    this._spec = spec;
    // update chart config
    this.updateChartConfig(result, oldSpec);
    if (result.reMake) {
      return result;
    }

    this.updateGlobalScale(result);
    if (result.reMake) {
      return result;
    }
    // region 变化
    this.updateRegionSpec(result);
    if (result.reMake) {
      return result;
    }
    this.updateComponentSpec(result);
    if (result.reMake) {
      return result;
    }
    this.updateSeriesSpec(result);
    if (result.reMake) {
      return result;
    }
    this.updateDataSpec(result);
    if (result.reMake) {
      return result;
    }
    // ensure that the domain of the scale follows the data change
    this.updateGlobalScaleDomain();
    return result;
  }

  updateChartConfig(result: IUpdateSpecResult, oldSpec: IChartSpec) {
    // padding;
    this._paddingSpec = normalizeLayoutPaddingSpec(this._spec.padding ?? this._option?.getTheme().padding);

    // re compute padding & layout
    this._updateLayoutRect(this._viewBox);

    // background need remake
    if (!isEqual(this._spec.background, oldSpec.background)) {
      result.reMake = true;
    }
  }

  updateDataSpec(result: IUpdateSpecResult) {
    if (!this._spec.data) {
      return;
    }
    this._chartData.updateData(this._spec.data, false, true);
  }

  updateRegionSpec(result: IUpdateSpecResult) {
    if (!this._spec?.region) {
      return;
    }
    // 长度不同，直接判定为 remake
    if (this._spec.region.length !== this._regions.length) {
      result.reMake = true;
      return;
    }
    this._regions.forEach(r => {
      mergeUpdateResult(result, r.updateSpec(this._spec.region[r.getSpecIndex()]));
    });
  }

  updateComponentSpec(result: IUpdateSpecResult) {
    // 用来检测组件是否有新增
    const componentCache: {
      [key in string]: {
        specCount: number;
        componentCount: number;
      };
    } = {};
    this._components.forEach(c => {
      const compSpecKey = c.specKey || c.type;
      // 每一个组件获取对应的speck
      const cmpSpec = this._spec[compSpecKey] ?? {};
      if (isArray(cmpSpec)) {
        componentCache[compSpecKey] = componentCache[compSpecKey] || {
          specCount: cmpSpec.length,
          componentCount: 0
        };
        componentCache[compSpecKey].componentCount++;
        mergeUpdateResult(result, c.updateSpec(cmpSpec[c.getSpecIndex()] ?? {}, cmpSpec));
      } else {
        mergeUpdateResult(result, c.updateSpec(cmpSpec));
      }
    });
    for (const key in componentCache) {
      if (Object.prototype.hasOwnProperty.call(componentCache, key)) {
        const element = componentCache[key];
        if (element.componentCount !== element.specCount) {
          result.reMake = true;
        }
      }
    }
  }

  updateSeriesSpec(result: IUpdateSpecResult) {
    // 长度不同，直接判定为 remake
    if (this._spec.series.length !== this._series.length) {
      result.reMake = true;
      return;
    }
    this._series.forEach(s => {
      const spec = this._spec.series[s.getSpecIndex()];
      mergeUpdateResult(result, s.updateSpec(spec));
    });
  }

  getCanvas() {
    return this.getCompiler()?.getCanvas() ?? null;
  }

  private _updateLayoutRect(viewBox: IBoundsLike) {
    const canvasRect = this.getCanvasRect();
    let viewRect = canvasRect;
    if (viewBox) {
      this._viewBox = viewBox;
      const { x1 = 0, y1 = 0, x2, y2 } = viewBox;
      viewRect = {
        width: x2 - x1,
        height: y2 - y1
      };
    } else {
      this._viewBox = { x1: 0, y1: 0, x2: viewRect.width, y2: viewRect.height };
    }
    this._viewRect = viewRect;
    // resize 时 padding 也应该会发生变化 先计算
    this.padding = calcPadding(this._paddingSpec, viewRect, viewRect);
    this._layoutRect.width = viewRect.width - this.padding.left - this.padding.right;
    this._layoutRect.height = viewRect.height - this.padding.top - this.padding.bottom;
    this._layoutRect.x = this.padding.left;
    this._layoutRect.y = this.padding.top;

    this._event.emit(ChartEvent.layoutRectUpdate, {});
  }

  /** 设置当前全局主题 */
  setCurrentTheme() {
    // update chart config
    this.updateChartConfig({ change: true, reMake: false }, this._spec);

    // 需要重新布局
    this.setLayoutTag(true, null, false);

    // 设置色板，只设置 colorScale 的 range
    this.updateGlobalScaleTheme();

    this._regions.forEach(r => r.reInit(r.getSpecInfo().spec));
    this._series.forEach(s => s.reInit(s.getSpecInfo().spec));
    this._components.forEach(c => c.reInit(c.getSpecInfo().spec));
  }

  clear() {
    // call on recompile & release
    this.getAllModels().forEach(i => i.clear?.());
  }

  compile() {
    this.compileBackground();
    this.compileLayout();
    this.compileRegions();
    this.compileSeries();
    this.compileComponents();
  }

  afterCompile() {
    this.getAllRegions().forEach(r => {
      r.afterCompile?.();
    });
    this.getAllSeries().forEach(s => {
      s.afterCompile?.();
    });
    this.getAllComponents().forEach(c => {
      c.afterCompile?.();
    });
  }

  compileLayout() {
    const { width, height } = this.getCanvasRect();
    this.getCompiler().setSize(width, height);
  }

  compileBackground() {
    if (!this._backgroundMark) {
      return;
    }
    this._backgroundMark.compile();
    this._backgroundMark
      .getProduct()
      ?.configure({
        context: {
          model: this
        }
      })
      .layout(() => {
        // console.log('region mark layout');
      });
  }

  compileRegions() {
    this._option.performanceHook?.beforeRegionCompile?.();
    this.getAllRegions().forEach(r => {
      r.compile();
    });
    this._option.performanceHook?.afterRegionCompile?.();
  }

  compileSeries() {
    this._option.performanceHook?.beforeSeriesCompile?.();
    this.getAllSeries().forEach(s => {
      s.compile();
    });
    this._option.performanceHook?.afterSeriesCompile?.();
  }

  compileComponents() {
    this._option.performanceHook?.beforeComponentCompile?.();
    this.getAllComponents().forEach(c => {
      c.compile();
    });
    this._option.performanceHook?.afterComponentCompile?.();
  }

  release() {
    /* release 前的处理 */
    [...this._components, ...this._regions, ...this._series].forEach(m => {
      m.beforeRelease();
    });

    /* 开始 release */
    super.release();
    // clear event , temporary function of  chart items
    this.clear();

    [...this._components, ...this._regions, ...this._series].forEach(m => {
      m.release();
    });
    this._components = this._regions = this._series = [];
    this._spec = {} as any;
    // FIXME: type lint
    this._dataSet = this._globalScale = this._layoutFunc = null as unknown as any;
    this._layoutTag = false;
    this._idMap.clear();
  }

  onLayout(srView: IView) {
    const root = srView.rootMark;
    this.layout({ group: root, srView });
  }

  /**
   * 更新或设置图元状态
   * @param state 状态筛选器
   * @param filter 筛选器
   */
  updateState(
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean //series + mark 筛选
  ): void {
    const seriesArr = this.getAllSeries();
    for (const key in state) {
      if (isEmpty(state[key])) {
        continue;
      }
      const stateSpec = state[key];
      let stateInfo: IStateInfo = { stateValue: key };
      if (isFunction(stateSpec.filter)) {
        stateInfo = { filter: stateSpec.filter, ...stateInfo };
      } else {
        stateInfo = { ...stateSpec.filter, ...stateInfo };
      }
      if (stateSpec.level) {
        stateInfo.level = stateSpec.level;
      }
      seriesArr.forEach(series => {
        series.getMarks().forEach(m => {
          if (!m.stateStyle[key]) {
            return;
          }
          if (!filter || filter(series, m, key)) {
            m.state.changeStateInfo(stateInfo);
            m.updateMarkState(key);
          }
        });
      });
    }
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
    this._setStateInDatum(STATE_VALUE_ENUM.STATE_SELECTED, true, datum, filter, region);
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
    this._setStateInDatum(STATE_VALUE_ENUM.STATE_HOVER, true, datum, filter, region);
  }

  private _initEvent() {
    [ChartEvent.dataZoomChange, ChartEvent.scrollBarChange].forEach(event => {
      this._event.on(event, ({ value }) => {
        // 非数据筛选的方式，图元不存在增删，可以保持动画效果
        if (!value.filterData) {
          return;
        }
        this._disableMarkAnimation(['exit', 'update']);
        const enableMarkAnimate = () => {
          this._enableMarkAnimation(['exit', 'update']);
          this._event.off(VGRAMMAR_HOOK_EVENT.AFTER_MARK_RENDER_END, enableMarkAnimate);
        };
        this._event.on(VGRAMMAR_HOOK_EVENT.AFTER_MARK_RENDER_END, enableMarkAnimate);
      });
    });
  }

  protected _enableMarkAnimation(states: string | string[]) {
    const marks = this.getAllMarks();
    marks.forEach(mark => {
      const product = mark.getProduct();
      if (product && product.animate) {
        product.animate.enableAnimationState(states);
      }
    });
  }

  protected _disableMarkAnimation(states: string | string[]) {
    const marks = this.getAllMarks();
    marks.forEach(mark => {
      const product = mark.getProduct();
      if (product && product.animate) {
        product.animate.disableAnimationState(states);
      }
    });
  }

  protected _setStateInDatum(
    stateKey: string,
    checkReverse: boolean,
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) {
    datum = datum ? array(datum) : null;
    const keys = !datum ? null : Object.keys(datum[0]);
    this.getRegionsInQuerier(region).forEach(r => {
      if (!datum) {
        r.interaction.clearEventElement(stateKey, true);
        return;
      }
      r.getSeries().forEach(s => {
        s.getMarks().forEach(m => {
          if (!m.getProduct()) {
            return;
          }
          if (!filter || (isFunction(filter) && filter(s, m))) {
            const isCollect = m.getProduct().isCollectionMark();
            const elements = m.getProduct().elements;
            let pickElements = elements;
            if (isCollect) {
              pickElements = elements.filter(e => {
                const elDatum = e.getDatum();
                // eslint-disable-next-line max-nested-callbacks, eqeqeq
                (datum as Datum[]).every((d, index) => keys.every(k => d[k] == elDatum[index][k]));
              });
            } else {
              if (datum.length > 1) {
                const datumTemp = (datum as Datum[]).slice();
                pickElements = elements.filter(e => {
                  if (datumTemp.length === 0) {
                    return false;
                  }
                  const elDatum = e.getDatum();
                  // eslint-disable-next-line max-nested-callbacks, eqeqeq
                  const index = datumTemp.findIndex(d => keys.every(k => d[k] == elDatum[k]));
                  if (index >= 0) {
                    datumTemp.splice(index, 1);
                    return true;
                  }
                  return false;
                });
              } else {
                // eslint-disable-next-line eqeqeq
                const el = elements.find(e => keys.every(k => datum[0][k] == e.getDatum()[k]));
                el && (pickElements = [el]);
              }
            }
            pickElements.forEach(element => {
              r.interaction.addEventElement(stateKey, element);
            });
          }
        });
      });
      if (checkReverse) {
        r.interaction.reverseEventElement(stateKey);
      }
    });
  }

  /**
   * setDimensionIndex could trigger mark state, tooltip, crosshair
   * @param value dimension value
   * @param opt option for set trigger
   */
  setDimensionIndex(value: StringOrNumber, opt: DimensionIndexOption) {
    // event
    let dimensionInfo: IDimensionInfo[] | null = null;
    Array.from(this._event.getComposedEventMap().values()).forEach(e => {
      const { eventType, event } = e;
      if (eventType === DimensionEventEnum.dimensionHover || eventType === DimensionEventEnum.dimensionClick) {
        const info = event.dispatch(value, opt) as [];
        if (info?.length) {
          dimensionInfo = info;
        }
      }
    });
    const isUnableValue =
      isNil(value) || !dimensionInfo || dimensionInfo.every(d => isDiscrete(d.axis.getScale().type) && isNil(d.index));
    // tooltip
    if (opt.tooltip !== false) {
      const tooltip = this._components.find(c => c.type === ComponentTypeEnum.tooltip) as unknown as ITooltip;
      if (tooltip?.getVisible()) {
        if (isUnableValue) {
          (<any>tooltip).hideTooltip?.();
        } else {
          const dataFilter = {};
          dimensionInfo.forEach((d: IDimensionInfo) => {
            const { axis, value, data } = d;
            const isY = axis.getOrient() === 'left' || axis.getOrient() === 'right';
            data.forEach(d => {
              if (isY) {
                dataFilter[(<ICartesianSeries>d.series).fieldY[0]] = value;
              } else {
                dataFilter[(<ICartesianSeries>d.series).fieldX[0]] = value;
              }
            });
          });
          tooltip.showTooltip(dataFilter, opt.showTooltipOption);
        }
      }
    }
    if (opt.crosshair !== false) {
      const crosshair = this._components.find(
        c => c.type === ComponentTypeEnum.cartesianCrosshair
      ) as unknown as ICrossHair;
      if (crosshair && crosshair.clearAxisValue && crosshair.setAxisValue) {
        if (isUnableValue) {
          crosshair.clearAxisValue?.();
          crosshair.hide?.();
        } else {
          dimensionInfo.forEach((d: IDimensionInfo) => {
            const { axis, value } = d;
            crosshair.clearAxisValue();
            crosshair.setAxisValue(value, axis);
            crosshair.layoutByValue();
          });
        }
      }
    }
  }

  getColorScheme() {
    return this._option.getTheme?.().colorScheme;
  }
}
