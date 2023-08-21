import type { ISeriesFilter } from '../../region/interface';
import type { IAnimate } from '../../animation/interface';
import type { ILayoutItem, IModel, IModelOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ISeries } from '../../series/interface';
import type { StringOrNumber } from '../../typings';
/**
 * 组件作为图表辅助阅读等功能的模块，除了model提供的能力之外，还有以下功能特点
 * 支持对多region的绑定。
 * 能够在resize时正常的重新对内部元素布局。
 * 保持数据独立，模块间的依赖关系，能从数据上处理的应当从数据上处理。
 */

export interface IComponentOption extends IModelOption {
  // 区域
  getAllRegions: () => IRegion[];
  getRegionsInIndex: (index?: number[]) => IRegion[];
  getRegionsInIds: (ids: number[]) => IRegion[];
  getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
  defaultSpec?: any;
  // series
  getAllSeries: () => ISeries[];
  getSeriesInIndex: (index?: number[]) => ISeries[];
  getSeriesInIds: (ids?: number[]) => ISeries[];
  getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
  // component
  getAllComponents: () => IComponent[];
  getComponentByIndex: (key: string, index: number) => IComponent | undefined;
  getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
  getComponentsByKey: (key: string) => IComponent[];
}

export interface IComponent extends IModel, ILayoutItem {
  readonly name: string;
  readonly animate?: IAnimate;

  // 区域
  getRegions: () => IRegion[];
  getBindSeriesFilter?: () => ISeriesFilter;
  changeRegions: (regions: IRegion[]) => void;

  // 清空，用于更新等场景
  clear: () => void;

  afterInit: () => void;
}

export interface IComponentConstructor {
  type: string;
  createComponent: (spec: any, options: IComponentOption) => IComponent | IComponent[] | undefined;
  new (spec: any, options: IComponentOption): IComponent;
}
