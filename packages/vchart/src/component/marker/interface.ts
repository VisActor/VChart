import type { DataView } from '@visactor/vdataset';
import type { IPadding } from '@visactor/vutils';
import type { SymbolType } from '@visactor/vrender-core';
import type {
  IComposedTextMarkSpec,
  IFormatMethod,
  IRectMarkSpec,
  IRichTextFormatMethod,
  ISymbolMarkSpec,
  StringOrNumber
} from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { Datum } from '@visactor/vrender-components';
import type { ICartesianSeries, IGeoSeries, IPolarSeries } from '../../series/interface';
import type {
  IOptionAggr,
  IOptionAggrField,
  IOptionSeries,
  IOptionWithCoordinates
} from '../../data/transforms/aggregation';
import type { IOptionRegr } from '../../data/transforms/regression';

export type IMarkerSupportSeries = ICartesianSeries | IPolarSeries | IGeoSeries;

export type IPolarPoint = {
  angle: number;
  radius: number;
};
export type OffsetPoint = {
  /**
   * x 方向的偏移
   * 1. number 类型表示像素值，如 12
   * 2. string 类型表示百分比，如 '10%' 表示相对于所在 region 宽度的占比
   */
  x?: number | string;
  /**
   * y 方向的偏移
   * 1. number 类型表示像素值，如 12
   * 2. string 类型表示百分比，如 '10%' 表示相对于所在 region 高度的占比
   */
  y?: number | string;
};

export type IAggrType = 'sum' | 'average' | 'min' | 'max' | 'variance' | 'standardDeviation' | 'median';
export type IDataPos = StringOrNumber | IAggrType;
export type IDataPosCallback = (
  relativeSeriesData: Datum[],
  startRelativeSeriesData: Datum[],
  endRelativeSeriesData: Datum[],
  relativeSeries: IMarkerSupportSeries,
  startRelativeSeries: IMarkerSupportSeries,
  endRelativeSeries: IMarkerSupportSeries
) => StringOrNumber;

export type IDataPointSpec = {
  /**
   * 数据字段配置
   */
  [key: string]: IDataPos | IDataPosCallback;
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
  /**
   * 指定使用 angleField 上的那个维度索引，因为 angleField 字段有可能会包含多个维度，比如分组场景
   * @default 0
   * @since 1.11.0
   */
  angleFieldIndex?: number;
  /**
   * 指定使用 angleField 上的维度名称，因为 angleField 字段有可能会包含多个维度，比如分组场景。
   * `angleFieldIndex` 和 `angleFieldDim` 声明一个即可，同时声明则 `angleFieldDim` 优先级更高。
   * @since 1.11.0
   */
  angleFieldDim?: string;
  /**
   * 指定使用 radiusField 上的那个维度索引，因为 radiusField 字段有可能会包含多个维度，比如分组场景
   * @default 0
   * @since 1.11.0
   */
  radiusFieldIndex?: number;
  /**
   * 指定使用 radiusField 上的维度名称，因为 radiusField 字段有可能会包含多个维度，比如分组场景。
   * `radiusFieldIndex` 和 `radiusFieldDim` 声明一个即可，同时声明则 `radiusFieldDim` 优先级更高。
   * @since 1.11.0
   */
  radiusFieldDim?: string;
};

export type MarkerPositionPoint = {
  /**
   * x 坐标位置，number 类型表示像素值，string 类型表示相对画布宽度或者 region 宽度的占比（从左往右）
   */
  x: StringOrNumber;
  /**
   * y 坐标位置，number 类型表示像素值，string 类型表示相对画布高度或者 region 高度的占比（从上至下）
   */
  y: StringOrNumber;
};

export type ICoordinateOption = {
  x?: IOptionAggrField | (IDataPosCallback | StringOrNumber)[];
  y?: IOptionAggrField | (IDataPosCallback | StringOrNumber)[];
  angle?: IOptionAggrField | (IDataPosCallback | StringOrNumber)[];
  radius?: IOptionAggrField | (IDataPosCallback | StringOrNumber)[];
  getRefRelativeSeries?: () => IMarkerSupportSeries;
} & IOptionSeries;

export type IMarkerPositionsSpec = {
  /**
   * 画布坐标
   * `positions` 自 1.12.0 版本开始支持回调函数
   */
  positions:
    | MarkerPositionPoint[]
    | ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => MarkerPositionPoint[]);
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
  } & Partial<IMarkerState<Omit<IRectMarkSpec, 'visible'>>>;

  /** @deprecated  */
  type?: 'rich' | 'text';
  /**
   * 文本内容，如果需要进行换行，则使用数组形式，如 ['abc', '123']
   * 支持富文本内容 textConfig，设置富文本时要配置 textType 类型为 'rich'
   */
  text?: string | string[] | number | number[] | ReturnType<IRichTextFormatMethod<[]>>;
  /**
   * label文本 - 文本格式化
   * @param markData 组成标注的数据
   * @param seriesData 标注关联的数据
   * @returns 格式化后的文本
   */
  formatMethod?: IFormatMethod<[markData: Datum[], seriesData: Datum[]]>;

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
} & Partial<IMarkerState<Omit<IComposedTextMarkSpec, 'visible'>>>; // label文本 - 文本样式

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

// 跨越系列的配置
export interface IMarkerCrossSeriesSpec {
  /**
   * 起点和终点关联的series（仅在标注目标：坐标空间下有效）
   */
  startRelativeSeriesIndex?: number;
  endRelativeSeriesIndex?: number;
  startRelativeSeriesId?: string;
  endRelativeSeriesId?: string;
  /**
   * 数据处理需要单独关联系列, 当配置为'all'时代表关联当前region下所有系列
   * @since 1.11.0
   */
  specifiedDataSeriesIndex?: 'all' | number | number[];
  specifiedDataSeriesId?: 'all' | string | string[];
}

export type IMarkerSpec = IComponentSpec & {
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
   * @default true
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
  /**
   * 标注所在的坐标系类型
   * @description 一般情况下内部逻辑会根据配置自动推导类型，但如果是coordinates的配置方式，则无法推导，需要用户自行配置
   * @since 1.11.0
   */
  coordinateType?: string;
};

export type IMarkerSymbol = IMarkerRef & {
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
} & Partial<IMarkerState<Omit<ISymbolMarkSpec, 'visible'>>>;

export type MarkerStyleCallback<T> = (markerData: DataView) => T;
export type MarkerStateCallback<T> = (markerData: DataView) => T;
export type MarkerStateValue = 'hover' | 'hover_reverse' | 'selected' | 'selected_reverse';
export type IMarkerState<T> = {
  /** 默认样式设置 */
  style?: T | MarkerStyleCallback<T>;
  /** 不同状态下的样式配置 */
  state?: Record<MarkerStateValue, T | MarkerStateCallback<T>>;
};

export type MarkCoordinateType = 'cartesian' | 'polar' | 'geo';

export type IMarkProcessOptions = {
  options: IOptionAggr[] | IOptionRegr | IOptionWithCoordinates;
  needAggr?: boolean;
  needRegr?: boolean;
  processData?: DataView;
};
