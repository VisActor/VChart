import type { IPadding, IPointLike } from '@visactor/vutils';
import type { SymbolType } from '@visactor/vrender';
import type { IModelSpec } from '../../model/interface';
import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec, StringOrNumber } from '../../typings';

export type IAggrType = 'sum' | 'average' | 'min' | 'max' | 'variance' | 'standardDeviation' | 'median';
export type IDataPos = string | number | IAggrType;
export type IDataPosCallback = (
  relativeSeriesData: any,
  startRelativeSeriesData: any,
  endRelativeSeriesData: any
) => IDataPos;
export type IDataPointSpec = {
  [key: string]: IDataPos;
  /**
   * 具体某个数据元素关联的series（仅在标注目标：数据元素下有效）
   */
  refRelativeSeriesIndex?: number;
  refRelativeSeriesId?: StringOrNumber;
};
export type IMarkerPositionsSpec = {
  positions: IPointLike[];
};

export type IMarkerLabelSpec = {
  visible?: boolean;
  /**
   * label整体 - 是否自动旋转
   */
  autoRotate?: boolean;
  /**
   * label整体 - 最小宽度，像素值
   * @default 30
   */
  minWidth?: number;
  /**
   * label整体 - 最大宽度，像素值。当文字超过最大宽度时，会自动省略。
   */
  maxWidth?: number;
  /**
   * label整体 - 背景面板配置
   */
  labelBackground?: {
    visible?: boolean;
    /**
     * 内部边距
     */
    padding?: IPadding;
    style: Omit<IRectMarkSpec, 'visible'>;
  };
  /**
   * label文本 - 文本内容，如果需要进行换行，则使用数组形式，如 ['abc', '123']
   */
  text?: string | string[] | number | number[];
  /**
   * label文本 - 文本格式化
   * @param datum marker组件聚合或回归计算后的数据值
   * @returns 格式化后的文本
   */
  formatMethod?: (datum: IDataPos) => string | string[] | number | number[];
  /**
   * label文本 - 文本样式
   */
  style?: Omit<ITextMarkSpec, 'visible'>;

  /**
   * label文本 - 文本前 mark 图元
   */
  shape?: {
    visible?: boolean;
    style: Omit<ISymbolMarkSpec, 'visible'>;
  };
  /**
   * label文本 - shape 同文本之间的间距
   */
  space?: number;
} & IMarkerRef;

export interface IMarkerRef {
  /**
   * label or symbol 相对line平行方向上的偏移
   */
  refX?: number;
  /**
   * label or symbol 相对line正交方向上的偏移
   */
  refY?: number;
  /**
   * label or symbol 相对默认角度的偏移 （label跟随line的角度做自动旋转时，默认按照line的平行向量作为初始角度）
   */
  refAngle?: number;
}

export interface IMarkerAxisSpec {
  /**
   * 起点和终点关联的series（仅在标注目标：坐标空间下有效）
   */
  startRelativeSeriesIndex?: number;
  endRelativeSeriesIndex?: number;
  startRelativeSeriesId?: string;
  endRelativeSeriesId?: string;
  /**
   * 被标注数据关联的series
   */
  relativeRelativeSeriesIndex?: number;
}

export interface IMarkerSpec extends IModelSpec {
  /**
   * 标注数据关联的series
   */
  relativeSeriesIndex?: number;
  relativeSeriesId?: number;
  /**
   * marker组件是否可见
   * @default true
   */
  visible?: boolean;
  /**
   * marker组件是否可交互
   * @default false
   */
  interactive?: boolean;
  /**
   * marker组件是否自动拓展轴范围
   * @default false
   * @since 1.1.0
   */
  autoRange?: boolean;
  /**
   * marker组件超出图表区域是否被裁剪
   * @default false
   */
  clip?: boolean;
}

export interface IMarkerSymbol extends IMarkerRef {
  /** 是否展示 symbol */
  visible: boolean;
  /**
   * symbol 形状，默认为带左右方向的箭头
   */
  symbolType?: SymbolType;
  /**
   * symbol 大小
   */
  size?: number;
  style?: Omit<ISymbolMarkSpec, 'visible'>;
}
