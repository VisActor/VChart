import type { IPadding } from '@visactor/vutils';
import type { SymbolType, IRichTextCharacter } from '@visactor/vrender-core';
import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec, StringOrNumber } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { Datum } from '@visactor/vrender-components';

export type IAggrType = 'sum' | 'average' | 'min' | 'max' | 'variance' | 'standardDeviation' | 'median';
export type IDataPos = StringOrNumber | IAggrType;
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
  /**
   * 指定使用 xField 上的那个维度索引，因为 xField 字段有可能会包含多个维度，比如分组场景
   * @default 0
   * @since 1.7.0
   */
  xFieldIndex?: number;
  /**
   * 指定使用 xField 上的维度名称，因为 xField 字段有可能会包含多个维度，比如分组场景。
   * `xFieldIndex` 和 `xFieldDim` 声明一个即可，同时声明则 `xFieldDim` 优先级更高。
   * @since 1.7.0
   */
  xFieldDim?: string;
  /**
   * 指定使用 yField 上的那个维度索引，因为 yField 字段有可能会包含多个维度，比如分组场景。
   * @default 0
   * @since 1.7.0
   */
  yFieldIndex?: number;
  /**
   * 指定使用 yField 上的维度名称，因为 yField 字段有可能会包含多个维度，比如分组场景。
   * `yFieldIndex` 和 `yFieldDim` 声明一个即可，同时声明则 `yFieldDim` 优先级更高。
   * @since 1.7.0
   */
  yFieldDim?: string;
};

type Point = {
  x: number;
  y: number;
};
export type IMarkerPositionsSpec = {
  positions: Point[];
  /**
   * 是否为相对 region 的坐标，默认为 false，即相对画布的坐标
   * @default false
   * @since 1.7.0
   */
  regionRelative?: boolean;
};

export type IMarkerLabelWithoutRefSpec = {
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
    padding?: IPadding | number[] | number;
    /**
     * 背景面板样式
     */
    style?: Omit<IRectMarkSpec, 'visible'>;
  };
  /**
   * 文本类型：text, rich, html
   */
  type?: string;
  /**
   * 文本内容，如果需要进行换行，则使用数组形式，如 ['abc', '123']
   * 支持富文本内容, 如textConfig, html, 设置富文本时要配置type类型为'rich'或'html'
   */
  text?: string | string[] | number | number[] | IRichTextCharacter[];
  /**
   * label文本 - 文本格式化
   * @param markData 组成标注的数据
   * @param seriesData 标注关联的数据
   * @returns 格式化后的文本
   */
  formatMethod?: (
    markData: Datum[],
    seriesData: Datum[]
  ) => string | string[] | number | number[] | IRichTextCharacter[];
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

  /**
   * 是否自动调整 label 使其展示在 marker 可见区域内。
   * @default false
   * @since 1.4.0
   */
  confine?: boolean;
  /**
   * 水平方向的偏移
   */
  dx?: number;
  /**
   * 垂直方向的偏移
   */
  dy?: number;
};

export type IMarkerLabelSpec = IMarkerLabelWithoutRefSpec & IMarkerRef;

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

export interface IMarkerSpec extends IComponentSpec {
  /**
   * 标注数据关联的series
   */
  relativeSeriesIndex?: number;
  relativeSeriesId?: number | string;
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
   * @since 1.3.0
   */
  clip?: boolean;

  /**
   * 标注组件的名称标识
   * @since 1.7.0
   */
  name?: string;
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
