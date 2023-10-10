import type { DataView } from '@visactor/vdataset';
import type { IGlobalScale } from '../../scale/interface';
import type { ICommonSpec, VisualType, ValueType, FunctionType } from '../../typings/visual';
import type { IModel } from '../../model/interface';
import type { IBaseScale } from '@visactor/vscale';
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
  changeDomain?: 'none' | 'replace' | 'expand';
}
export type MarkInputStyle<T> = StyleConvert<T> | VisualType<T>;
export type StyleConvert<T> = ValueType<T> | FunctionType<T> | VisualScaleType;
export interface IAttrConfig<A, R extends ICommonSpec> {
  level: number;
  style: StyleConvert<A>;
  referer?: IMarkRaw<R>;
  postProcess?: (result: A, ...args: Parameters<FunctionType<A>>) => A;
}
export type IAttrs<T extends ICommonSpec> = {
  [K in keyof T]: IAttrConfig<T[K], T>;
};
export type IMarkProgressiveConfig = {
  large?: boolean;
  largeThreshold?: number;
  progressiveStep?: number;
  progressiveThreshold?: number;
};
export type IMarkStateStyle<T extends ICommonSpec> = Record<StateValueType, Partial<IAttrs<T>>>;
export type IMarkStyle<T extends ICommonSpec> = {
  [key in keyof T]: MarkInputStyle<T[key]>;
};
export interface IMarkRaw<T extends ICommonSpec> extends ICompilableMark {
  readonly stateStyle: IMarkStateStyle<T>;
  getAttribute: <U extends keyof T>(key: U, datum: any, state?: StateValueType, opt?: any) => unknown;
  setAttribute: <U extends keyof T>(attr: U, style: StyleConvert<T[U]>, state?: StateValueType, level?: number) => void;
  setStyle: (style: Partial<IMarkStyle<T>>, state?: StateValueType, level?: number) => void;
  setReferer: (mark: IMarkRaw<T>, styleKey?: string, state?: StateValueType, stateStyle?: IMarkStateStyle<T>) => void;
  initStyleWithSpec: (spec: any, key?: string) => void;
  created: () => void;
  setPostProcess: <U extends keyof T, A>(
    key: U,
    postProcessFunc: IAttrConfig<A, T>['postProcess'],
    state?: StateValueType
  ) => void;
}
export type IMark = IMarkRaw<ICommonSpec>;
export interface IMarkOption extends ICompilableMarkOption {
  model: IModel;
  map: Map<StringOrNumber, IModel | IMark>;
  globalScale: IGlobalScale;
  dataStatistics?: DataView;
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
