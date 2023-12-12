import { cloneDeepSpec } from '../util/spec/clone-deep';
import { createID } from '../util/id';
import { mergeSpec } from '../util/spec/merge-spec';
import { Event } from '../event/event';
import type { IEvent } from '../event/interface';
import type {
  IEffect,
  IModel,
  IModelInitOption,
  IModelOption,
  IModelRenderOption,
  IModelEvaluateOption,
  IModelSpec,
  IModelMarkInfo,
  IBaseModelSpecTransformerOption,
  IBaseModelSpecTransformer
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
  ILayoutRect
} from '../typings';
import type { CompilableData } from '../compile/data/compilable-data';
import type { IGroupMark } from '@visactor/vgrammar-core';
import { isArray, isValid } from '@visactor/vutils';
import { Factory } from '../core/factory';
import { MarkSet } from '../mark/mark-set';
import type { ILayoutItem } from '../layout/interface';
import { CompilableBase } from '../compile/compilable-base';
import { PREFIX } from '../constant/base';

export abstract class BaseModel<T extends IModelSpec> extends CompilableBase implements IModel {
  readonly transformerConstructor = BaseModelSpecTransformer;

  protected _spec: T;
  getSpec(): T {
    return this._spec || ({} as T);
  }

  /** 获取当前 model 对应在图表 spec 上的路径 */
  getSpecPath() {
    return this._option.specPath;
  }

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

  // 布局
  protected _layout?: ILayoutItem = null;
  get layout() {
    return this._layout;
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

  protected _transformer: BaseModelSpecTransformer<T>;

  constructor(spec: T, option: IModelOption) {
    super(option);
    this.id = createID();
    this._originalSpec = spec;
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
    this._initTransformer();
    this.setAttrFromSpec();
  }

  protected _initTransformer() {
    this._transformer = new this.transformerConstructor({
      type: this.type,
      getTheme: this._option.getTheme
    });
    this._transformSpec();
  }

  protected _transformSpec() {
    this._spec = this._transformer.transformSpec(this._originalSpec, this._option.getChart().getSpec());
  }

  init(option: IModelInitOption) {
    // do nothing
  }

  afterInit() {
    // do nothing
  }

  getVisible() {
    return (this._spec as unknown as any)?.visible !== false;
  }

  onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void {
    // do nothing
    this._layout?.onLayoutStart(layoutRect, viewRect, ctx);
  }
  onLayoutEnd(ctx: any): void {
    this._layout?.onLayoutEnd(ctx);
    this.getMarks().forEach(m => m.updateLayoutState(true, true));
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

  reInit() {
    // before reInit reset this._spec to original
    this._spec = cloneDeepSpec(this._originalSpec);
    this._transformSpec();
    this.setAttrFromSpec();
  }

  protected _initTheme(theme?: any) {
    // if (this.getVisible() === false) {
    //   // 不展示不需要处理主题
    //   return;
    // }
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
      // this._originalSpec + this._theme = this._spec
      const merge = (originalSpec: any) => mergeSpec({}, this._theme, originalSpec);

      const baseSpec = this._originalSpec;
      if (isArray(baseSpec)) {
        this._spec = baseSpec.map(spec => merge(spec)) as unknown as T;
      } else {
        this._spec = merge(baseSpec);
      }
    }
  }

  /** 是否在初始化时将 theme 自动 merge 到 spec */
  protected _shouldMergeThemeToSpec(): boolean {
    return true;
  }

  setCurrentTheme() {
    // 重新初始化
    this.reInit();
  }

  updateLayoutAttribute() {
    // do nothing
  }

  setAttrFromSpec() {
    this._layout?.setAttrFromSpec(this._spec, this._option.getChartViewRect());
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
    return this._option.getTheme?.().colorScheme;
  }
}

export class BaseModelSpecTransformer<T extends IModelSpec> implements IBaseModelSpecTransformer {
  readonly type: string;
  protected _option: IBaseModelSpecTransformerOption;

  protected _theme?: any; // 非全局 theme，是对应于具体 model 的 theme 对象

  constructor(option: IBaseModelSpecTransformerOption) {
    this._option = option;
    this.type = option.type;
  }

  protected _initTheme(spec: T, chartSpec: any): T {
    this._theme = this.getTheme(spec, chartSpec);
    return this._mergeThemeToSpec(spec, chartSpec);
  }

  getTheme(spec: T, chartSpec: any): any {
    return undefined;
  }

  transformSpec(spec: T, chartSpec: any): T {
    this._transformSpec(spec, chartSpec);
    return this._initTheme(spec, chartSpec);
  }

  protected _transformSpec(spec: T, chartSpec: any) {
    // do nothing
    // change spec by default logic
  }

  /** 将 theme merge 到 spec 中 */
  protected _mergeThemeToSpec(spec: T, chartSpec: any): T {
    if (this._shouldMergeThemeToSpec()) {
      const specFromChart = this._getDefaultSpecFromChart(chartSpec);

      // this._originalSpec + specFromChart + this._theme = this._spec
      const merge = (originalSpec: any) =>
        mergeSpec(
          {},
          this._theme,
          this._prepareSpecBeforeMergingTheme(specFromChart),
          this._prepareSpecBeforeMergingTheme(originalSpec)
        );

      if (isArray(spec)) {
        return spec.map(specItem => merge(specItem)) as unknown as T;
      }
      return merge(spec);
    }
    return spec;
  }

  /** 是否在初始化时将 theme 自动 merge 到 spec */
  protected _shouldMergeThemeToSpec(): boolean {
    return true;
  }

  /** 从 chart spec 提取配置作为 model 的默认 spec 配置 */
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    return {};
  }

  /** 在 merge 主题前对 spec 进行预处理 */
  protected _prepareSpecBeforeMergingTheme(spec?: Partial<T>): Partial<T> {
    // do nothing
    return spec;
  }
}
