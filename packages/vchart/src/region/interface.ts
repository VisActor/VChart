import type { IMark } from '../mark/interface';
import type { ILayoutModel, IModelOption } from '../model/interface';
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

  //stack
  getStackInverse: () => boolean;

  getMaxWidth: () => number | undefined;
  setMaxWidth: (value: number) => void;
  getMaxHeight: () => number | undefined;
  setMaxHeight: (value: number) => void;

  // 系列
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

export interface IRegionConstructor {
  new (spec: IRegionSpec, ctx: IModelOption): IRegion;
}

export interface IRegionSpec extends ILayoutItemSpec {
  id?: StringOrNumber;
  coordinate?: CoordinateType;
  style?: ConvertToMarkStyleSpec<IRectMarkSpec>;
  /**
   * 堆积时是否逆序
   * @default false
   * @since 1.4.0
   */
  stackInverse?: boolean;
}

export interface IGeoRegionSpec extends IRegionSpec {
  coordinate?: 'geo';
  /**
   * 是否可以拖拽
   * @default false
   */
  roam?: boolean;
  /**
   * 数据中的经度字段名
   */
  longitudeField?: string;
  /**
   * 数据中的纬度字段名
   */
  latitudeField?: string;
  /**
   * 地理映射配置
   */
  projection?: Partial<Omit<IProjectionSpec, 'name'>>;
  /**
   * 缩放最大最小倍数限制
   */
  zoomLimit?: {
    min?: number;
    max?: number;
  };
}
