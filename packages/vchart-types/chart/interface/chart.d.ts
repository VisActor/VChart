import type { IEvent } from '../../event/interface';
import type { LayoutCallBack } from '../../layout/interface';
import type { IRunningConfig as IMorphConfig, IView } from '@visactor/vgrammar-core';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { IComponent } from '../../component/interface';
import type { IMark } from '../../mark/interface';
import type { ILayoutRect, IModel, IUpdateSpecResult } from '../../model/interface';
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
  reDataFlow: () => void;
  setCanvasRect: (width: number, height: number) => void;
  getCanvasRect: () => ILayoutRect;
  getOption: () => IChartOption;
  getEvent: () => IEvent;
  setLayout: (layout: LayoutCallBack) => void;
  layout: (context: ILayoutParams) => void;
  getLayoutTag: () => boolean;
  setLayoutTag: (tag: boolean) => boolean;
  updateData: (id: StringOrNumber, data: unknown, updateGlobalScale?: boolean, options?: IParserOptions) => void;
  updateFullData: (data: IDataValues | IDataValues[]) => void;
  updateGlobalScaleDomain: () => void;
  created: () => void;
  transformSpec: (spec: any) => void;
  init: (option: IChartInitOption) => void;
  onLayoutStart: (ctx: IChartLayoutOption) => void;
  onLayoutEnd: (ctx: IChartLayoutOption) => void;
  onEvaluateEnd: (ctx: IChartEvaluateOption) => void;
  onRender: (ctx: IChartRenderOption) => void;
  onResize: (width: number, height: number) => void;
  onLayout: (view: IView) => void;
  getAllSeries: () => ISeries[];
  getRegionsInIndex: (index?: number[]) => IRegion[];
  getRegionsInIds: (ids: number[]) => IRegion[];
  getAllRegions: () => IRegion[];
  getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
  getRegionsInQuerier: (query: MaybeArray<IRegionQuerier>) => IRegion[];
  getSeriesInIndex: (index?: number[]) => ISeries[];
  getSeriesInIds: (ids?: number[]) => ISeries[];
  getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
  getSeriesInUserId: (userId: StringOrNumber) => ISeries | undefined;
  getComponentByIndex: (key: string, index: number) => IComponent | undefined;
  getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
  getComponentsByKey: (key: string) => IComponent[];
  getAllComponents: () => IComponent[];
  getModelById: (id: number) => IModel | undefined;
  getModelByUserId: (userId: StringOrNumber) => IModel | undefined;
  getModelInFilter: (
    filter:
      | string
      | {
          type: string;
          index: number;
        }
      | ((model: IModel) => boolean)
  ) => IModel | undefined;
  getAllModels: () => IModel[];
  getMarkById: (id: number) => IMark | undefined;
  getAllMarks: () => IMark[];
  updateSpec: (spec: any, morphConfig?: IMorphConfig) => IUpdateSpecResult;
  updateState: (
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean
  ) => void;
  setSelected: (
    datum: MaybeArray<any> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;
  setHovered: (
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) => void;
  updateViewBox: (viewBox: IBoundsLike, reLayout: boolean) => void;
  getCanvas: () => HTMLCanvasElement | undefined;
  setCurrentTheme: (reInit?: boolean) => void;
  getColorScheme: () => IThemeColorScheme | undefined;
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
  setDimensionIndex: (value: StringOrNumber, opt: DimensionIndexOption) => void;
}
export interface IChartConstructor {
  readonly type: string;
  readonly series?: string | string[];
  readonly view: string;
  new (spec: any, options: IChartOption): IChart;
}
