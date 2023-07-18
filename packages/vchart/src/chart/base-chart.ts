import type { ICrossHair } from './../component/crosshair/interface/spec';
import type { IDimensionInfo } from './../event/events/dimension/interface';
import type {
  ISeriesSpec,
  Datum,
  IMarkStateSpec,
  IVisual,
  IVisualSpecScale,
  IRegionQuerier,
  MaybeArray,
  IPadding,
  IRect,
  StringOrNumber,
  IChartSpec
} from '../typings';
import type { LayoutCallBack } from '../layout/interface';
import { GlobalScale } from '../scale/global-scale';
import type {
  ILayoutModelState,
  ILayoutOrientPadding,
  ILayoutRect,
  IModel,
  IModelOption,
  IUpdateSpecResult
} from '../model/interface';
import type {
  IChart,
  IChartLayoutOption,
  IChartRenderOption,
  IChartOption,
  IChartEvaluateOption,
  ILayoutParams,
  DimensionIndexOption
} from './interface';
import type { ICartesianSeries, ISeries } from '../series/interface';
import type { IRegion } from '../region/interface';
import { ComponentTypeEnum } from '../component/interface';
// eslint-disable-next-line no-duplicate-imports
import type { IComponent } from '../component/interface';
import type { IMark } from '../mark/interface';
import type { IEvent } from '../event/interface';
import type { DataView } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset/es/data-set';
import { Factory } from '../core/factory';
import { Event } from '../event/event';
import {
  isArray,
  isValid,
  createID,
  calcPadding,
  normalizeLayoutPaddingSpec,
  array,
  isTrueBrowser,
  isString
} from '../util';
import { Stack } from './stack';
import { BaseModel } from '../model/base-model';
import { BaseMark } from '../mark/base/base-mark';
import type { ITheme } from '../theme/interface';
import { DEFAULT_CHART_WIDTH, DEFAULT_CHART_HEIGHT } from '../constant/base';
import { dataToDataView } from '../data/initialize';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { has, isFunction, isEmpty, getContainerSize } from '@visactor/vutils';
import { getActualColor, getDataScheme } from '../theme/color-scheme/util';
import type { IGroupMark, IMorphConfig, IMark as IVGrammarMark, IView } from '@visactor/vgrammar';
import { CompilableBase } from '../compile/compilable-base';
import type { IStateInfo } from '../compile/mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { STATE_VALUE_ENUM } from '../compile/mark/interface';
import { ChartEvent, VGRAMMAR_HOOK_EVENT } from '../constant';
import type { IGlobalScale } from '../scale/interface';
import { DimensionEventEnum } from '../event/events/dimension';
import type { ITooltip } from '../component/tooltip/interface';

export class BaseChart extends CompilableBase implements IChart {
  readonly type: string = 'chart';

  readonly id: number = createID();

  //FIXME: 转换后的 spec 需要声明 ITransformedChartSpec
  protected _spec: any;
  getSpec() {
    return this._spec;
  }
  setSpec(s: any) {
    // TODO 通过spec设置进行图表更新
    this.transformSpec(s);
    this._spec = s;
  }

  // 主题
  protected _theme: ITheme;

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
  protected _dataSet: DataSet;
  protected declare _option: IChartOption;

  protected _layoutTag: boolean = true;
  getLayoutTag() {
    return this._layoutTag;
  }
  setLayoutTag(tag: boolean, morphConfig?: IMorphConfig): boolean {
    this._layoutTag = tag;
    if (this.getCompiler()?.getVGrammarView()) {
      this.getCompiler().getVGrammarView().updateLayoutTag();
      tag && this.getCompiler().reRenderAsync(morphConfig);
    }
    return this._layoutTag;
  }

  // 模块内的需要动态影像图表的属性
  readonly state: ILayoutModelState = {
    layoutUpdateRank: 1
  };

  // stack
  protected _stack: Stack;

  padding: IPadding = { top: 0, left: 0, right: 0, bottom: 0 };
  protected _paddingSpec: ILayoutOrientPadding;

  protected _canvasRect: ILayoutRect;

  constructor(spec: any, option: IChartOption) {
    super(option);

    this._theme = option.getTheme();
    this._paddingSpec = normalizeLayoutPaddingSpec(spec.padding ?? this._theme?.padding);

    this._event = new Event(option.eventDispatcher, option.mode);
    this._dataSet = option.dataSet;
    this._modelOption = {
      ...option,
      mode: this._option.mode,
      map: this._idMap,
      getChartLayoutRect: () => this._layoutRect,
      getChartViewRect: () => this._viewRect,
      getChart: () => this,
      globalScale: this._globalScale
    };
    this._stack = new Stack(this);
    this._spec = spec;
  }

  created() {
    this.transformSpec(this._spec);
    this.createGlobalScale();
    // 基础内容
    this.createLayout();
    // 基于spec 创建元素。
    // region
    this.createRegion(this._spec.region);
    this.createSeries(this._spec.series);
    this.createComponent(this._spec);
  }
  transformSpec(spec: any): void {
    if (!spec.region || spec.region.length === 0) {
      spec.region = [{}];
    }
    if (!has(spec, 'tooltip')) {
      spec.tooltip = {};
    }
  }

  init(options: any = {}) {
    // 元素创建完毕后再执行各元素的初始化 方便各元素能获取到其他模块
    this.initRegion();
    this.initSeries();
    // global scale 应当在series初始化完成后，组件初始化之前
    // 此时 globalScale 已经生效组件可以获取到正确的映射
    this.initGlobalScale();
    // component
    this.initComponent();
    // event
    this.initEvent();

    // TODO: to component
    // stack
    this._stack.init();
    // this._stack.stackAll();
    this._series.forEach(s => s.getRawData()?.markRunning());
    this._series.forEach(s => s.fillData());
  }

  onResize(width: number, height: number): void {
    const canvasRect = {
      width,
      height
    };
    this._canvasRect = canvasRect;
    this._updateLayoutRect(this._option.viewBox);
    this.setLayoutTag(true);
  }

  updateViewBox(viewBox: IBoundsLike) {
    this._updateLayoutRect(viewBox);
    this.setLayoutTag(true);
  }

  createRegion(regionSpec: any[]) {
    // this._regions = [];
    if (!regionSpec) {
      return;
    }
    regionSpec.forEach((s, i) => {
      const region = Factory.createRegion('region', s, {
        ...this._modelOption,
        specIndex: i,
        specKey: 'region'
      });
      if (region) {
        region.created();
        this._regions.push(region);
      }
    });
  }

  initRegion() {
    this._regions.forEach(r => r.init({}));
  }

  createSeries(seriesSpec: ISeriesSpec[]) {
    seriesSpec.forEach((spec, index) => {
      // 自动填充数据
      if (!spec.data) {
        spec.data = this.getSeriesData(spec.dataId, spec.dataIndex);
      } else {
        // 保证数据最终是 DataView 实例
        spec.data = dataToDataView(spec.data, this._dataSet, this._spec.data as DataView[]);
      }

      // 如果用户在 vchart 构造函数参数中关闭了 animation, 则已该配置为准
      if (this._option.animation === false) {
        spec.animation = false;
      }

      let region: IRegion | undefined;
      if (isValid(spec.regionId)) {
        region = this.getRegionsInUserId(spec.regionId);
      } else if (isValid(spec.regionIndex)) {
        region = this.getRegionsInIndex([spec.regionIndex])[0];
      }

      if (!region) {
        region = this._regions[0];
      }
      if (!region) {
        return;
      }
      const series = Factory.createSeries(spec.type, spec, {
        ...this._modelOption,
        region,
        specIndex: index,
        specKey: 'series',
        getTheme: () => this._theme,
        globalScale: this._globalScale,
        getSeriesData: this.getSeriesData.bind(this)
      });

      if (series) {
        series.created();
        this._series.push(series);
        region.addSeries(series);
      }
    });
  }
  initSeries() {
    this._series.forEach(s => s.init({}));
  }
  getAllSeries = (): ISeries[] => {
    return this._series ?? [];
  };

  getSeriesById(id: number): ISeries | undefined {
    return this._series.find(x => x.id === id);
  }

  private _createComponent(Component: any, spec: any) {
    const component = Component.createComponent(spec, {
      ...this._modelOption,
      getAllRegions: this.getAllRegions,
      getRegionsInIndex: this.getRegionsInIndex,
      getRegionsInIds: this.getRegionsInIds,
      getRegionsInUserIdOrIndex: this.getRegionsInUserIdOrIndex,
      getTheme: () => this._theme,
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
    array(component).forEach(c => {
      c.created();
      this._components.push(c);
    });
  }

  createComponent(spec: any) {
    const components = Factory.getComponents();
    // 坐标轴组件只需要调用一次
    let cartesianAxis;
    let polarAxis;
    const noAxisComponents = [];
    for (let index = 0; index < components.length; index++) {
      const component = components[index];
      if (component.type.startsWith(ComponentTypeEnum.cartesianAxis)) {
        cartesianAxis = component;
      } else if (component.type.startsWith(ComponentTypeEnum.polarAxis)) {
        polarAxis = component;
      } else {
        noAxisComponents.push(component);
      }
    }
    // NOTE: 坐标轴组件需要在其他组件之前创建
    if (cartesianAxis) {
      this._createComponent(cartesianAxis, spec);
    }

    if (polarAxis) {
      this._createComponent(polarAxis, spec);
    }

    noAxisComponents.forEach(C => {
      this._createComponent(C, spec);
    });
  }

  initComponent() {
    this._components.forEach(c => c.init({ dataSet: this._dataSet }));
  }

  getAllComponents(): IComponent[] {
    return this._components;
  }

  getAllModels(): IModel[] {
    return [].concat(this.getAllSeries(), this.getAllComponents(), this.getAllRegions());
  }

  createLayout() {
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
      if (this._spec.zField || (this._spec.series && this._spec.series.some((s: any) => s.zField))) {
        use3dLayout = true;
      }
      const layout = new (Factory.getLayout(this._spec.layout?.type ?? (use3dLayout ? 'layout3d' : 'base')))(
        this._spec.layout
      );
      this._layoutFunc = layout.layoutItems.bind(layout);
    }
  }

  layout(params: ILayoutParams): void {
    this._option.performanceHook?.beforeLayoutWithSceneGraph?.();
    if (this.getLayoutTag()) {
      this._event.emit(ChartEvent.layoutStart, { chart: this });

      this.onLayoutStart(params);
      const elements = this.getLayoutElements();
      this._layoutFunc(this, elements, this._layoutRect, this._viewBox);
      this.setLayoutTag(false);
      this.onLayoutEnd(params);

      this._event.emit(ChartEvent.layoutEnd, { chart: this });
    }
    this._option.performanceHook?.afterLayoutWithSceneGraph?.();
  }

  // 通知所有需要通知的元素 onLayout 钩子
  onLayoutStart(option: IChartLayoutOption) {
    const elements = this.getLayoutElements();
    elements.forEach(element => element.onLayoutStart(this._layoutRect, this._viewRect, option));
  }

  // 通知所有需要通知的元素 onLayoutEnd 钩子
  onLayoutEnd(option: IChartLayoutOption) {
    const elements = this.getLayoutElements();
    elements.forEach(element => element.onLayoutEnd(option));
  }

  onEvaluateEnd(option: IChartEvaluateOption) {
    const elements = this.getLayoutElements();
    elements.forEach(element => element.onEvaluateEnd(option));
  }

  getLayoutElements() {
    return [...this._components, ...this._regions, ...this._series];
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
    const components = this._components.filter(c => c.specKey === key);
    if (!components || components.length === 0) {
      return undefined;
    }
    return components[index];
  };

  getComponentsByKey = (key: string) => {
    return this._components.filter(c => c.specKey === key);
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

  updateParseData(id: string, data: Datum[], options?: IParserOptions) {
    const dv = this._dataSet.getDataView(id);
    if (dv) {
      dv.updateRawData(data);
    }
  }

  updateData(id: StringOrNumber, data: unknown, options?: IParserOptions) {
    const dv = this._dataSet.getDataView(id as string);
    if (dv) {
      dv.parseNewData(data);
    }
    this.getAllModels().forEach(model => model.onDataUpdate());
  }

  onRender(option: IChartRenderOption) {
    // do nothing
  }

  getCanvasRect(): Omit<IRect, 'x' | 'y'> {
    if (this._canvasRect) {
      return this._canvasRect;
    }

    const { width: userWidth, height: userHeight } = this._spec;
    if (isValid(userWidth) && isValid(userHeight)) {
      this._canvasRect = {
        width: userWidth,
        height: userHeight
      };
    } else {
      let width = DEFAULT_CHART_WIDTH;
      let height = DEFAULT_CHART_HEIGHT;
      const container = this._option.container;
      const canvas = this._option.canvas;
      if (container) {
        const { width: containerWidth, height: containerHeight } = getContainerSize(
          this._option.container,
          DEFAULT_CHART_WIDTH,
          DEFAULT_CHART_HEIGHT
        );
        width = containerWidth;
        height = containerHeight;
      } else if (canvas && isTrueBrowser(this._option.mode)) {
        let canvasNode;
        if (isString(canvas)) {
          canvasNode = document?.getElementById(canvas);
        } else {
          canvasNode = canvas;
        }
        const { width: containerWidth, height: containerHeight } = getContainerSize(
          canvasNode as HTMLCanvasElement,
          DEFAULT_CHART_WIDTH,
          DEFAULT_CHART_HEIGHT
        );
        width = containerWidth;
        height = containerHeight;
      }

      width = userWidth ?? width;
      height = userHeight ?? height;

      this._canvasRect = {
        width,
        height
      };
    }

    return this._canvasRect;
  }

  getSeriesData(id: StringOrNumber | undefined, index: number | undefined): DataView | undefined {
    if (!this._spec.data) {
      // 没有数据，报错处理
      throw new Error('no data in spec!');
    }

    // dataId 优先
    if (typeof id === 'string') {
      const metchData = (this._spec.data as DataView[]).filter((data: any) => {
        return data.name === id;
      });

      if (metchData[0]) {
        return metchData[0];
      }

      // id不匹配，报错处理
      throw new Error(`no data matches dataId ${id}!`);
    }

    // 其次使用dataIndex
    if (typeof index === 'number') {
      if (this._spec.data[index]) {
        return this._spec.data[index];
      }
      // index不匹配，报错处理
      throw new Error(`no data matches dataIndex ${index}!`);
    }

    // 最后返回第一条数据
    return this._spec.data[0];
  }

  // 全局通道
  createGlobalScale() {
    const scales: IChartSpec['scales'] = this._spec.scales ?? [];
    let colorScaleSpec: IVisualSpecScale<any, any> = scales.find(s => s.id === 'color');
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
          colorScaleSpec.range = colorSpec.map(color => getActualColor(color, this._theme?.colorScheme));
        } else {
          colorScaleSpec.type = (colorSpec as IVisualSpecScale<any, any>).type;
          (colorSpec as IVisualSpecScale<any, any>).domain &&
            (colorScaleSpec.domain = (colorSpec as IVisualSpecScale<any, any>).domain);
          colorScaleSpec.range = (colorSpec as IVisualSpecScale<any, any>).range;
        }
      }
    }
    // 如果没有range设置
    // length === 0 就认为是没有配置，用户配置 color: [] 依然认为是无效配置，启用主题色板
    if (!colorScaleSpec.range?.length) {
      colorScaleSpec.range = getDataScheme(this._theme?.colorScheme);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      colorScaleSpec.rangeTheme = true;
    }
    this._globalScale = new GlobalScale(scales, this);
    this._modelOption.globalScale = this._globalScale;
  }

  initGlobalScale() {
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

  updateGlobalScaleTheme() {
    const colorSpec = this._globalScale.getScaleSpec('color');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (colorSpec.rangeTheme) {
      colorSpec.range = getDataScheme(this._theme?.colorScheme);
      this._globalScale.getScale('color').range(colorSpec.range);
    }
  }

  updateSpec(spec: any, morphConfig?: IMorphConfig) {
    const result = {
      change: false,
      reMake: false,
      reRender: false,
      reSize: false,
      reCompile: false
    };
    // 需要重新布局
    this.setLayoutTag(true, morphConfig);
    // 第一版简易逻辑如果配置项出现增删，直接重新创建chart
    // 如果出现类型不同，同上
    if (spec.type !== this.type) {
      result.reMake = true;
      return result;
    }
    // transform
    this.transformSpec(spec);
    // spec set & transformSpec
    // diff meta length;
    const currentKeys = Object.keys(this._spec);
    const nextKeys = Object.keys(spec);
    if (JSON.stringify(currentKeys) !== JSON.stringify(nextKeys)) {
      result.reMake = true;
      return result;
    }
    this._spec = spec;
    this.updateDataSpec(result);
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
    return result;
  }

  updateDataSpec(result: IUpdateSpecResult) {
    if (!this._spec.data) {
      return;
    }
    array(this._spec.data).forEach(d => {
      const dataView = this._dataSet.getDataView(d.id);
      if (dataView) {
        if (d.values) {
          dataView.updateRawData(d.values);
        } else if (!d.latestData) {
          dataView.updateRawData([]);
        }
      }
    });
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
      this._mergeUpdateResult(result, r.updateSpec(this._spec.region[r.getSpecIndex()]));
      r.reInit();
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
      // 每一个组件获取对应的speck
      const cmpSpec = this._spec[c.specKey] ?? {};
      if (isArray(cmpSpec)) {
        componentCache[c.specKey] = componentCache[c.specKey] || {
          specCount: cmpSpec.length,
          componentCount: 0
        };
        componentCache[c.specKey].componentCount++;
        this._mergeUpdateResult(result, c.updateSpec(cmpSpec[c.getSpecIndex()]));
      } else {
        this._mergeUpdateResult(result, c.updateSpec(cmpSpec));
      }
      c.reInit();
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
      this._mergeUpdateResult(result, s.updateSpec(this._spec.series[s.getSpecIndex()]));
      s.reInit();
    });
  }

  getCanvas() {
    return this.getCompiler()?.getCanvas() ?? null;
  }

  protected isValidSeries(seriesType: string): boolean {
    return true;
  }

  protected _getDefaultSeriesSpec(spec: any) {
    const series: any = {
      data: spec.data?.[0],
      dataKey: spec.dataKey,

      hover: spec.hover,
      select: spec.select,

      label: spec.label,

      seriesStyle: spec.seriesStyle,

      animation: spec.animation,
      animationAppear: spec.animationAppear,
      animationDisappear: spec.animationDisappear,
      animationEnter: spec.animationEnter,
      animationUpdate: spec.animationUpdate,
      animationExit: spec.animationExit,
      animationNormal: spec.animationNormal,

      extensionMark: spec.extensionMark
    };
    return series;
  }

  private _mergeUpdateResult(resultA: IUpdateSpecResult, resultB: IUpdateSpecResult) {
    resultA.change = resultA.change || resultB.change;
    resultA.reCompile = resultA.reCompile || resultB.reCompile;
    resultA.reMake = resultA.reMake || resultB.reMake;
    resultA.reRender = resultA.reRender || resultB.reRender;
    resultA.reSize = resultA.reSize || resultB.reSize;
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
  }

  /** 获取当前全局主题 */
  getCurrentTheme() {
    return this._theme;
  }

  /** 设置当前全局主题 */
  setCurrentTheme(theme: ITheme) {
    this._theme = theme;

    // 需要重新布局
    this.setLayoutTag(true);

    // transform
    this.transformSpec(this._spec);
    // 设置色板，只设置 colorScale 的 range
    this.updateGlobalScaleTheme();

    this.setRegionTheme();
    this.setComponentTheme(theme);
    this.setSeriesTheme(theme);
  }

  protected setRegionTheme() {
    this._regions.forEach(r => {
      r.reInit();
    });
  }

  protected setComponentTheme(theme: ITheme) {
    this._components.forEach(c => {
      c.setCurrentTheme(theme.series[c.type], true);
    });
  }

  protected setSeriesTheme(theme: ITheme) {
    this._series.forEach(async s => {
      await s.setCurrentTheme(theme.series[s.type], true);
    });
  }

  compile() {
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
    super.release();

    [...this._components, ...this._regions, ...this._series].forEach(m => {
      m.release();
    });
    this._components = this._regions = this._series = [];
    this._spec = {};
    // FIXME: type lint
    this._dataSet = this._globalScale = this._layoutFunc = null as unknown as any;
    this._layoutTag = false;
    this._idMap.clear();
  }

  onLayout(srView: IView) {
    const root = srView.rootMark;
    this.checkUpdate(root, null, null);
    this.layout({ group: root, srView });
  }

  /**
   * 未下沉组件通过这里绑定场景元素，保持布局逻辑
   * TODO: 但是不应该通过getProduct吗？
   * @param mark
   * @param model
   * @param sceneRoot
   * @returns
   */
  checkUpdate(mark: IVGrammarMark, model: IModel, sceneRoot: IVGrammarMark) {
    if (mark.context?.model) {
      sceneRoot = mark;
      model = mark.context.model;
    }
    if (model && mark.isUpdated) {
      model.bindSceneNode?.(sceneRoot.elements[0]);
      model.setAttributeTag(true);
      return;
    }
    if (mark.markType === 'group') {
      (mark as IGroupMark).children.forEach(child => {
        this.checkUpdate(child, model, sceneRoot);
      });
    }
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

  initEvent() {
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
                const datumTemp = [...(datum as Datum[])];
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
    if (!dimensionInfo) {
      return;
    }
    // tooltip
    if (opt.tooltip) {
      const tooltip = this._components.find(c => c.type === ComponentTypeEnum.tooltip) as unknown as ITooltip;
      if (tooltip.getVisible()) {
        const dataFilter = {};
        dimensionInfo.forEach((d: IDimensionInfo) => {
          const { axis, value, data } = d;
          const isY = axis.orient === 'left' || axis.orient === 'right';
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
    if (opt.crosshair) {
      const crosshair = this._components.find(
        c => c.type === ComponentTypeEnum.cartesianCrosshair
      ) as unknown as ICrossHair;
      if (crosshair && crosshair.clearAxisValue && crosshair.setAxisValue) {
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
