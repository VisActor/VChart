import type { DataView } from '@visactor/vdataset';
import type { IGrammarItem } from '../../compile/interface';
import type { IGroupMark } from '../../mark/group';
import type { IModelMarkInfo, IModelOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { ISeries } from './series';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { StringOrNumber } from '../../typings';
import type { ILabelSpec } from '../../component/label';
import type { SeriesMarkNameEnum } from './type';
export interface ISeriesSeriesInfo {
  key: string;
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
export interface ISeriesConstructor {
  type: string;
  mark?: SeriesMarkMap;
  new (spec: any, options: ISeriesOption): ISeries;
}
export interface ISeriesInitOption {}
export interface ISeriesUpdateDataOption {}
export interface ISeriesStackDataNode {
  nodes: {
    [key: string]: ISeriesStackDataMeta;
  };
}
export interface ISeriesStackDataLeaf {
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
export interface ISeriesMarkInitOption {
  themeSpec?: any;
  markSpec?: any;
  skipBeforeLayouted?: boolean;
  parent?: IGroupMark | false;
  isSeriesMark?: boolean;
  depend?: IGrammarItem | IGrammarItem[];
  key?: string;
  groupKey?: string;
  morph?: boolean;
  defaultMorphElementKey?: string;
  dataView?: DataView | false;
  dataProductId?: string;
  dataStatistics?: DataView;
  progressive?: IMarkProgressiveConfig;
  label?: ILabelSpec;
  support3d?: boolean;
}
export interface ISeriesMarkInfo extends IModelMarkInfo {
  name: SeriesMarkNameEnum | string;
}
export type SeriesMarkMap = Partial<Record<SeriesMarkNameEnum, ISeriesMarkInfo>>;
