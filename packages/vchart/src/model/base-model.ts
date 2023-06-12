import { createID, isValid, cloneDeepSpec, getActualColor } from '../util';
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
import type { Datum, StateValueType, ConvertToMarkStyleSpec, ICommonSpec, StringOrNumber, IRect } from '../typings';
import type { ITooltipHelper } from './tooltip-helper';
import type { CompilableData } from '../compile/data/compilable-data';
import { ModelStateManager } from './model-state-manager';
import { PREFIX } from '../constant';
import type { IElement, IGroupMark, IMark as IVGrammarMark } from '@visactor/vgrammar';
import { array, isArray, isEqual, isFunction, isNil, isObject, merge } from '@visactor/vutils';
import { Factory } from '../core/factory';
import { isColorKey } from '../theme/color-scheme/util';
import type { SeriesTypeEnum } from '../series/interface';
import { MarkSet } from '../mark/mark-set';

export abstract class BaseModel extends LayoutItem implements IModel {
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

  protected declare _spec: any;
  getSpec(): any {
    return this._spec;
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

  protected _sceneNodeMap: Map<string, IElement>;

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

  /** 状态管理器 */
  state: ModelStateManager;
  getState() {
    return this.state._stateMap;
  }

  protected _theme?: any; // 非全局 theme，是对应于具体 model 的 theme 对象

  /** for layout diff */
  protected _lastLayoutRect: ILayoutRect = null;

  protected _tooltipHelper: ITooltipHelper | undefined;
  get tooltipHelper() {
    return this._tooltipHelper;
  }

  // TODO: 有些hack,这个tag是为了避免布局逻辑中，轴的数据变化，又由数据变化触发重新布局
  protected _isLayout: boolean = true;

  constructor(spec: IModelSpec, option: IModelOption) {
    super(option);
    this.id = createID();
    this._originalSpec = spec;
    this._spec = cloneDeepSpec(spec);
    this.userId = spec.id;
    this._specIndex = option.specIndex ?? 0;
    this.specKey = option.specKey ?? '';
    this.effect = {};
    this.event = new Event(option.eventDispatcher, option.mode);
    option.map?.set(this.id, this);
    this._sceneNodeMap = new Map();
    this.state = new ModelStateManager({
      ...option,
      stateKeyToSignalName: this.stateKeyToSignalName.bind(this)
    });
  }
  coordinate?: CoordinateType;

  protected releaseEvent() {
    this.event.release();
  }

  created() {
    this._initTheme();
    this.setAttrFromSpec();
  }

  updateState(newState: Record<string, unknown>) {
    return this.state.updateState(newState);
  }

  init(option: IModelInitOption) {
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

  release() {
    this.releaseEvent();
    this._originalSpec = {};
    this._spec = {};
    this.getMarks().forEach(m => m.release());
    this.state.release();
    this._data?.release();
    this._data = this._specIndex = this._sceneNodeMap = null;
    this._marks.clear();
    super.release();
  }

  updateSpec(spec: any) {
    this._originalSpec = spec;
    this._spec = cloneDeepSpec(spec);
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
    this._initTheme(theme);
    this.setAttrFromSpec();
  }

  protected _initTheme(theme?: any) {
    this._theme = theme;

    this._mergeMarkTheme();
  }

  /** 将全局的 mark theme 合并进 model theme */
  protected _mergeMarkTheme() {
    const globalTheme = this._option.getTheme?.();
    if (isNil(globalTheme) || isNil(this._theme)) {
      return;
    }

    const { mark: markThemeByType, markByName: markThemeByName } = globalTheme;
    this.getMarkInfoList().forEach(({ type, name }) => {
      this._theme[name] = merge(
        {},
        markThemeByType?.[array(type)[0]] ?? {},
        markThemeByName?.[name] ?? {},
        this._theme[name]
      );
    });
  }

  /** 对 spec 进行遍历和转换 */
  protected _preprocessSpec(obj?: any): any {
    if (!arguments.length) {
      obj = this._spec;
    }

    if (isArray(obj)) {
      return obj.map(element => {
        if (isObject(element) && !isFunction(element)) {
          return this._preprocessSpec(element);
        }
        return element;
      });
    }
    const newObj = { ...obj };
    Object.keys(newObj).forEach(key => {
      // 绕过 DataView 对象
      if (key.includes('data')) {
        return;
      }
      const value = obj[key];
      if (isObject(value) && !isFunction(value)) {
        // 查询、替换语义化颜色
        if (isColorKey(value)) {
          newObj[key] = getActualColor(
            value,
            this._option.getTheme?.()?.colorScheme,
            this.modelType === 'series' ? (this.type as SeriesTypeEnum) : undefined
          );
        } else {
          newObj[key] = this._preprocessSpec(value);
        }
      }
    });

    if (!arguments.length) {
      this._spec = newObj;
    }
    return newObj;
  }

  setCurrentTheme(theme: any, noRender?: boolean) {
    // do nothing
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

  compileSignal() {
    this.state?.compile();
  }

  bindSceneNode(node: IElement) {
    this._sceneNodeMap.set(node.mark.id(), node as IElement);
  }

  getSceneNodes() {
    return Array.from(this._sceneNodeMap.values());
  }

  getSceneNodeMarks() {
    return this.getSceneNodes().map(node => node.mark as IVGrammarMark);
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
}
