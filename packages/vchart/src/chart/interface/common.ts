import type { LayoutCallBack } from '../../layout/interface';
import type { IRenderOption } from '../../compile/interface';
import type { IModelOption, IModelSpecInfo } from '../../model/interface';
import type { IView } from '@visactor/vgrammar-core';
import type { IBoundsLike } from '@visactor/vutils';
import type { ISeriesSpecInfo } from '../../series';
import type { IRegionSpecInfo } from '../../region';

export interface ILayoutParams {
  srView?: IView;
  group?: any;
}

export interface IAttributeParams {
  srView?: IView;
  group?: any;
}

export interface IChartOption
  extends Omit<IModelOption, 'getChartViewRect' | 'getChartLayoutRect' | 'globalScale' | 'getChart' | 'getSeriesData'> {
  container: HTMLElement | null;
  canvas?: HTMLCanvasElement | OffscreenCanvas | string;
  modeParams?: IRenderOption['modeParams'];

  /**
   * TODO: 支持百分比
   */
  viewBox?: IBoundsLike;

  /**
   * 自定义布局方法
   */
  layout?: LayoutCallBack;

  /**
   * 是否关闭交互效果
   */
  disableTriggerEvent?: boolean;
}

export interface IChartSpecTransformerOption extends IChartOption {
  seriesType?: string;
}

/** 图表 spec 信息，包含所有的 IModelSpecInfo 对象 */
export interface IChartSpecInfo {
  region?: IRegionSpecInfo[];
  series?: ISeriesSpecInfo[];
  component?: Record<string, Array<IModelSpecInfo>>;
}

// TODO: interface definition
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartCreatedOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartInitOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartUpdateOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartLayoutOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartEvaluateOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartRenderOption {}
