import type { DataSet } from '@visactor/vdataset';
import type { IParserOptions } from '@visactor/vdataset/es/parser';
import type {
  Datum,
  IMarkStateSpec,
  IPoint,
  IRegionQuerier,
  IShowTooltipOption,
  ISpec,
  ITooltipHandler,
  Maybe,
  MaybeArray,
  StringOrNumber
} from '../typings';
import type { IMorphConfig } from '../animation/spec';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventCallback, EventParams, EventQuery, EventType } from '../event/interface';
import type { IMark } from '../mark/interface';
import type { ISeries } from '../series/interface/series';
import type { ITheme } from '../theme';
import type { IComponent } from '../component/interface';
import type { LayoutCallBack } from '../layout/interface';
import type { Compiler } from '../compile/compiler';
import type { IChart } from '../chart/interface';
import type { IGradientColor, Stage } from '@visactor/vrender-core';
import type { IThemeColorScheme } from '../theme/color-scheme/interface';
export type DataLinkSeries = {
  seriesId?: StringOrNumber;
  seriesIndex?: number;
};
export type DataLinkAxis = {
  axisId?: StringOrNumber;
  axisIndex?: number;
};
export interface IVChart {
  readonly id: number;
  renderSync: (morphConfig?: IMorphConfig) => IVChart;
  renderAsync: (morphConfig?: IMorphConfig) => Promise<IVChart>;
  updateData: (id: StringOrNumber, data: Datum[] | string, options?: IParserOptions) => Promise<IVChart>;
  updateDataInBatches: (
    list: {
      id: string;
      data: Datum[];
      options?: IParserOptions;
    }[]
  ) => Promise<IVChart>;
  updateDataSync: (id: StringOrNumber, data: Datum[], options?: IParserOptions) => IVChart;
  updateSpec: (spec: ISpec, forceMerge?: boolean, morphConfig?: IMorphConfig) => Promise<IVChart>;
  updateModelSpecSync: (
    filter:
      | string
      | {
          type: string;
          index: number;
        },
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ) => IVChart;
  updateModelSpec: (
    filter:
      | string
      | {
          type: string;
          index: number;
        },
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ) => Promise<IVChart>;
  updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => IVChart;
  resize: (width: number, height: number) => Promise<IVChart>;
  release: () => void;
  on: ((eType: EventType, handler: EventCallback<EventParams>) => void) &
    ((eType: EventType, query: EventQuery, handler: EventCallback<EventParams>) => void);
  off: (eType: EventType, handler?: EventCallback<EventParams>) => void;
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
  getCurrentTheme: () => ITheme;
  getCurrentThemeName: () => string;
  setCurrentTheme: (name: string) => Promise<IVChart>;
  setTooltipHandler: (tooltipHandler: ITooltipHandler) => void;
  getTooltipHandlerByUser: () => ITooltipHandler | undefined;
  getTooltipHandler: () => ITooltipHandler | undefined;
  showTooltip: (datum: Datum, options: IShowTooltipOption) => boolean;
  hideTooltip: () => boolean;
  getLegendDataById: (id: string) => Datum[];
  getLegendDataByIndex: (index?: number) => Datum[];
  getLegendSelectedDataById: (id: string) => StringOrNumber[];
  getLegendSelectedDataByIndex: (index?: number) => StringOrNumber[];
  setLegendSelectedDataById: (id: string, selectedData: StringOrNumber[]) => void;
  setLegendSelectedDataByIndex: (index: number, selectedData: StringOrNumber[]) => void;
  getDataURL: () => Promise<any>;
  exportImg: (name?: string) => Promise<void>;
  exportCanvas: () => HTMLCanvasElement | undefined;
  getImageBuffer: () => void;
  setLayout: (layout: LayoutCallBack) => void;
  reLayout: () => void;
  getCompiler: () => Compiler;
  getChart: () => Maybe<IChart>;
  getStage: () => Stage;
  getCanvas: () => HTMLCanvasElement | undefined;
  getContainer: () => Maybe<HTMLElement>;
  getComponents: () => IComponent[];
  getDataSet: () => Maybe<DataSet>;
  convertDatumToPosition: (datum: Datum, dataLinkInfo?: DataLinkSeries, isRelativeToCanvas?: boolean) => IPoint | null;
  convertValueToPosition: ((
    value: StringOrNumber,
    dataLinkInfo: DataLinkAxis,
    isRelativeToCanvas?: boolean
  ) => number | null) &
    ((
      value: [StringOrNumber, StringOrNumber],
      dataLinkInfo: DataLinkSeries,
      isRelativeToCanvas?: boolean
    ) => IPoint | null);
  stopAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
}
export interface IGlobalConfig {
  uniqueTooltip?: boolean;
}
export interface IChartLevelTheme {
  background?: string | IGradientColor;
  fontFamily?: string;
  colorScheme?: IThemeColorScheme;
}
