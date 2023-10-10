import { ChartData } from './chart-meta/data';
import type {
  ISeriesSpec,
  Datum,
  IMarkStateSpec,
  IRegionQuerier,
  MaybeArray,
  IPadding,
  IRect,
  StringOrNumber,
  IChartSpec,
  IDataValues
} from '../typings';
import type { LayoutCallBack } from '../layout/interface';
import type {
  ILayoutModelState,
  ILayoutOrientPadding,
  ILayoutRect,
  IModel,
  IModelOption,
  IUpdateSpecResult
} from '../model/interface';
import type {
  IChart,
  IChartLayoutOption,
  IChartRenderOption,
  IChartOption,
  IChartEvaluateOption,
  ILayoutParams,
  DimensionIndexOption
} from './interface';
import type { ISeries } from '../series/interface';
import type { IRegion } from '../region/interface';
import type { IComponent } from '../component/interface';
import { type IMark } from '../mark/interface';
import type { IEvent } from '../event/interface';
import type { DataView } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset/es/data-set';
import { Stack } from './stack';
import type { ITheme } from '../theme/interface';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { IBoundsLike } from '@visactor/vutils';
import type { IRunningConfig as IMorphConfig, IMark as IVGrammarMark, IView } from '@visactor/vgrammar-core';
import { CompilableBase } from '../compile/compilable-base';
import type { IGlobalScale } from '../scale/interface';
import type { IRectMark } from '../mark/rect';
export declare class BaseChart extends CompilableBase implements IChart {
  readonly type: string;
  readonly id: number;
  protected _spec: any;
  getSpec(): any;
  setSpec(s: any): void;
  getOption(): IChartOption;
  protected _theme: ITheme;
  protected _regions: IRegion[];
  protected _series: ISeries[];
  protected _components: IComponent[];
  protected _layoutFunc: LayoutCallBack;
  protected _layoutRect: IRect;
  getLayoutRect(): IRect;
  protected _viewRect: ILayoutRect;
  getViewRect(): ILayoutRect;
  protected _viewBox: IBoundsLike;
  protected _layoutTag: boolean;
  getLayoutTag(): boolean;
  setLayoutTag(tag: boolean, morphConfig?: IMorphConfig, reLayout?: boolean): boolean;
  protected _modelOption: IModelOption;
  protected _globalScale: IGlobalScale;
  protected _idMap: Map<number, IModel | IMark>;
  protected _event: IEvent;
  getEvent(): IEvent;
  protected _dataSet: DataSet;
  protected _chartData: ChartData;
  get chartData(): ChartData;
  protected _option: IChartOption;
  readonly state: ILayoutModelState;
  protected _stack: Stack;
  padding: IPadding;
  protected _paddingSpec: ILayoutOrientPadding;
  protected _canvasRect: ILayoutRect;
  protected _backgroundMark: IRectMark;
  constructor(spec: any, option: IChartOption);
  created(): void;
  transformSpec(spec: any): void;
  init(options?: any): void;
  reDataFlow(): void;
  onResize(width: number, height: number): void;
  updateViewBox(viewBox: IBoundsLike, reLayout: boolean): void;
  createBackground(bg: IChartSpec['background']): void;
  createRegion(regionSpec: any[]): void;
  initRegion(): void;
  createSeries(seriesSpec: ISeriesSpec[]): void;
  initSeries(): void;
  getAllSeries: () => ISeries[];
  getSeriesById(id: number): ISeries | undefined;
  private _createComponent;
  createComponent(spec: any): void;
  initComponent(): void;
  getAllComponents(): IComponent[];
  getAllModels(): IModel[];
  getModelInFilter(
    filter:
      | string
      | {
          type: string;
          index: number;
        }
      | ((model: IModel) => boolean)
  ): IModel;
  createLayout(): void;
  setLayout(layout: LayoutCallBack): void;
  private _initLayoutFunc;
  layout(params: ILayoutParams): void;
  onLayoutStart(option: IChartLayoutOption): void;
  onLayoutEnd(option: IChartLayoutOption): void;
  onEvaluateEnd(option: IChartEvaluateOption): void;
  getLayoutElements(): (IRegion | ISeries | IComponent)[];
  getRegionsInIndex: (index?: number[]) => IRegion[];
  getAllRegions: () => IRegion[];
  getRegionsInIds: (ids: number[]) => IRegion[];
  getRegionsInQuerier: (region?: MaybeArray<IRegionQuerier>) => IRegion[];
  getRegionsInUserId: (userId: StringOrNumber) => IRegion | undefined;
  getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
  getComponents: () => IComponent[];
  getSeriesInIndex: (index?: number[]) => ISeries[];
  getSeriesInIds: (ids?: number[]) => ISeries[];
  getSeriesInUserId: (userId: StringOrNumber) => ISeries | undefined;
  getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
  getComponentByIndex: (key: string, index: number) => IComponent;
  getComponentsByKey: (key: string) => IComponent[];
  getComponentByUserId: (userId: StringOrNumber) => IComponent;
  getModelById(id: number): IModel | undefined;
  getModelByUserId(userId: StringOrNumber): IModel | undefined;
  getAllMarks(): IMark[];
  getMarkById(id: number): IMark | undefined;
  updateData(id: StringOrNumber, data: unknown, updateGlobalScale?: boolean, options?: IParserOptions): void;
  updateFullData(data: IDataValues | IDataValues[], updateGlobalScale?: boolean): void;
  onRender(option: IChartRenderOption): void;
  setCanvasRect(width: number, height: number): void;
  getCanvasRect(): Omit<IRect, 'x' | 'y'>;
  getSeriesData(id: StringOrNumber | undefined, index: number | undefined): DataView | undefined;
  private _transformSpecScale;
  createGlobalScale(): void;
  updateGlobalScaleDomain(): void;
  updateGlobalScale(result: IUpdateSpecResult): void;
  updateGlobalScaleTheme(): void;
  updateSpec(
    spec: any,
    morphConfig?: IMorphConfig
  ): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  updateChartConfig(result: IUpdateSpecResult, oldSpec: IChartSpec): void;
  updateDataSpec(result: IUpdateSpecResult): void;
  updateRegionSpec(result: IUpdateSpecResult): void;
  updateComponentSpec(result: IUpdateSpecResult): void;
  updateSeriesSpec(result: IUpdateSpecResult): void;
  getCanvas(): HTMLCanvasElement;
  protected isValidSeries(seriesType: string): boolean;
  protected _getDefaultSeriesSpec(spec: any): any;
  private _updateLayoutRect;
  getCurrentTheme(): ITheme;
  setCurrentTheme(theme: ITheme, reInit?: boolean): void;
  protected setRegionTheme(reInit?: boolean): void;
  protected setComponentTheme(theme: ITheme, reInit?: boolean): void;
  protected setSeriesTheme(theme: ITheme, reInit?: boolean): void;
  clear(): void;
  compile(): void;
  afterCompile(): void;
  compileLayout(): void;
  compileBackground(): void;
  compileRegions(): void;
  compileSeries(): void;
  compileComponents(): void;
  release(): void;
  onLayout(srView: IView): void;
  checkUpdate(mark: IVGrammarMark, model: IModel, sceneRoot: IVGrammarMark): void;
  updateState(
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean
  ): void;
  setSelected(
    datum: MaybeArray<any> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ): void;
  setHovered(
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ): void;
  initEvent(): void;
  protected _enableMarkAnimation(states: string | string[]): void;
  protected _disableMarkAnimation(states: string | string[]): void;
  protected _setStateInDatum(
    stateKey: string,
    checkReverse: boolean,
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ): void;
  setDimensionIndex(value: StringOrNumber, opt: DimensionIndexOption): void;
}
