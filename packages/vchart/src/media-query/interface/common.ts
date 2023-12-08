import type { IChart, IChartOption } from '../../chart/interface';
import type { ComponentTypeEnum } from '../../component/interface';
import { IEventDispatcher, VChart } from '../../core';
import type { IModel } from '../../model/interface';
import type { SeriesTypeEnum } from '../../series';
import type { IChartSpec, RenderMode } from '../../typings';
import { MediaQuery } from '../media-query';
import { MediaQueryItem } from '../media-query-item';

export interface IMediaInfo {
  /** 图表宽度 */
  width: number;
  /** 图表高度 */
  height: number;
  /** 渲染模式 */
  mode: RenderMode;
  /** 主题模式 */
  themeMode: 'light' | 'dark';
}

export interface IFilteredModelInfo<T extends Record<string, unknown> = any> {
  model?: IModel | IChart;
  spec: T;
}

export interface IFilterInfoForAppend {
  /** 是否是图表层级 */
  isChart?: boolean;
  /** 如果不是图表层级，是哪个 model 类型 */
  modelType?: 'series' | 'region' | 'component';
  /** model 具体的类型 */
  type?: SeriesTypeEnum | ComponentTypeEnum;
  /** model 在图表 spec 中对应的 key */
  specKey?: keyof IChartSpec;
}

export interface IMediaQueryOption {
  eventDispatcher: IEventDispatcher;
  globalInstance: VChart;
  mode: RenderMode;
}

export interface IMediaQueryItemOption extends IMediaQueryOption {
  mediaQuery: MediaQuery;
  getCurrentMediaInfo: () => IMediaInfo;
}

export interface IMediaQueryCheckResult {
  /** 当前实例 */
  item: MediaQueryItem;
  /** 是否命中媒体查询条件 */
  isActive: boolean;
  /** 当前媒体查询的状态是否发生改变（生效->失效 或 失效->生效） */
  hasChanged: boolean;
}

export interface IMediaQueryActionResult {
  /** 返回的图表 spec */
  chartSpec: any;
  /** spec 是否被更改 */
  hasChanged: boolean;
}
