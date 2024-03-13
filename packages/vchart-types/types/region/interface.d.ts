import type { IMark } from '../mark/interface';
import type { ILayoutModel, IModelConstructor, IModelOption, IModelSpecInfo } from '../model/interface';
import type { ISeries, SeriesType } from '../series/interface';
import type { CoordinateType } from '../typings/coordinate';
import type { IInteraction } from '../interaction/interface';
import type { IProjectionSpec } from '../component/geo/interface';
import type { ConvertToMarkStyleSpec, IRectMarkSpec } from '../typings/visual';
import type { IAnimate } from '../animation/interface';
import type { IGroupMark } from '../mark/group';
import type { StringOrNumber } from '../typings';
import type { ILayoutItemSpec } from '../layout/interface';
export interface IRegion extends ILayoutModel {
    animate?: IAnimate;
    interaction: IInteraction;
    getStackInverse: () => boolean;
    getMaxWidth: () => number | undefined;
    setMaxWidth: (value: number) => void;
    getMaxHeight: () => number | undefined;
    setMaxHeight: (value: number) => void;
    addSeries: (series: ISeries) => void;
    removeSeries: (series: ISeries) => void;
    getSeries: (opt?: ISeriesFilter) => ISeries[];
    getSeriesInName: (name: string) => ISeries;
    getSeriesInUserId: (userId: string) => ISeries;
    getSeriesInId: (id: number) => ISeries;
    getSeriesInType: (type: SeriesType) => ISeries[];
    getSeriesInCoordinateType: (type: CoordinateType) => ISeries[];
    getSeriesInDataName: (dataName: string) => ISeries[];
    getMarks: () => IMark[];
    getGroupMark: () => IGroupMark;
    getInteractionMark: () => IGroupMark;
    getSpecInfo: () => IRegionSpecInfo;
}
export type ISeriesFilter = {
    name?: string;
    userId?: StringOrNumber | StringOrNumber[];
    specIndex?: number | number[];
    id?: number;
    type?: string;
    coordinateType?: CoordinateType;
    dataName?: string;
};
export interface IRegionConstructor extends IModelConstructor {
    new (spec: IRegionSpec, ctx: IModelOption): IRegion;
}
export interface IRegionSpec extends ILayoutItemSpec {
    id?: StringOrNumber;
    coordinate?: CoordinateType;
    style?: ConvertToMarkStyleSpec<IRectMarkSpec>;
    stackInverse?: boolean;
}
export interface IGeoRegionSpec extends IRegionSpec {
    coordinate?: 'geo';
    roam?: boolean;
    longitudeField?: string;
    latitudeField?: string;
    projection?: Partial<Omit<IProjectionSpec, 'name'>>;
    zoomLimit?: {
        min?: number;
        max?: number;
    };
}
export type RegionSpec = IRegionSpec | IGeoRegionSpec;
export interface IRegionSpecInfo<T extends RegionSpec = IRegionSpec> extends IModelSpecInfo {
    type: 'region';
    spec: T;
}
