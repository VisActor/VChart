import type { ISeries } from '../series/interface/series';
import type { ILayoutConstructor, LayoutCallBack } from '../layout/interface';
import type { IDataValues, IMarkStateSpec, IInitOption } from '../typings/spec/common';
import type { ISeriesConstructor } from '../series/interface';
import type { DimensionIndexOption, IChart, IChartConstructor } from '../chart/interface';
import type { IComponentConstructor } from '../component/interface';
import type { EventCallback, EventParams, EventQuery, EventType } from '../event/interface';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type { Transform } from '@visactor/vdataset';
import { DataSet, DataView } from '@visactor/vdataset';
import type { Stage } from '@visactor/vrender-core';
import type { GeoSourceType } from '../typings/geo';
import type { GeoSourceOption } from '../series/map/geo-source';
import type { IMark, MarkConstructor } from '../mark/interface';
import type { ITooltipHandler } from '../typings/tooltip';
import type {
  Datum,
  IPoint,
  IRegionQuerier,
  IShowTooltipOption,
  ISpec,
  Maybe,
  MaybeArray,
  StringOrNumber
} from '../typings';
import type { IBoundsLike, ILogger } from '@visactor/vutils';
import { ThemeManager } from '../theme/theme-manager';
import type { ITheme } from '../theme';
import type { IModel, IUpdateSpecResult } from '../model/interface';
import { Compiler } from '../compile/compiler';
import type { IMorphConfig } from '../animation/spec';
import type { DataLinkAxis, DataLinkSeries, IGlobalConfig, IVChart } from './interface';
import { InstanceManager } from './instance-manager';
export declare class VChart implements IVChart {
  readonly id: number;
  static useChart(charts: IChartConstructor[]): void;
  static useSeries(series: ISeriesConstructor[]): void;
  static useComponent(components: IComponentConstructor[]): void;
  static useMark(marks: MarkConstructor[]): void;
  static useLayout(layouts: ILayoutConstructor[]): void;
  static registerDataSetTransform(name: string, transform: Transform): void;
  static registerMap(key: string, source: GeoSourceType, option?: GeoSourceOption): void;
  static unregisterMap(key: string): void;
  static getMap(key: string): GeoSourceType;
  static hideTooltip(excludeId?: MaybeArray<number>): void;
  static getLogger(): ILogger;
  static readonly InstanceManager: typeof InstanceManager;
  static readonly ThemeManager: typeof ThemeManager;
  static globalConfig: IGlobalConfig;
  static readonly Utils: {
    measureText: (
      text: string,
      textSpec?: Partial<import('@visactor/vrender-core').ITextGraphicAttribute>,
      option?: Partial<import('@visactor/vutils').ITextMeasureOption>,
      useNaiveCanvas?: boolean
    ) => import('@visactor/vutils').ITextSize;
  };
  protected _spec: any;
  private _viewBox;
  private _chart;
  private _compiler;
  private _event;
  private _userEvents;
  private _eventDispatcher;
  private _dataSet;
  getDataSet(): DataSet;
  private _container?;
  private _canvas?;
  private _stage?;
  private _autoSize;
  private _option;
  private _curSize;
  private _observer;
  private _currentThemeName;
  private _currentTheme;
  private _onError?;
  private _context;
  constructor(spec: ISpec, options: IInitOption);
  private _setSpec;
  private _initChart;
  private _releaseData;
  private _bindVGrammarViewEvent;
  private _bindResizeEvent;
  private _unBindResizeEvent;
  private _getCurSize;
  private _onResize;
  private _initDataSet;
  updateCustomConfigAndRerender(
    modifyConfig: () => IUpdateSpecResult | undefined,
    morphConfig?: IMorphConfig
  ): Promise<IVChart>;
  updateCustomConfigAndRerenderSync(
    modifyConfig: () => IUpdateSpecResult | undefined,
    morphConfig?: IMorphConfig
  ): IVChart;
  protected _reCompile(updateResult: IUpdateSpecResult): void;
  renderSync(morphConfig?: IMorphConfig): IVChart;
  renderAsync(morphConfig?: IMorphConfig): Promise<IVChart>;
  release(): void;
  updateData(id: StringOrNumber, data: DataView | Datum[] | string, options?: IParserOptions): Promise<IVChart>;
  updateDataInBatches(
    list: {
      id: string;
      data: Datum[];
      options?: IParserOptions;
    }[]
  ): Promise<IVChart>;
  updateDataSync(id: StringOrNumber, data: DataView | Datum[], options?: IParserOptions): IVChart;
  updateFullDataSync(data: IDataValues | IDataValues[], reRender?: boolean): IVChart;
  updateFullData(data: IDataValues | IDataValues[], reRender?: boolean): Promise<IVChart>;
  updateSpec(spec: ISpec, forceMerge?: boolean, morphConfig?: IMorphConfig): Promise<IVChart>;
  updateSpecSync(spec: ISpec, forceMerge?: boolean, morphConfig?: IMorphConfig): IVChart;
  updateModelSpec(
    filter:
      | string
      | {
          type: string;
          index: number;
        }
      | ((model: IModel) => boolean),
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ): Promise<IVChart>;
  updateModelSpecSync(
    filter:
      | string
      | {
          type: string;
          index: number;
        }
      | ((model: IModel) => boolean),
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ): IVChart;
  protected _updateModelSpec(
    model: IModel,
    spec: unknown,
    sync?: boolean,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ): IVChart | Promise<IVChart>;
  resize(width: number, height: number): Promise<IVChart>;
  updateViewBox(viewBox: IBoundsLike, reRender?: boolean, reLayout?: boolean): IVChart;
  on(eType: EventType, handler: EventCallback<EventParams>): void;
  on(eType: EventType, query: EventQuery, handler: EventCallback<EventParams>): void;
  off(eType: string, handler?: EventCallback<EventParams>): void;
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
  private _updateCurrentTheme;
  private _updateChartConfiguration;
  private _getBackground;
  getCurrentTheme(): ITheme;
  getCurrentThemeName(): string;
  setCurrentTheme(name: string): Promise<IVChart>;
  setCurrentThemeSync(name: string): IVChart;
  private _getTooltipComponent;
  setTooltipHandler(tooltipHandler: ITooltipHandler): void;
  getTooltipHandlerByUser(): ITooltipHandler | undefined;
  getTooltipHandler(): ITooltipHandler | undefined;
  showTooltip(datum: Datum, options: IShowTooltipOption): boolean;
  hideTooltip(): boolean;
  getLegendDataById(id: string): Datum[];
  getLegendDataByIndex(index?: number): Datum[];
  getLegendSelectedDataById(id: string): StringOrNumber[];
  getLegendSelectedDataByIndex(index?: number): StringOrNumber[];
  setLegendSelectedDataById(id: string, selectedData: StringOrNumber[]): void;
  setLegendSelectedDataByIndex(index: number, selectedData: StringOrNumber[]): void;
  getDataURL(): Promise<string>;
  exportImg(name?: string): Promise<void>;
  getImageBuffer(): any;
  setLayout(layout: LayoutCallBack): void;
  reLayout(): void;
  getCompiler(): Compiler;
  getChart(): IChart;
  getStage(): Stage;
  getCanvas(): HTMLCanvasElement | undefined;
  getContainer(): Maybe<HTMLElement>;
  getComponents(): import('../component/interface').IComponent[];
  setDimensionIndex(value: StringOrNumber, opt?: DimensionIndexOption): void;
  stopAnimation(): void;
  pauseAnimation(): void;
  resumeAnimation(): void;
  convertDatumToPosition(datum: Datum, dataLinkInfo?: DataLinkSeries, isRelativeToCanvas?: boolean): IPoint | null;
  convertValueToPosition(
    value: StringOrNumber,
    dataLinkInfo: DataLinkAxis,
    isRelativeToCanvas?: boolean
  ): number | null;
  convertValueToPosition(
    value: [StringOrNumber, StringOrNumber],
    dataLinkInfo: DataLinkSeries,
    isRelativeToCanvas?: boolean
  ): IPoint | null;
}
