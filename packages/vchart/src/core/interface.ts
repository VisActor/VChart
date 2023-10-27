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
  /**
   * 关联的系列 id
   * the binding series id
   */
  seriesId?: StringOrNumber;
  /**
   * 关联的系列索引
   * the binding series index
   */
  seriesIndex?: number;
};

export type DataLinkAxis = {
  /**
   * 关联的轴 id，目前仅支持直角坐标轴
   * the binding axis id
   */
  axisId?: StringOrNumber;
  /**
   * 关联的轴索引，目前仅支持直角坐标轴
   * the binding axis index
   */
  axisIndex?: number;
};

export interface IVChart {
  readonly id: number;

  /**
   * **同步**渲染图表。
   * @param morphConfig 图表 morph 动画配置，可选
   * @returns VChart 实例
   */
  renderSync: (morphConfig?: IMorphConfig) => IVChart;

  /**
   * **异步**渲染图表。
   * @async
   * @param morphConfig 图表 morph 动画配置，可选
   * @returns VChart 实例
   */
  renderAsync: (morphConfig?: IMorphConfig) => Promise<IVChart>;

  /**
   * **异步**更新数据。
   * @param id 数据 id
   * @param data 数据值
   * @param options 数据参数
   * @returns VChart 实例
   */
  updateData: (id: StringOrNumber, data: Datum[] | string, options?: IParserOptions) => Promise<IVChart>;

  /**
   * **异步**批量更新数据。
   * @param list 待更新的数据列表
   * @returns VChart 实例
   */
  updateDataInBatches: (list: { id: string; data: Datum[]; options?: IParserOptions }[]) => Promise<IVChart>;

  /**
   * **同步**更新数据。
   * @param id 数据 id
   * @param data 数据值
   * @param options 数据参数
   * @returns VChart 实例
   */
  updateDataSync: (id: StringOrNumber, data: Datum[], options?: IParserOptions) => IVChart;

  /**
   * **异步**spec 更新。
   * @param spec
   * @param forceMerge
   * @returns
   */
  updateSpec: (spec: ISpec, forceMerge?: boolean, morphConfig?: IMorphConfig) => Promise<IVChart>;

  /**
   * **同步方法** 模块 spec 更新
   * @param filter
   * @param spec
   * @param forceMerge
   * @returns
   * @sync 1.4.0
   */
  updateModelSpecSync: (
    filter: string | { type: string; index: number },
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ) => IVChart;

  /**
   * **异步方法** 模块 spec 更新
   * @param filter
   * @param spec
   * @param forceMerge
   * @returns
   * @sync 1.4.0
   */
  updateModelSpec: (
    filter: string | { type: string; index: number },
    spec: unknown,
    forceMerge?: boolean,
    morphConfig?: IMorphConfig
  ) => Promise<IVChart>;

  /**
   * 更新绘制区域。
   * @param viewBox 绘制区域
   * @param reRender 是否重新渲染，默认为 true
   * @returns
   */
  updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => IVChart;

  /**
   * **异步方法**，图表尺寸更新方法。
   * @param width 宽度
   * @param height 高度
   * @returns VChart 当前实例
   */
  resize: (width: number, height: number) => Promise<IVChart>;

  /**
   * 销毁图表。
   */
  release: () => void;

  /**
   * 事件监听
   */
  on: ((eType: EventType, handler: EventCallback<EventParams>) => void) &
    ((eType: EventType, query: EventQuery, handler: EventCallback<EventParams>) => void);
  off: (eType: EventType, handler?: EventCallback<EventParams>) => void;

  /**
   * 更新或设置图元状态。
   * @param state 状态筛选器
   * @param filter 筛选器
   */
  updateState: (
    state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>,
    filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean //series + mark 筛选
  ) => void;

  /**
   * 更新图元选中状态。
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

  /**
   * 获取当前主题，会返回完整的主题配置（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为`ThemeManager`统一设置的主题）
   * */
  getCurrentTheme: () => ITheme;

  /**
   * 获取当前主题名称（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为`ThemeManager`统一设置的主题）
   */
  getCurrentThemeName: () => string;

  /**
   * **异步方法**， 设置当前主题。
   * @param name 主题名称
   * @returns
   */
  setCurrentTheme: (name: string) => Promise<IVChart>;

  /**
   * 自定义 TooltipHandler。
   * @param tooltipHandler
   */
  setTooltipHandler: (tooltipHandler: ITooltipHandler) => void;

  /**
   * 获取用户定义的 TooltipHandler
   * @returns ITooltipHandler
   */
  getTooltipHandlerByUser: () => ITooltipHandler | undefined;

  /**
   * 获取 TooltipHandler
   * @returns
   */
  getTooltipHandler: () => ITooltipHandler | undefined;

  /**
   * 手动调用展示 tooltip
   * @param datum 原始数据
   * @param options
   * @returns
   */
  showTooltip: (datum: Datum, options: IShowTooltipOption) => boolean;

  /**
   * 手动调用，关闭 tooltip
   * @returns
   */
  hideTooltip: () => boolean;

  // 图例相关 api
  /**
   * 根据图例组件 id 获取图例数据
   * @param id 组件 id
   * @returns
   */
  getLegendDataById: (id: string) => Datum[];

  /**
   * 根据图例组件索引获取图例数据
   * @param index 图例索引，默认为 0
   * @returns
   */
  getLegendDataByIndex: (index?: number) => Datum[];

  /**
   * 根据图例组件 id 获取当前图例的选中项
   * @param id 组件 id
   * @returns
   */
  getLegendSelectedDataById: (id: string) => StringOrNumber[];

  /**
   * 根据图例组件索引获取当前图例的选中项
   * @param index 图例索引，默认为 0
   * @returns
   */
  getLegendSelectedDataByIndex: (index?: number) => StringOrNumber[];

  /**
   * 根据图例组件 id 更新图例选中数据
   * @param id
   * @returns
   */
  setLegendSelectedDataById: (id: string, selectedData: StringOrNumber[]) => void;

  /**
   * 根据图例组件索引更新图例选中数据
   * @param index 图例索引，默认为 0
   * @returns
   */
  setLegendSelectedDataByIndex: (index: number, selectedData: StringOrNumber[]) => void;

  /**
   * **异步方法**返回一个包含图片展示的 data URI。
   * @returns data URI
   */
  getDataURL: () => Promise<any>;

  /**
   * **异步方法** 导出图表图片，只支持浏览器端。
   * @param name 保存的图片名称
   * @returns
   */
  exportImg: (name?: string) => Promise<void>;

  /**
   * 导出绘制了图表内容的 canvas
   * @returns HTMLCanvasElement
   * @since 1.5.2
   */
  exportCanvas: () => HTMLCanvasElement | undefined;

  /**
   * 目前仅支持 node 环境，用于 node 端的图片导出
   * @returns
   */
  getImageBuffer: () => void;
  /**
   * 设置自定义布局
   */
  setLayout: (layout: LayoutCallBack) => void;
  /**
   * 强制重新布局
   */
  reLayout: () => void;

  /**
   * 获取编译器实例
   * @returns
   */
  getCompiler: () => Compiler;

  /**
   * Get the chart instance
   * 获取 Chart 图表实例。
   * @returns Chart 实例
   */
  getChart: () => Maybe<IChart>;

  /**
   * Get the renderer instance.
   * 获取渲染引擎实例。
   * @returns the instance of VRender Stage
   */
  getStage: () => Stage;

  /**
   * 获取 canvas dom
   * @returns HTMLCanvasElement | undefined
   */
  getCanvas: () => HTMLCanvasElement | undefined;

  /**
   * 获取图表的 dom 容器
   * @returns
   */
  getContainer: () => Maybe<HTMLElement>;

  /**
   * 获取图表所有的组件实例
   * @returns 组件实例
   */
  getComponents: () => IComponent[];

  /**
   * 获取图表的 DataSet 实例
   * @returns DataSet 实例
   */
  getDataSet: () => Maybe<DataSet>;

  // 数据转换相关的 api
  /**
   * Convert the data to coordinate position
   * @param datum the datum to convert
   * @param dataLinkInfo the data link info, could be seriesId or seriesIndex, default is { seriesIndex: 0 }
   * @param isRelativeToCanvas 是否相对画布坐标，默认为 false Whether relative to canvas coordinates, default is false
   * @returns
   */
  convertDatumToPosition: (datum: Datum, dataLinkInfo?: DataLinkSeries, isRelativeToCanvas?: boolean) => IPoint | null;

  /**
   * Convert the value to coordinate position
   * @param value number | [number, number], the value to convert
   * @param dataLinkInfo the data link info, could be seriesId,seriesIndex,axisId,axisIndex
   * @param isRelativeToCanvas 是否相对画布坐标，默认为 false Whether relative to canvas coordinates, default is false
   * returns
   */
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

  /** 停止正在进行的所有动画 */
  stopAnimation: () => void;

  /** 暂停正在进行的所有动画 */
  pauseAnimation: () => void;

  /** 恢复暂停时正在进行的所有动画 */
  resumeAnimation: () => void;
}

export interface IGlobalConfig {
  /** 是否全局显示唯一 tooltip */
  uniqueTooltip?: boolean;
  /** 是否监测图表 dom 变化自动 release */
  // TODO
  // autoRelease?: boolean;
}

/** 图表层级的主题 */
export interface IChartLevelTheme {
  /** 图表背景色 */
  background?: string | IGradientColor;
  /** 图表字体配置 */
  fontFamily?: string;
  /** 全局色板 */
  colorScheme?: IThemeColorScheme;
}
