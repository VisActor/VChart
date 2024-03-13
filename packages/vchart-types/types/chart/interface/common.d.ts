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
export interface IChartOption extends Omit<IModelOption, 'getChartViewRect' | 'getChartLayoutRect' | 'globalScale' | 'getChart' | 'getSeriesData'> {
    container: HTMLElement | null;
    canvas?: HTMLCanvasElement | OffscreenCanvas | string;
    modeParams?: IRenderOption['modeParams'];
    viewBox?: IBoundsLike;
    layout?: LayoutCallBack;
    disableTriggerEvent?: boolean;
}
export interface IChartSpecTransformerOption extends Partial<IChartOption> {
    seriesType?: string;
}
export interface IChartSpecInfo {
    region?: IRegionSpecInfo[];
    series?: ISeriesSpecInfo[];
    component?: Record<string, Array<IModelSpecInfo>>;
}
export interface IChartCreatedOption {
}
export interface IChartInitOption {
}
export interface IChartUpdateOption {
}
export interface IChartLayoutOption {
}
export interface IChartEvaluateOption {
}
export interface IChartRenderOption {
}
