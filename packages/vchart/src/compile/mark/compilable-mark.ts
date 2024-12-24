import type {
  IData,
  IElement,
  IGroupMark,
  IMark,
  IMarkConfig,
  MarkAnimationSpec,
  MarkFunctionCallback,
  MarkFunctionType,
  Nil,
  TransformSpec
} from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import type { GrammarMarkType } from '@visactor/vgrammar-core';
import type { DataView } from '@visactor/vdataset';
import { GrammarItem } from '../grammar-item';
import type { Maybe, Datum, StringOrNumber } from '../../typings';
import { isNil, isValid } from '@visactor/vutils';
import { VGRAMMAR_HOOK_EVENT } from '../../constant/event';
import { PREFIX } from '../../constant/base';
import { LayoutZIndex } from '../../constant/layout';
import type { IMarkStateStyle, MarkType } from '../../mark/interface';
import type { IModel } from '../../model/interface';
import type { ISeries } from '../../series/interface';
import { isStateAttrChangeable } from './util';
import { MarkStateManager } from './mark-state-manager';
import type {
  ICompilableMark,
  IMarkDataInitOption,
  ICompilableMarkOption,
  StateValueType,
  IMarkCompileOption,
  IAttributeOpt,
  IMarkData
} from './interface';
// eslint-disable-next-line no-duplicate-imports
import { STATE_VALUE_ENUM } from './interface';
import { MarkData } from './mark-data';
import { GrammarType } from '../interface/compilable-item';
import type { IComponent } from '../../component/interface';
import type { IEvent } from '../../event/interface';
import { Event } from '../../event/event';
// eslint-disable-next-line no-duplicate-imports
import { AnimationStateEnum } from '../../animation/interface';

/** 可编译的 mark 对象，这个基类只存放编译相关的逻辑 */
export abstract class CompilableMark extends GrammarItem implements ICompilableMark {
  readonly grammarType = GrammarType.mark;
  /** 类型 */
  readonly type: MarkType = undefined as unknown as MarkType;

  /** name */
  readonly name: string = 'mark';

  /** key field */
  readonly key: ICompilableMark['key'];

  protected _markConfig: IMarkConfig = {
    zIndex: LayoutZIndex.Mark,
    /** morph动画关联关系配置 */
    morph: false
  };

  getMarkConfig(): IMarkConfig {
    return this._markConfig;
  }
  setMarkConfig(config: IMarkConfig) {
    Object.keys(config).forEach(key => {
      (this._markConfig as any)[key] = (config as any)[key];
    });
  }

  /** 可见性 */
  protected _visible: boolean = true;
  getVisible() {
    return this._visible;
  }
  setVisible(visible: boolean) {
    this._visible = visible;
  }

  /**
   * 用户设置的 id
   */
  protected _userId: StringOrNumber;
  getUserId() {
    return this._userId;
  }
  setUserId(userId: StringOrNumber) {
    if (isValid(userId)) {
      this._userId = userId;
    }
  }

  /** parent model */
  readonly model: IModel;

  /** 数据（可以没有） */
  protected _data: IMarkData;
  getDataView(): DataView | undefined {
    return this._data?.getDataView();
  }
  setDataView(d?: DataView, productId?: string) {
    if (isNil(this._data)) {
      this.initMarkData({
        ...this._option,
        mark: this
      });
    }
    if (isValid(productId)) {
      this._data.setCompiledProductId(productId);
    }
    this._data.setDataView(d);
  }
  getData() {
    return this._data;
  }
  setData(d?: IMarkData) {
    this._data = d;
  }

  /** 默认的stateStyle */
  stateStyle: IMarkStateStyle<any> = {};

  /** 状态管理器 */
  state: MarkStateManager;

  protected _unCompileChannel: { [key in string]: boolean } = {};

  hasState(state: string) {
    return state in this.state.getStateMap();
  }
  getState(state: string) {
    return this.state.getStateMap()[state];
  }

  protected _event: IEvent;

  protected _animationConfig: Partial<MarkAnimationSpec>;
  getAnimationConfig() {
    return this._animationConfig;
  }
  setAnimationConfig(config: Partial<MarkAnimationSpec>) {
    this._animationConfig = config;
  }

  /** 布局标记 */
  private _skipBeforeLayouted = false;

  setSkipBeforeLayouted(skip: boolean) {
    this._skipBeforeLayouted = skip;
  }
  getSkipBeforeLayouted(): boolean {
    return this._skipBeforeLayouted;
  }

  protected _groupKey?: string;
  getGroupKey() {
    return this._groupKey;
  }
  setGroupKey(groupKey: string) {
    this._groupKey = groupKey;
  }

  protected _stateSort?: (stateA: string, stateB: string) => number;
  setStateSortCallback(stateSort: (stateA: string, stateB: string) => number) {
    this._stateSort = stateSort;
  }

  protected declare _option: ICompilableMarkOption;

  constructor(option: ICompilableMarkOption, name: string, model: IModel) {
    super(option);
    this.name = name;
    this.model = model;
    this.key = option.key;
    this.state = new MarkStateManager(
      {
        ...option,
        stateKeyToSignalName: this.stateKeyToSignalName.bind(this)
      },
      this
    );
    this._event = new Event(model.getOption().eventDispatcher, model.getOption().mode);
  }

  protected declare _product: Maybe<IMark>;
  declare getProduct: () => Maybe<IMark>;

  // transform目前在形状词云中使用，但直接用的 vgrammar 接口 (this._wordMark as ICompilableMark).getProduct().transform(wordCloudTransforms);
  // 暂时没有用到这里的setTransform()
  protected _transform: TransformSpec[] | Nil;
  setTransform(transform: TransformSpec[] | Nil) {
    this._transform = transform;
  }

  /** 初始化 mark data */
  protected initMarkData(option: IMarkDataInitOption) {
    this._data = new MarkData(option);
  }

  protected stateKeyToSignalName(key: string) {
    return `${PREFIX}_${this.type}_${this.id}_${key}`;
  }

  getAttribute(key: any, datum: any, state: StateValueType, opt?: IAttributeOpt) {
    // do nothing
  }

  protected _compileProduct(option?: IMarkCompileOption) {
    const product = this.getProduct();
    // 处理 visible 为 false 的情况
    if (!this.getVisible()) {
      if (isValid(product)) {
        this.removeProduct();
      }
      return;
    } else if (isValid(product)) {
      return; // 每个mark只执行一次编译
    }

    const compiler = this.getCompiler();
    if (!compiler.isInited) {
      return;
    }
    this._initProduct(option?.group);
    if (isNil(this._product)) {
      return;
    }

    this.compileSignal();
    this.compileData();
    this.compileState();
    this.compileEncode();
    this.compileAnimation();
    this.compileContext(option?.context);
    this.compileTransform();
  }

  /** 创建语法元素对象 */
  protected _initProduct(group?: string | IGroupMark) {
    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();
    this._product = view.mark(this.type as GrammarMarkType, group ?? view.rootMark).id(id);
    if (this.name && this._product) {
      this._product.name(this.name);
    }
    this._compiledProductId = id;
  }

  generateProductId() {
    if (this._userId) {
      return `${this._userId}`;
    }
    return `${this.name}_${this.id}`;
  }

  compileData() {
    if (isNil(this._data)) {
      return;
    }
    this._data.compile();

    // 绑定数据
    const dataProduct = this._data.getProduct();
    if (isValid(this._product) && isValid(dataProduct)) {
      this._product.join(dataProduct as IData, this.key, undefined, this.getGroupKey());
    }
  }

  updateStaticEncode() {
    if (!this._product) {
      return;
    }
    const { enterStyles, updateStyles } = this._separateStyle();

    this._product.encodeState('group', enterStyles, true);

    this._product.encode(updateStyles, true);
  }

  protected _separateStyle() {
    const { [STATE_VALUE_ENUM.STATE_NORMAL]: normalStyle, ...temp } = this.stateStyle;

    const enterStyles: Record<string, MarkFunctionType<any>> = this._option.noSeparateStyle ? null : {};
    const updateStyles: Record<string, MarkFunctionType<any>> = {};
    Object.keys(normalStyle).forEach(key => {
      if (this._unCompileChannel[key]) {
        return;
      }

      if (this._option.noSeparateStyle || isStateAttrChangeable(key, normalStyle, this.getGroupKey())) {
        updateStyles[key] = {
          callback: this.compileCommonAttributeCallback(key, 'normal'),
          dependency: [this.stateKeyToSignalName('markUpdateRank')]
        };
      } else {
        enterStyles[key] = this.compileCommonAttributeCallback(key, 'normal');
      }
    });
    return { enterStyles, updateStyles };
  }

  compileEncode() {
    const { [STATE_VALUE_ENUM.STATE_NORMAL]: normalStyle, ...temp } = this.stateStyle;
    const { enterStyles, updateStyles } = this._separateStyle();
    this._product.encode(updateStyles, true);
    this._product.encodeState('group', enterStyles, true);

    Object.keys(temp).forEach(state => {
      const styles: Record<string, MarkFunctionType<any>> = {};
      Object.keys(temp[state]).forEach(key => {
        if (this._unCompileChannel[key]) {
          return;
        }
        styles[key] = {
          callback: this.compileCommonAttributeCallback(key, state),
          dependency: [this.stateKeyToSignalName('markUpdateRank')]
        };
      });
      this._product.encodeState(state, styles, true);
    });

    // 在布局完成前不进行encode
    if (this._skipBeforeLayouted) {
      this._product.layout({
        skipBeforeLayouted: this._skipBeforeLayouted
      });
    }
  }

  compileState() {
    this.state.compileState(this._product, this._stateSort);
  }

  compileAnimation() {
    if (this._animationConfig) {
      let stateSignal: any;
      if (this.type === 'component') {
        // 组件有自己的动画状态
        stateSignal = (this.model as IComponent).animate?.getAnimationStateSignalName();
      } else {
        const region = (this.model as ISeries).getRegion?.();
        stateSignal = region?.animate?.getAnimationStateSignalName();
      }
      this._product.animation(this._animationConfig);
      this._product.animationState({
        callback: (datum: Datum, element: IElement, parameters: Record<string, any>) => {
          return parameters[stateSignal]?.callback(datum, element);
        },
        dependency: stateSignal
      });
      if (this._animationConfig.normal) {
        if (!this._animationConfig.appear) {
          this._event.on(VGRAMMAR_HOOK_EVENT.AFTER_DO_RENDER, () => {
            this.runAnimationByState(AnimationStateEnum.normal);
          });
        } else {
          this._event.on(VGRAMMAR_HOOK_EVENT.ANIMATION_END, ({ event }) => {
            if (event.mark === this.getProduct() && event.animationState === AnimationStateEnum.appear) {
              this.runAnimationByState(AnimationStateEnum.normal);
            }
          });
        }
      }
    }
  }

  compileContext(extraContext?: any) {
    const config: IMarkConfig = {
      ...this._markConfig,
      context: {
        markId: this.id,
        modelId: this.model.id,
        markUserId: this._userId,
        modelUserId: this.model.userId,
        ...extraContext
      }
    };
    this._product.configure(config);
  }

  compileSignal() {
    this.state.compile();
  }

  protected _computeAttribute(key: string, state: StateValueType) {
    return (datum: Datum, opt: IAttributeOpt) => {
      return undefined as any;
    };
  }

  // TODO: 1. opt内容待定，确实需要再来补充（之前是scale.bindScales/bindSignals，从context.params中可以获取到）
  // TODO: 2. stateSourceItem，是否根据attr区分，存在默认写死的情况，例如"hover"/"normal"；
  protected compileCommonAttributeCallback(key: string, state: string): MarkFunctionCallback<any> {
    const attributeFunctor = this._computeAttribute(key, state);
    // remove state in opt
    const opt: IAttributeOpt = { mark: null, parent: null, element: null };
    return (datum: Datum, element: IElement) => {
      opt.mark = element.mark;
      opt.parent = element.mark.group;
      opt.element = element;
      return attributeFunctor(datum, opt);
    };
  }

  protected compileTransform() {
    if (this._transform?.length) {
      this.getProduct().transform(this._transform);
    }
  }

  protected _lookupGrammar(id: string) {
    return this.getCompiler().getVGrammarView()?.getMarkById(id);
  }

  updateState(newState: Record<string, unknown>, noRender?: boolean) {
    return this.state.updateState(newState, noRender);
  }

  updateLayoutState(noRender?: boolean, recursion?: boolean): void {
    if (recursion && this.getMarks().length > 0) {
      this.getMarks().forEach(m => m.state.updateLayoutState(true));
    }
    return this.state.updateLayoutState(noRender);
  }

  updateMarkState(key: string): void {
    if (!this._product) {
      return;
    }
    const stateInfo = this.state.getStateInfo(key);
    this._product.elements.forEach(e => {
      if (this.state.checkOneState(e, e.getDatum(), stateInfo) === 'in') {
        e.addState(key);
      } else {
        e.removeState(key);
      }
    });
  }

  getMarks(): ICompilableMark[] {
    return [];
  }

  runAnimationByState(state?: string) {
    return this.getProduct()?.animate?.runAnimationByState(state);
  }

  stopAnimationByState(state?: string) {
    return this.getProduct()?.animate?.stopAnimationByState(state);
  }

  pauseAnimationByState(state?: string) {
    return this.getProduct()?.animate?.pauseAnimationByState(state);
  }

  resumeAnimationByState(state?: string) {
    return this.getProduct()?.animate?.resumeAnimationByState(state);
  }

  getProductElements() {
    const product = this.getProduct();
    if (product) {
      return product.elements;
    }
    return undefined;
  }

  release() {
    super.release();
    this.state.release();
  }
}
