import type { DataView } from '@visactor/vdataset';
import type { IGrammarItem } from '../../compile/interface';
import type { IGroupMark } from '../../mark/group';
import type { IBaseModelSpecTransformerResult, IModelConstructor, IModelMarkInfo, IModelOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { ISeries } from './series';
import type { IMarkOption, IMarkProgressiveConfig } from '../../mark/interface';
import type { ISeriesSpec, StringOrNumber } from '../../typings';
import type { TransformedLabelSpec } from '../../component/label';
import type { SeriesMarkNameEnum, SeriesTypeEnum } from './type';
import type { ICustomPath2D } from '@visactor/vrender-core';
import type { MarkClip } from '../../compile/mark';
export interface ISeriesSeriesInfo {
    key: string;
    originalKey: any;
    index?: number;
    style: (attribute: string) => any;
    shapeType: string;
}
export interface ISeriesOption extends IModelOption {
    mode: RenderMode;
    region: IRegion;
    sourceDataList: DataView[];
    getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
}
export interface ISeriesConstructor extends IModelConstructor {
    readonly type: string;
    mark?: SeriesMarkMap;
    new (spec: any, options: ISeriesOption): ISeries;
}
export interface ISeriesInitOption {
}
export interface ISeriesUpdateDataOption {
}
export interface ISeriesStackDataNode {
    groupField?: string;
    nodes: {
        [key: string]: ISeriesStackDataMeta;
    };
}
export interface ISeriesStackDataLeaf {
    groupField?: string;
    values: any[];
    total?: number;
}
export type ISeriesStackDataMeta = ISeriesStackDataNode | ISeriesStackDataLeaf;
export type ISeriesStackData = ISeriesStackDataNode;
export type ISeriesStyle = ISeriesStyleItem[];
export type ISeriesStyleItem = {
    name: string;
} & {
    [markName: string]: {
        style?: any;
    };
};
export interface ISeriesMarkInitOption extends Partial<IMarkOption> {
    themeSpec?: any;
    markSpec?: any;
    skipBeforeLayouted?: boolean;
    parent?: IGroupMark | false;
    isSeriesMark?: boolean;
    depend?: IGrammarItem | IGrammarItem[];
    key?: string | ((datum: any) => string);
    groupKey?: string;
    morph?: boolean;
    defaultMorphElementKey?: string;
    dataView?: DataView | false;
    dataProductId?: string;
    seriesId?: number;
    progressive?: IMarkProgressiveConfig;
    support3d?: boolean;
    customShape?: (datum: any[], attrs: any, path: ICustomPath2D) => ICustomPath2D;
    stateSort?: (stateA: string, stateB: string) => number;
    componentType?: string;
    clip?: MarkClip;
}
export interface ISeriesMarkInfo extends IModelMarkInfo {
    name: SeriesMarkNameEnum | string;
}
export type SeriesMarkMap = Partial<Record<SeriesMarkNameEnum, ISeriesMarkInfo>>;
export interface ISeriesSpecInfo<T extends ISeriesSpec = ISeriesSpec> extends IModelSpecInfo, ISeriesSpecTransformerResult<T, any> {
    type: string | SeriesTypeEnum;
    spec: T;
    theme: any;
}
export interface ISeriesSpecTransformerResult<T, K> extends IBaseModelSpecTransformerResult<T, K> {
    markLabelSpec?: Partial<Record<SeriesMarkNameEnum, TransformedLabelSpec[]>>;
    stack?: boolean;
}
