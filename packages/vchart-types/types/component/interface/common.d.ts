import type { ISeriesFilter } from '../../region/interface';
import type { IAnimate } from '../../animation/interface';
import type { ILayoutModel, IModelConstructor, IModelOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ISeries } from '../../series/interface';
import type { Maybe, StringOrNumber } from '../../typings';
import type { IGraphic } from '@visactor/vrender-core';
import type { IChartSpecInfo } from '../../chart/interface';
export interface IComponentOption extends IModelOption {
    getAllRegions: () => IRegion[];
    getRegionsInIndex: (index?: number[]) => IRegion[];
    getRegionsInIds: (ids: number[]) => IRegion[];
    getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
    getAllSeries: () => ISeries[];
    getSeriesInIndex: (index?: number[]) => ISeries[];
    getSeriesInIds: (ids?: number[]) => ISeries[];
    getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
    getAllComponents: () => IComponent[];
    getComponentByIndex: (key: string, index: number) => IComponent | undefined;
    getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
    getComponentsByKey: (key: string) => IComponent[];
    getComponentsByType: (type: string) => IComponent[];
}
export interface IComponent extends ILayoutModel {
    readonly name: string;
    readonly animate?: IAnimate;
    getRegions: () => IRegion[];
    getBindSeriesFilter?: () => ISeriesFilter;
    changeRegions: (regions: IRegion[]) => void;
    getVRenderComponents: () => IGraphic[];
    clear: () => void;
}
export interface IComponentConstructor extends IModelConstructor {
    type: string;
    specKey?: string;
    getSpecInfo: (chartSpec: any, chartSpecInfo?: IChartSpecInfo) => Maybe<IModelSpecInfo[]>;
    createComponent: (specInfo: IModelSpecInfo, options: IComponentOption) => IComponent;
    new (spec: any, options: IComponentOption): IComponent;
}
