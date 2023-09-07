import type { IRect } from './../../../typings/space.d';
import type { IChart } from '@visactor/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { ISpecProcess } from '../spec-process/interface';
type ILayoutNumber = { percent?: number; offset: number };
export type LayoutMeta = {
  id: number | string;
  layout: {
    // 所有模块统一使用如下结构记录布局信息
    x: ILayoutNumber;
    y: ILayoutNumber;
    width: ILayoutNumber;
    height: ILayoutNumber;
  };
};

export interface ILayoutData {
  viewBox: IBoundsLike;
  data: LayoutMeta[];
}

export interface IChartLayout {
  setViewBox: (r: IRect) => void;
  setLayoutData: (d: ILayoutData) => void;
  getLayoutData: () => ILayoutData;
  setVChart: (vchart: IChart) => void;
  clear: () => void;
}

export interface IChartLayoutConstructor {
  type: string;
  new (specProcess: ISpecProcess): IChartLayout;
}
