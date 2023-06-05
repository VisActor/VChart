import type { DataView } from '@visactor/vdataset';
import type { IGlobalScale } from '../../scale/interface';
import type { ICommonSpec, VisualType, ValueType, FunctionType } from '../../typings/visual';
import type { IModel } from '../../model/interface';
import type { IBaseScale } from '@visactor/vgrammar-scale';
import type { MarkType } from './type';
import type {
  ICompilableMark,
  ICompilableMarkOption,
  IModelMarkAttributeContext,
  StateValueType
} from '../../compile/mark';
import type { StringOrNumber } from '../../typings';

export interface VisualScaleType {
  scale: IBaseScale;
  field: StringOrNumber;
  changeDomain?: 'none' | 'replace' | 'expand'; //default 'none'
}

export type MarkInputStyle<T> = StyleConvert<T> | VisualType<T>;

/** 用户将属性类型转化为 mark-style 中某个属性的 style */
export type StyleConvert<T> = ValueType<T> | FunctionType<T> | VisualScaleType;

/** mark-style 中某个属性的样式信息，包含层级等信息 */
export interface IAttrConfig<A, R extends ICommonSpec> {
  level: number;
  style: StyleConvert<A>;
  referer?: IMarkRaw<R>;
}
/** mark-style 中某状态下的一组样式信息 */
export type IAttrs<T extends ICommonSpec> = {
  [K in keyof T]: IAttrConfig<T[K], T>;
};

export type IMarkProgressiveConfig = {
  /** 是否开启大数据渲染模式，开启后会降低渲染的精度 */
  large?: boolean;
  /** 开启大数据渲染优化的阀值，对应的是data的长度;推荐 largeThreshold < progressiveThreshold  */
  largeThreshold?: number;
  /** 分片长度 */
  progressiveStep?: number;
  /** 开启分片渲染的阀值，对应的是单系列data的长度 */
  progressiveThreshold?: number;
};

/** mark-state-style */
export type IMarkStateStyle<T extends ICommonSpec> = Record<StateValueType, Partial<IAttrs<T>>>;

/** mark-style 一组style */
export type IMarkStyle<T extends ICommonSpec> = {
  [key in keyof T]: MarkInputStyle<T[key]>;
};
/**********   mark  ***************/
export interface IMarkRaw<T extends ICommonSpec> extends ICompilableMark {
  readonly stateStyle: IMarkStateStyle<T>;

  getAttribute: <U extends keyof T>(key: U, datum: any, state?: StateValueType, opt?: any) => unknown;
  setAttribute: <U extends keyof T>(attr: U, style: StyleConvert<T[U]>, state?: StateValueType, level?: number) => void;

  // 需要支持优先级并且可以使用优先级覆盖
  /** @deprecated VChart 层尽量使用 IModel.setMarkStyle() */
  setStyle: (style: Partial<IMarkStyle<T>>, state?: StateValueType, level?: number) => void;

  setReferer: (mark: IMarkRaw<T>, styleKey?: string, state?: StateValueType, stateStyle?: IMarkStateStyle<T>) => void;

  /** @deprecated VChart 层尽量使用 IModel.initMarkStyleWithSpec() */
  initStyleWithSpec: (spec: any, key?: string) => void;

  created: () => void;
}

export type IMark = IMarkRaw<ICommonSpec>;

export interface IMarkOption extends ICompilableMarkOption {
  model: IModel;
  map: Map<StringOrNumber, IModel | IMark>;

  globalScale: IGlobalScale;
  dataStatistics?: DataView;

  /** 组件 mark 的具体类型 */
  componentType?: string;
  attributeContext?: IModelMarkAttributeContext;
}
export interface IMarkConstructor {
  type: MarkType;
  constructorType?: MarkType;
  new (name: string, options: IMarkOption): IMark;
}

export interface IComponentMarkConstructor {
  type: MarkType;
  constructorType?: MarkType;
  new (componentType: string, name: string, options: IMarkOption): IMark;
}

export type MarkConstructor = IMarkConstructor | IComponentMarkConstructor;

export interface IMarkDataInitOption extends IMarkOption {
  mark: IMark;
}
