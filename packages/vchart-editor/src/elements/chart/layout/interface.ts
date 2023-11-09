import type { IChartModel } from './../interface';
import type { IEditorLayer, IModelInfo } from './../../../core/interface';
import type { IPoint, IRect } from './../../../typings/space';
import type { IVChart } from '@visactor/vchart';
import type { ISpecProcess } from '../spec-process/interface';
type ILayoutNumber = { percent?: number; offset: number };
export type ILayoutRect = {
  // 所有模块统一使用如下结构记录布局信息
  x: ILayoutNumber;
  y: ILayoutNumber;
  width: ILayoutNumber;
  height: ILayoutNumber;
};
export type LayoutMeta = {
  layout: ILayoutRect;
} & IModelInfo;

export interface ILayoutData {
  viewBox: IRect;
  data: LayoutMeta[];
}

export interface IChartLayout {
  setViewBox: (r: IRect) => void;
  setLayoutData: (d: ILayoutData) => void;
  clearLayoutData: () => void;
  setModelLayoutData: (d: LayoutMeta) => void;
  getModelLayoutData: (info: IModelInfo) => LayoutMeta;
  getLayoutData: () => ILayoutData;
  setVChart: (vchart: IVChart) => void;
  clear: () => void;
  getOverModel: (pos: IPoint, layer: IEditorLayer) => LayoutMeta;

  getBoxConnectModel: (rect: IRect) => { layoutMeta: LayoutMeta; model: IChartModel }[];
}

export interface IChartLayoutConstructor {
  type: string;
  new (specProcess: ISpecProcess): IChartLayout;
}
