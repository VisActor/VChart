import type { ISeriesFilter } from '../../region/interface';
import type { IAnimate } from '../../animation/interface';
import type { ILayoutItem, IModel, IModelOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ISeries } from '../../series/interface';
import type { StringOrNumber } from '../../typings';
import type { IGraphic } from '@visactor/vrender-core';
export interface IComponentOption extends IModelOption {
    getAllRegions: () => IRegion[];
    getRegionsInIndex: (index?: number[]) => IRegion[];
    getRegionsInIds: (ids: number[]) => IRegion[];
    getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
    defaultSpec?: any;
    getAllSeries: () => ISeries[];
    getSeriesInIndex: (index?: number[]) => ISeries[];
    getSeriesInIds: (ids?: number[]) => ISeries[];
    getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
    getAllComponents: () => IComponent[];
    getComponentByIndex: (key: string, index: number) => IComponent | undefined;
    getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
    getComponentsByKey: (key: string) => IComponent[];
}
export interface IComponent extends IModel, ILayoutItem {
    readonly name: string;
    readonly animate?: IAnimate;
    getRegions: () => IRegion[];
    getBindSeriesFilter?: () => ISeriesFilter;
    changeRegions: (regions: IRegion[]) => void;
    getVRenderComponents: () => IGraphic[];
    clear: () => void;
}
export interface IComponentConstructor {
    type: string;
    createComponent: (spec: any, options: IComponentOption) => IComponent | IComponent[] | undefined;
    new (spec: any, options: IComponentOption): IComponent;
}
