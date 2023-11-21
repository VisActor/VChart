export type ILayoutNumber = number | IPercent | ((layoutRect: ILayoutRect) => number) | IPercentOffset;

export interface ILayoutPoint {
  x: number;
  y: number;
}

export interface ILayoutRect {
  width: number;
  height: number;
}

export type IPercent = `${number}%`;

export type IPercentOffset = { percent?: number; offset?: number };

export type ILayoutPercent = IPercent | number;

/**
 * 相对布局和绝对布局
 * 在相对布局结束后进行二次的绝对布局
 * 绝对布局会只根据 chart 进行相对处理
 */

export type ILayoutType = 'region-relative' | 'region' | 'normal' | 'absolute' | 'normal-inline';

export type ILayoutOrientPadding = {
  left?: ILayoutNumber;
  right?: ILayoutNumber;
  top?: ILayoutNumber;
  bottom?: ILayoutNumber;
};

/** 布局 padding的配置 */
export type ILayoutPaddingSpec = ILayoutOrientPadding | ILayoutNumber | ILayoutNumber[];
