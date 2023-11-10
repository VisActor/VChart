import { cloneDeepSpec } from '../util/spec/clone-deep';
import { preprocessSpecOrTheme } from '../util/spec/preprocess';
import { createID } from '../util/id';
import { mergeSpec } from '../util/spec/merge-spec';
import { Event } from '../event/event';
import type { IEvent } from '../event/interface';
import { LayoutItem } from './layout-item';
import type {
  IEffect,
  IModel,
  IModelInitOption,
  IModelOption,
  IModelRenderOption,
  IModelEvaluateOption,
  IModelSpec,
  ILayoutRect,
  IModelMarkInfo
} from './interface';
import type { CoordinateType } from '../typings/coordinate';
import type { IMark, IMarkOption, IMarkRaw, IMarkStyle, MarkTypeEnum } from '../mark/interface';
import type {
  Datum,
  StateValueType,
  ConvertToMarkStyleSpec,
  ICommonSpec,
  StringOrNumber,
  IRect,
  ISeriesSpec
} from '../typings';
import type { CompilableData } from '../compile/data/compilable-data';
import { PREFIX } from '../constant';
import type { IGroupMark } from '@visactor/vgrammar-core';
import { isArray, isEqual, isValid } from '@visactor/vutils';
import { Factory } from '../core/factory';
import { MarkSet } from '../mark/mark-set';
import { defaultChartLevelTheme } from '../theme/builtin';

export abstract class BaseModel<T extends IModelSpec> extends LayoutItem<T> implements IModel {
  readonly type: string = 'null';
  readonly modelType: string = 'null';

  readonly id;

  userId: StringOrNumber | undefined = undefined;

  // 事件
  readonly event: IEvent;

  // 副作用
  readonly effect: IEffect;

  // 数据
  protected _data: CompilableData = null;
  getData() {
    return this._data;
  }

  protected _specIndex: number = 0;
  getSpecIndex() {
    return this._specIndex;
  }

  readonly specKey: string = '';

  protected _originalSpec: any;

  protected declare _option: IModelOption;
  getOption() {
    return this._option;
  }

  protected _marks: MarkSet = new MarkSet();
  getMarks(): IMark[] {
    return this._marks?.getMarks() ?? [];
  }
  getMarkNameMap() {
    return this._marks?.getMarkNameMap();
  }
  getMarkSet() {
    return this._marks;
  }
  getMarkInfoList(): IModelMarkInfo[] {
    return this.getMarks().map(mark => ({
      type: mark.type as MarkTypeEnum,
      name: mark.name
    }));
  }

  getChart() {
    return this._option.getChart();
  }

  protected _theme?: any; // 非全局 theme，是对应于具体 model 的 theme 对象

  /** for layout diff */
  protected _lastLayoutRect: ILayoutRect = null;

  // TODO: 有些hack,这个tag是为了避免布局逻辑中，轴的数据变化，又由数据变化触发重新布局
  protected _isLayout: boolean = true;

  constructor(spec: T, option: IModelOption) {
    super(option);
    this.id = createID();
    this._originalSpec = spec;
    this._spec = cloneDeepSpec(spec);
    this._transformSpec();
    this.userId = spec.id;
    this._specIndex = option.specIndex ?? 0;
    this.effect = {};
    this.event = new Event(option.eventDispatcher, option.mode);
    option.map?.set(this.id, this);
  }
  coordinate?: CoordinateType;

  protected _releaseEvent() {
    this.event.release();
  }

  created() {
    this._initTheme();
    this.setAttrFromSpec();
  }

  init(option: IModelInitOption) {
    // do nothing
  }

  afterInit() {
    // do nothing
  }

  onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void {
    super.onLayoutStart(layoutRect, viewRect, ctx);
    this._isLayout = true;
  }
  onLayoutEnd(ctx: any): void {
    // diff layoutRect
    const layoutRect = this.getLayoutRect();
    if (this._forceLayoutTag || !isEqual(this._lastLayoutRect, layoutRect)) {
      this.updateLayoutAttribute();
    }
    this._forceLayoutTag = false;
    this.getMarks().forEach(m => m.updateLayoutState(true, true));
    this._isLayout = false;
  }

  protected _forceLayout() {
    if (this._isLayout) {
      return;
    }
    this._forceLayoutTag = true;
    this._option.globalInstance.getChart()?.setLayoutTag(true);
  }

  onEvaluateEnd(ctx: IModelEvaluateOption) {
    // do nothing
  }
  abstract onRender(ctx: IModelRenderOption): void;

  onDataUpdate() {
    // do nothing
  }

  beforeRelease() {
    // do nothing
  }

  release() {
    this._releaseEvent();
    this._originalSpec = {};
    this._spec = undefined;
    this.getMarks().forEach(m => m.release());
    this._data?.release();
    this._data = this._specIndex = null;
    this._marks.clear();
    super.release();
  }

  updateSpec(spec: any) {
    this._spec = cloneDeepSpec(spec);
    const result = this._compareSpec();
    this._originalSpec = spec;
    if (!result.reMake) {
      this.reInit();
    }
    return result;
  }

  protected _transformSpec() {
    // do nothing
    // change spec by default logic
  }

  protected _compareSpec() {
    const result = {
      change: false,
      reMake: false,
      reRender: false,
      reSize: false,
      reCompile: false
    };
    return result;
  }

  reInit(theme?: any) {
    // before reInit reset this._spec to original
    this._spec = cloneDeepSpec(this._originalSpec);
    this._transformSpec();
    this._initTheme(theme);
    this.setAttrFromSpec();
  }

  protected _initTheme(theme?: any) {
    if (this.getVisible() === false) {
      // 不展示不需要处理主题
      return;
    }
    if (theme) {
      this._theme = theme;
    } else {
      this._theme = this._getTheme();
    }

    this._mergeThemeToSpec();
  }

  protected _getTheme(): any {
    return undefined;
  }

  /** 将 theme merge 到 spec 中 */
  protected _mergeThemeToSpec() {
    if (this._shouldMergeThemeToSpec()) {
      const specFromChart = this._getDefaultSpecFromChart(this.getChart().getSpec());

      // this._originalSpec + specFromChart + this._theme = this._spec
      const merge = (originalSpec: any) =>
        mergeSpec(
          {},
          this._theme,
          this._prepareSpecBeforeMergingTheme(specFromChart),
          this._prepareSpecBeforeMergingTheme(originalSpec)
        );

      const baseSpec = this._spec;
      if (isArray(baseSpec)) {
        this._spec = baseSpec.map(spec => merge(spec)) as unknown as T;
      } else {
        this._spec = merge(baseSpec);
      }
    }
    this._prepareSpecAfterMergingTheme();
  }

  /** 从 chart spec 提取配置作为 model 的默认 spec 配置 */
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    return {};
  }

  /** 是否在初始化时将 theme 自动 merge 到 spec */
  protected _shouldMergeThemeToSpec(): boolean {
    return true;
  }

  /** 在 merge 主题前对 spec 进行预处理 */
  protected _prepareSpecBeforeMergingTheme(obj?: any): any {
    // do nothing
    return obj;
  }

  /** 在 merge 主题后对 spec 进行遍历和转换 */
  protected _prepareSpecAfterMergingTheme(obj?: any): any {
    if (!arguments.length) {
      obj = this._spec;
    }

    const newObj = preprocessSpecOrTheme(
      'spec',
      obj,
      this.getColorScheme(),
      this.modelType === 'series' ? (this._spec as unknown as ISeriesSpec) : undefined
    );

    if (!arguments.length) {
      this._spec = newObj;
    }
    return newObj;
  }

  async setCurrentTheme(noRender?: boolean) {
    const modifyConfig = () => {
      // 重新初始化
      this.reInit(this._getTheme());

      return { change: true, reMake: false };
    };

    if (noRender) {
      modifyConfig();
    } else {
      await this._option.globalInstance.updateCustomConfigAndRerender(modifyConfig);
    }
  }

  updateLayoutAttribute() {
    // do nothing
  }

  setAttrFromSpec() {
    super.setAttrFromSpec(this._spec, this._option.getChartViewRect());
  }

  /** mark style 内部转换逻辑，override 使用 */
  protected _convertMarkStyle<T extends ICommonSpec = ICommonSpec>(
    style: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>
  ): Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>> {
    const newStyle: any = { ...style };
    return newStyle;
  }

  setMarkStyle<T extends ICommonSpec>(
    mark: IMarkRaw<T>,
    style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>,
    state?: StateValueType,
    level?: number
  ) {
    if (!isValid(mark) || !isValid(style)) {
      return;
    }
    mark.setStyle(this._convertMarkStyle(style), state, level);
  }

  initMarkStyleWithSpec(mark?: IMark, spec?: any, key?: string) {
    if (!isValid(mark) || !isValid(spec)) {
      return;
    }
    const { style, state } = spec;
    const newSpec = { ...spec };

    if (style) {
      newSpec.style = this._convertMarkStyle(style);
    }
    if (state) {
      newSpec.state = {};
      Object.keys(state).forEach(key => {
        newSpec.state[key] = this._convertMarkStyle(state[key]);
      });
    }
    mark.initStyleWithSpec(newSpec, key);
  }

  protected stateKeyToSignalName(key: string, opt?: string) {
    let name = `${PREFIX}_${this.modelType}_${this.type}_${this.id}_${key}`;
    opt && (name += `_${opt}`);
    return name;
  }

  compileData() {
    this._data?.compile();
  }

  compileMarks(group?: string | IGroupMark) {
    this.getMarks().forEach(m => {
      m.compile({ group });
    });
  }

  protected _createMark<T extends IMark>(markInfo: IModelMarkInfo, option: Partial<IMarkOption> = {}): T {
    const { type, name } = markInfo;
    const m = Factory.createMark(type as any, name, {
      model: this,
      map: this._option.map,
      getCompiler: this.getCompiler,
      globalScale: this._option.globalScale,
      ...option
    }) as T;
    m?.created();
    return m;
  }

  /**
   * 数据唯一ID
   * 根据自身动画数据匹配需求设置返回值。
   * 默认返回 undefined 时，根据 VGrammar 默认数据 ID 进行索引和匹配。
   */
  protected _getDataIdKey(): string | ((datum: Datum) => string) | undefined {
    return undefined;
  }

  getColorScheme() {
    return (this._option.getThemeConfig?.().chartLevelTheme ?? defaultChartLevelTheme).colorScheme;
  }

  protected _getChartLevelTheme() {
    return this._option.getThemeConfig?.().chartLevelTheme ?? defaultChartLevelTheme;
  }
}
