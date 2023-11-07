import type { IEvent } from '../../event/interface';
import type { ILayoutRect, LayoutCallBack } from '../../layout/interface';
import type { IRunningConfig as IMorphConfig, IView } from '@visactor/vgrammar-core';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { IComponent } from '../../component/interface';
import type { IMark } from '../../mark/interface';
import type { IModel, IUpdateSpecResult } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ISeries } from '../../series/interface';
import type {
  IChartEvaluateOption,
  IChartInitOption,
  IChartLayoutOption,
  IChartOption,
  IChartRenderOption,
  ILayoutParams
} from './common';
import type { IBoundsLike, IPadding } from '@visactor/vutils';
import type { ICompilable } from '../../compile/interface';
import type {
  IRegionQuerier,
  MaybeArray,
  Datum,
  IMarkStateSpec,
  StringOrNumber,
  IShowTooltipOption,
  IDataValues
} from '../../typings';
import type { DataView } from '@visactor/vdataset';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';

export type DimensionIndexOption = {
  filter?: (cmp: IComponent) => boolean;
  tooltip?: boolean;
  showTooltipOption?: IShowTooltipOption;
  crosshair?: boolean;
};

export interface IChart extends ICompilable {
  padding: IPadding;

  readonly type: string;

  getSpec: () => any;
  setSpec: (s: any) => void;

  // data flow
  reDataFlow: () => void;

  setCanvasRect: (width: number, height: number) => void;
  getCanvasRect: () => ILayoutRect;

  getOption: () => IChartOption;

  /** event */
  getEvent: () => IEvent;

  /** layout */
  setLayout: (layout: LayoutCallBack) => void;
  layout: (context: ILayoutParams) => void;
  getLayoutTag: () => boolean;
  setLayoutTag: (tag: boolean) => boolean;

  // 使用parse前的原始数据结构更新数据
  updateData: (id: StringOrNumber, data: unknown, updateGlobalScale?: boolean, options?: IParserOptions) => void;
  // 使用 IData 更新数据
  updateFullData: (data: IDataValues | IDataValues[]) => void;
  // update scale domain which in GlobalScale
  updateGlobalScaleDomain: () => void;
  //生命周期
  created: () => void;
  transformSpec: (spec: any) => void;
  init: (option: IChartInitOption) => void;
  onLayoutStart: (ctx: IChartLayoutOption) => void;
  onLayoutEnd: (ctx: IChartLayoutOption) => void;
  onEvaluateEnd: (ctx: IChartEvaluateOption) => void;
  onRender: (ctx: IChartRenderOption) => void;
  onResize: (width: number, height: number) => void;
  onLayout: (view: IView) => void;

  // series
  getAllSeries: () => ISeries[];

  // region
  getRegionsInIndex: (index?: number[]) => IRegion[];
  getRegionsInIds: (ids: number[]) => IRegion[];
  getAllRegions: () => IRegion[];
  getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
  getRegionsInQuerier: (query: MaybeArray<IRegionQuerier>) => IRegion[];

  // series
  getSeriesInIndex: (index?: number[]) => ISeries[];
  getSeriesInIds: (ids?: number[]) => ISeries[];
  getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
  getSeriesInUserId: (userId: StringOrNumber) => ISeries | undefined;

  // component
  getComponentByIndex: (key: string, index: number) => IComponent | undefined;
  getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
  getComponentsByKey: (key: string) => IComponent[];
  getAllComponents: () => IComponent[];

  // model
  getModelById: (id: number) => IModel | undefined;
  getModelByUserId: (userId: StringOrNumber) => IModel | undefined;
  getModelInFilter: (
    filter: string | { type: string; index: number } | ((model: IModel) => boolean)
  ) => IModel | undefined;
  getAllModels: () => IModel[];

  // mark
  getMarkById: (id: number) => IMark | undefined;
  getAllMarks: () => IMark[];

  // spec
  updateSpec: (spec: any, morphConfig?: IMorphConfig) => IUpdateSpecResult;

  // state
  /**
   * 更新或设置图元状态
   * @param state 状态筛选器
   * @param filter 筛选器
   */
  updateState: (
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean //series + mark 筛选
  ) => void;

  /**
   * 更新图元选中状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setSelected: (
    datum: MaybeArray<any> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;

  /**
   * 更新图元 hover 状态
   * @param datum hover 图元数据
   * @param filter 筛选器 用来筛选系列与mark
   * @param region region 筛选器
   */
  setHovered: (
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;

  // 更新 viewBox
  updateViewBox: (viewBox: IBoundsLike, reLayout: boolean) => void;

  // 获取实际渲染的 canvas
  getCanvas: () => HTMLCanvasElement | undefined;

  setCurrentTheme: (reInit?: boolean) => void;
  getColorScheme: () => IThemeColorScheme | undefined;

  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
  // setDimensionIndex
  setDimensionIndex: (value: StringOrNumber, opt: DimensionIndexOption) => void;
}

export interface IChartConstructor {
  readonly type: string;
  readonly series?: string | string[];
  readonly view: string;
  new (spec: any, options: IChartOption): IChart;
}
