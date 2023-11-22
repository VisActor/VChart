import type { IImageGraphicAttribute, IRichTextGraphicAttribute } from '@visactor/vrender-core';
import type { IMarkPointItemPosition } from '@visactor/vrender-components';
import type { ILineMarkSpec, ISymbolMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerRef, IMarkerSymbol } from '../../interface';

export interface IItemContent extends IMarkerRef {
  /**
   * 标注类型
   */
  type?: 'symbol' | 'text' | 'image' | 'richText';
  /**
   * 标注内容相对于定位点的位置
   */
  position?: IMarkPointItemPosition;
  /**
   * x 方向偏移量
   */
  offsetX?: number;
  /**
   * y 方向偏移量
   */
  offsetY?: number;
  /**
   * type为symbol时, symbol的样式
   */
  symbol?: {
    style?: ISymbolMarkSpec;
  };
  /**
   * type为image时, image的样式
   */
  image?: {
    style?: IImageGraphicAttribute;
  };
  /**
   * type为text时, text的样式
   */
  text?: IMarkerLabelSpec;
  /**
   * type为rich text时, rich text的样式
   */
  richText?: {
    style?: IRichTextGraphicAttribute;
  };
}

export type IItemLine<T extends Partial<IMarkerSymbol> = IMarkerSymbol> = {
  /** TODO：'type-opo' */
  /**
   * 引导线类型
   * 'type-s'表示起点和终点直接连线; 'type-do'表示包含一个折点，且折点x坐标为起点到终点的 1/2 x坐标，折点y坐标为起点y坐标；'type-op' 表示包含一个折点，且折点x坐标为起点x坐标，折点y坐标为终点y坐标；'type-po' 表示包含一个折点，且折点x坐标为终点x坐标，折点y坐标为起点y坐标
   * 引导线类型的具体形式参考：https://journals.sagepub.com/doi/10.1177/1473871618799500
   */
  type?: 'type-s' | 'type-do' | 'type-po' | 'type-op';
  /**
   * 引导线可见性
   */
  visible?: boolean;
  /**
   * 垂直于引导线的装饰线，参考案例: https://observablehq.com/@mikelotis/edmonton-population-history-line-chart
   */
  decorativeLine?: {
    /**
     * 装饰线可见性
     */
    visible?: boolean;
    /**
     * 装饰线的长度
     */
    length?: number;
  };
  /**
   * 引导线起点symbol样式
   */
  startSymbol?: T;
  /**
   * 引导线终点symbol样式
   */
  endSymbol?: T;
  /**
   * 引导线样式
   */
  line?: {
    style?: Omit<ILineMarkSpec, 'visible'>;
  };
};

export interface IMarkPointTheme<T extends Partial<IMarkerSymbol> = Partial<IMarkerSymbol>> {
  /**
   * 标注引导线
   */
  itemLine?: IItemLine<T>;

  /**
   * 标注内容
   */
  itemContent?: IItemContent;
}
