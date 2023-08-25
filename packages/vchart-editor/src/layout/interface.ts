import type { IChart } from '@visactor/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { ISpecProcess } from '../spec-process/interface';
type ILayoutNumber = { percent: number; offset: number };
export type LayoutMeta = {
  id: string;
  layout: {
    // 所有模块统一使用如下结构记录布局信息
    left: ILayoutNumber;
    right: ILayoutNumber;
    top: ILayoutNumber;
    bottom: ILayoutNumber;
  };
};

export interface ILayoutData {
  viewBox: IBoundsLike;
  data: LayoutMeta[];
}

export interface ILayout {
  setLayoutData: (d: ILayoutData) => void;
  getLayoutData: () => ILayoutData;
  setVChart: (vchart: IChart) => void;
  clear: () => void;
}

export interface IDataParserConstructor {
  type: string;
  new (specProcess: ISpecProcess): ILayout;
}
