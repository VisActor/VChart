import type { MarkAnimationSpec } from '@visactor/vgrammar-core';
import type { DataView } from '@visactor/vdataset';
import { GrammarItem } from '../grammar-item';
import type { Maybe, StringOrNumber } from '../../typings';
import { isNil, isValid } from '@visactor/vutils';
import { PREFIX } from '../../constant/base';
import { LayoutZIndex } from '../../constant/layout';
import type { IMarkStateStyle, MarkType } from '../../mark/interface';
import type { IModel } from '../../model/interface';
import { MarkStateManager } from './mark-state-manager';
import type {
  ICompilableMark,
  ICompilableMarkOption,
  StateValueType,
  IMarkCompileOption,
  IAttributeOpt,
  IMarkConfig
} from './interface';
import type { ICompilableInitOption } from '../interface/compilable-item';
import { GrammarType } from '../interface/compilable-item';
import type { IEvent } from '../../event/interface';
import { Event } from '../../event/event';
// eslint-disable-next-line no-duplicate-imports
import type { IGroup } from '@visactor/vrender-core';
import { createGroup } from '@visactor/vrender-core';
import { CompilableData, type ICompilableData } from '../data';

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

  protected _isCommited?: boolean;

  commit(render?: boolean, recursion?: boolean) {
    if (recursion && this.getMarks().length > 0) {
      this.getMarks().forEach(m => m.commit(false, recursion));
    }

    this._isCommited = true;
    if (render) {
      this.getCompiler().renderNextTick();
    }
  }

  uncommit() {
    this._isCommited = false;
  }

  isCommited() {
    return this._isCommited;
  }

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
  protected _data: ICompilableData;
  getDataView(): DataView | undefined {
    return this._data?.getDataView();
  }
  setDataView(d?: DataView) {
    if (isNil(this._data)) {
      this.initMarkData(this._option);
    }
    this._data.setDataView(d);
  }
  getData() {
    return this._data;
  }
  setData(d?: ICompilableData) {
    this._data = d;
    if (d) {
      d.addRelatedMark(this);
    }
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
    this.state = new MarkStateManager(option, this);
    this._event = new Event(model.getOption().eventDispatcher, model.getOption().mode);
  }

  protected declare _product: Maybe<IGroup>;
  declare getProduct: () => Maybe<IGroup>;

  /** 初始化 mark data */
  protected initMarkData(option: ICompilableInitOption) {
    this._data = new CompilableData(option);

    this._data.addRelatedMark(this);
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
    this.commit();
    this.compileData();
    this.compileState();
    this.compileEncode();
    // todo this.compileAnimation();
    this.compileContext(option?.context);
    // this.compileTransform();
  }

  /** 创建语法元素对象 */
  protected _initProduct(group?: IGroup) {
    const stage = this.getStage();

    if (!stage) {
      return;
    }

    // 声明语法元素
    const id = this.getProductId();

    this._product = createGroup({});

    this._product.id = id;

    // todo
    (group ?? this.getCompiler()?.getRootGroup()).appendChild(this._product);

    if (this.name && this._product) {
      this._product.name = this.name;
    }
    this._compiledProductId = id;
  }

  generateProductId() {
    if (this._userId) {
      return `${this._userId}`;
    }
    return `${this.name}_${this.id}`;
  }

  layout(layout: () => void) {
    // todo
  }

  compileData() {
    if (isNil(this._data)) {
      return;
    }
    this._data.compile();

    // 绑定数据
    // const dataProduct = this._data.getProduct();
    // if (isValid(this._product) && isValid(dataProduct)) {
    //   // this._product.join(dataProduct as IData, this.key, undefined, this.getGroupKey());
    // }
  }

  // protected _separateStyle() {
  //   const { [STATE_VALUE_ENUM.STATE_NORMAL]: normalStyle } = this.stateStyle;

  //   const enterStyles: Record<string, MarkFunctionType<any>> = this._option.noSeparateStyle ? null : {};
  //   const updateStyles: Record<string, MarkFunctionType<any>> = {};
  //   Object.keys(normalStyle).forEach(key => {
  //     if (this._unCompileChannel[key]) {
  //       return;
  //     }

  //     if (this._option.noSeparateStyle || isStateAttrChangeable(key, normalStyle, this.getGroupKey())) {
  //       updateStyles[key] = {
  //         callback: this._computeAttribute(key, 'normal'),
  //         dependency: [this.stateKeyToSignalName('markUpdateRank')]
  //       };
  //     } else {
  //       enterStyles[key] = this._computeAttribute(key, 'normal');
  //     }
  //   });
  //   return { enterStyles, updateStyles };
  // }

  compileEncode() {
    // const { [STATE_VALUE_ENUM.STATE_NORMAL]: normalStyle, ...temp } = this.stateStyle;
    // const { enterStyles, updateStyles } = this._separateStyle();
    // const encoders: any = {
    //   update: updateStyles,
    //   group: enterStyles
    // };
    // Object.keys(temp).forEach(state => {
    //   const styles: Record<string, MarkFunctionType<any>> = {};
    //   Object.keys(temp[state]).forEach(key => {
    //     if (this._unCompileChannel[key]) {
    //       return;
    //     }
    //     styles[key] = {
    //       callback: this._computeAttribute(key, state),
    //       dependency: [this.stateKeyToSignalName('markUpdateRank')]
    //     };
    //   });
    //   encoders[state] = styles;
    // });
    // // 在布局完成前不进行encode
    // if (this._skipBeforeLayouted) {
    // }
  }

  compileState() {
    // this.state.compileState(this, this._stateSort);
  }

  compileAnimation() {
    // if (this._animationConfig) {
    //   let stateSignal: any;
    //   if (this.type === 'component') {
    //     // 组件有自己的动画状态
    //     stateSignal = (this.model as IComponent).animate?.getAnimationStateSignalName();
    //   } else {
    //     const region = (this.model as ISeries).getRegion?.();
    //     stateSignal = region?.animate?.getAnimationStateSignalName();
    //   }
    //   this._product.animation(this._animationConfig);
    //   this._product.animationState({
    //     callback: (datum: Datum, element: IElement, parameters: Record<string, any>) => {
    //       return parameters[stateSignal]?.callback(datum, element);
    //     },
    //     dependency: stateSignal
    //   });
    //   if (this._animationConfig.normal) {
    //     if (!this._animationConfig.appear) {
    //       this._event.on(VGRAMMAR_HOOK_EVENT.AFTER_DO_RENDER, () => {
    //         this.runAnimationByState(AnimationStateEnum.normal);
    //       });
    //     } else {
    //       this._event.on(VGRAMMAR_HOOK_EVENT.ANIMATION_END, ({ event }) => {
    //         if (event.mark === this.getProduct() && event.animationState === AnimationStateEnum.appear) {
    //           this.runAnimationByState(AnimationStateEnum.normal);
    //         }
    //       });
    //     }
    //   }
    // }
  }

  _context: any;

  compileContext(extraContext?: any) {
    // const config: IMarkConfig = {
    //   ...this._markConfig,
    //   context: {
    //   }
    // };

    this._context = {
      markId: this.id,
      modelId: this.model.id,
      markUserId: this._userId,
      modelUserId: this.model.userId,
      ...extraContext
    };
  }

  getContext() {
    return this._context;
  }

  protected compileTransform() {
    // if (this._transform?.length) {
    //   this.getProduct().transform(this._transform);
    // }
  }

  updateState(newState: Record<string, unknown>, noRender?: boolean) {
    this.commit();

    return this.state.updateState(newState, noRender);
  }

  getMarks(): ICompilableMark[] {
    return [];
  }

  runAnimationByState(state?: string) {
    // return this.getProduct()?.animate?.runAnimationByState(state);
  }

  stopAnimationByState(state?: string) {
    // return this.getProduct()?.animate?.stopAnimationByState(state);
  }

  pauseAnimationByState(state?: string) {
    // return this.getProduct()?.animate?.pauseAnimationByState(state);
  }

  resumeAnimationByState(state?: string) {
    // return this.getProduct()?.animate?.resumeAnimationByState(state);
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
