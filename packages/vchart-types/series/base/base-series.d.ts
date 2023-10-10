import { DataView } from '@visactor/vdataset';
import type { DataSet, ITransformOptions } from '@visactor/vdataset';
import type { IRegion } from '../../region/interface';
import type { IMark } from '../../mark/interface';
import type {
  CoordinateType,
  IInvalidType,
  IPoint,
  DataKeyType,
  Datum,
  Maybe,
  ISeriesSpec,
  IGroup
} from '../../typings';
import { BaseModel } from '../../model/base-model';
import type {
  ISeriesOption,
  ISeries,
  ISeriesMarkInitOption,
  ISeriesStackData,
  ISeriesTooltipHelper,
  SeriesMarkMap,
  ISeriesMarkInfo
} from '../interface';
import type { IModelEvaluateOption, IModelRenderOption } from '../../model/interface';
import type { AddVChartPropertyContext } from '../../data/transforms/add-property';
import type { ITrigger } from '../../interaction/interface';
import type { LayoutItem } from '../../model/layout-item';
import type { StatisticOperations } from '../../data/transforms/dimension-statistics';
import { SeriesData } from './series-data';
import type { IGroupMark } from '../../mark/group';
import type { ISeriesMarkAttributeContext } from '../../compile/mark';
export declare abstract class BaseSeries<T extends ISeriesSpec> extends BaseModel<T> implements ISeries {
  readonly type: string;
  layoutType: LayoutItem['layoutType'];
  readonly modelType: string;
  readonly name: string | undefined;
  static readonly mark: SeriesMarkMap;
  protected _trigger: ITrigger;
  getTrigger(): ITrigger;
  protected _option: ISeriesOption;
  readonly coordinate: CoordinateType;
  protected _region: IRegion;
  getRegion(): IRegion;
  protected _rootMark: IGroupMark;
  getRootMark(): IGroupMark;
  protected _seriesMark: Maybe<IMark>;
  protected _layoutLevel: number;
  protected _rawData: DataView;
  getRawData(): DataView;
  protected _rawDataStatistics: DataView;
  getRawDataStatistics(): DataView;
  protected _viewDataMap: Map<number, DataView>;
  protected _viewDataFilter: DataView;
  getViewDataFilter(): DataView;
  protected _data: SeriesData;
  getViewData(): DataView;
  getViewDataProductId(): string;
  protected _viewDataStatistics: DataView;
  getViewDataStatistics(): DataView;
  protected _viewStackData: DataView;
  getViewStackData(): DataView;
  protected _seriesField?: string;
  getSeriesField(): string;
  setSeriesField(field: string): void;
  protected _groups?: IGroup;
  getGroups(): IGroup;
  protected _stack: boolean;
  getStack(): boolean;
  getStackValue(): import('../../typings').StringOrNumber;
  protected _percent: boolean;
  getPercent(): boolean;
  protected _stackOffsetSilhouette: boolean;
  getStackOffsetSilhouette(): boolean;
  protected _dataSet: DataSet;
  protected _tooltipHelper: ISeriesTooltipHelper | undefined;
  get tooltipHelper(): ISeriesTooltipHelper;
  protected _invalidType: IInvalidType;
  getInvalidType(): IInvalidType;
  setInvalidType(t: IInvalidType): void;
  protected _markAttributeContext: ISeriesMarkAttributeContext;
  constructor(spec: T, options: ISeriesOption);
  created(): void;
  protected _buildMarkAttributeContext(): void;
  setAttrFromSpec(): void;
  protected initData(): void;
  protected initGroups(): void;
  protected initStatisticalData(): void;
  protected _statisticRawData(): void;
  protected _statisticViewData(): void;
  protected createStatisticalData(
    dataName: string,
    rawData: DataView,
    staticFields?: (dataId: string) => {
      key: string;
      operations: StatisticOperations;
    }[]
  ): DataView;
  private createdStackData;
  protected _noAnimationDataKey(datum: Datum, index: number, context: AddVChartPropertyContext): unknown | undefined;
  protected generateDefaultDataKey(
    dataKey: DataKeyType,
    datum: Datum,
    index: number,
    context: AddVChartPropertyContext
  ): any;
  protected _addDataIndexAndKey(): void;
  updateRawData(d: any): void;
  rawDataUpdate(d: DataView): void;
  rawDataStatisticsUpdate(d: DataView): void;
  viewDataFilterOver(d: DataView): void;
  viewDataUpdate(d: DataView): void;
  viewDataStatisticsUpdate(d: DataView): void;
  getDatumPositionValue(datum: Datum, field: string): any;
  getDatumPositionValues(datum: Datum, fields: string | string[]): any[];
  abstract getStatisticFields(): {
    key: string;
    operations: StatisticOperations;
  }[];
  abstract getGroupFields(): string[];
  abstract dataToPosition(data: Datum): IPoint;
  abstract dataToPositionX(data: Datum): number;
  abstract dataToPositionY(data: Datum): number;
  abstract valueToPosition(value1: any, value2?: any): IPoint;
  abstract initMark(): void;
  abstract initMarkStyle(): void;
  abstract getStackGroupFields(): string[];
  abstract getStackValueField(): string | undefined;
  abstract setValueFieldToStack(): void;
  abstract setValueFieldToPercent(): void;
  abstract setValueFieldToStackOffsetSilhouette(): void;
  initRootMark(): void;
  protected _initExtensionMark(): void;
  private _createExtensionMark;
  protected _updateExtensionMarkSpec(lastSpec?: any): void;
  getStackData(): ISeriesStackData;
  initTrigger(): void;
  initAnimation(): void;
  initMarkState(): void;
  initSeriesStyleState(): void;
  afterInitMark(): void;
  getMarksWithoutRoot(): IMark[];
  getMarksInType(type: string | string[]): IMark[];
  getMarkInName(name: string): IMark | undefined;
  getMarkInId(markId: number): IMark | undefined;
  protected initEvent(): void;
  protected _releaseEvent(): void;
  protected initTooltip(): void;
  _compareSpec(ignoreCheckKeys?: { [key: string]: true }): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  _updateSpecData(): void;
  reInit(theme?: any, lastSpec?: any): void;
  onEvaluateEnd(ctx: IModelEvaluateOption): void;
  onRender(ctx: IModelRenderOption): void;
  release(): void;
  onLayoutEnd(ctx: any): void;
  getSeriesKeys(): string[];
  getSeriesStyle(datum: Datum): (attribute: string) => unknown;
  protected _getSeriesInfo(
    field: string,
    keys: string[]
  ): {
    key: string;
    style: (attribute: string) => unknown;
    shapeType: string;
  }[];
  getSeriesInfoInField(field: string): {
    key: string;
    style: (attribute: string) => unknown;
    shapeType: string;
  }[];
  getSeriesInfoList(): {
    key: string;
    style: (attribute: string) => unknown;
    shapeType: string;
  }[];
  protected getDefaultColorScale(): any;
  getDefaultColorDomain(): any[];
  getColorAttribute(): {
    scale: any;
    field: string;
  };
  getDimensionField(): string[];
  getMeasureField(): string[];
  protected onMarkPositionUpdate(): void;
  protected onMarkTreePositionUpdate(marks: IMark[]): void;
  setCurrentTheme(theme: any, noRender?: boolean): Promise<void>;
  protected _initTheme(theme?: any): void;
  protected _createMark<M extends IMark>(markInfo: ISeriesMarkInfo, option?: ISeriesMarkInitOption): NonNullable<M>;
  protected _getDataIdKey(): string | ((datum: Datum) => string);
  protected _getSeriesDataKey(datum: Datum): string;
  addViewDataFilter(option: ITransformOptions): void;
  reFilterViewData(): void;
  reTransformViewData(): void;
  fillData(): void;
  compile(): void;
  getDefaultShapeType(): string;
  getFieldAlias(field: string): any;
  getMarkInfoList(): import('../../model/interface').IModelMarkInfo[];
  protected _getInvalidConnectType(): 'none' | 'zero' | 'connect';
  protected _getInvalidDefined: (datum: Datum) => boolean;
}
