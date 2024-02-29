import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec } from '../../../typings/visual';
import type { DiscreteLegendAttrs, LegendItemDatum, LegendItem } from '@visactor/vrender-components';
import type { ILegendCommonSpec, NoVisibleMarkStyle } from '../interface';
import type { IFormatMethod, StringOrNumber } from '../../../typings';
import type { IBaseScale } from '@visactor/vscale';
import type { IGlobalScale } from '../../../scale/interface';

// export type formatterCallback = (text: StringOrNumber, item: LegendItemDatum, index: number) => any;
export type formatterCallback = IFormatMethod<[text: StringOrNumber, item: LegendItemDatum, index: number]>;
export type LegendItemStyleValue<T> =
  | T
  | ((item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) => T);
export type LegendItemStyle<T> = {
  /**
   * 样式配置
   */
  style?: T;
  /**
   * 状态样式配置
   */
  state?: {
    /**
     * 选中态
     */
    selected?: T;
    /**
     * 非选中态
     */
    unSelected?: T;
    /**
     * 选中态 hover
     */
    selectedHover?: T;
    /**
     * 非选中态 hover
     */
    unSelectedHover?: T;
  };
};

export type IItem = {
  /**
   * 图例项背景配置
   */
  background?: {
    /**
     * 是否展示图例项背景
     */
    visible?: boolean;
  } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<IRectMarkSpec>>>;
  /**
   * 图例项的 shape 图标的配置
   */
  shape?: {
    /**
     * 图例项的 shape 图标
     */
    visible?: boolean;
    /** shape 同后面 label 的间距 */
    space?: number;
  } & LegendItemStyle<LegendItemStyleValue<Partial<NoVisibleMarkStyle<ISymbolMarkSpec>>>>;
  /**
   * 图例项的 label 文本配置
   */
  label?: {
    /**
     * 图例项 label 同后面 value 的间距
     */
    space?: number;
    /**
     * 格式化文本函数
     */
    formatMethod?: formatterCallback;
  } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<ITextMarkSpec>>>;
  /**
   * 图例项 value 配置
   */
  value?: {
    /** value 同后面元素的间距 */
    space?: number;
    /**
     * 是否右对齐显示，仅当设置图例项宽度 itemWidth 时生效
     * 默认为 false，
     */
    alignRight?: boolean;
    /**
     * 格式化文本函数
     */
    formatMethod?: formatterCallback;
  } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<ITextMarkSpec>>>;
  /**
   * 聚焦按钮配置
   */
  focusIconStyle?: NoVisibleMarkStyle<ISymbolMarkSpec>;
  /**
   * 图例项的最大宽度，默认为 null。
   * 可使用百分比，表示显示区域的宽度占比。
   */
  maxWidth?: number | string;
  /**
   * 图例项的宽度, 默认自动计算。
   * 可使用百分比，表示显示区域的宽度占比。
   */
  width?: number | string;
  /**
   * 图例的高度，默认自动计算。
   * 可使用百分比，表示显示区域的高度占比。
   */
  height?: number | string;
} & Omit<LegendItem, 'background' | 'shape' | 'label' | 'value' | 'focusIconStyle' | 'width' | 'height' | 'maxWidth'>;

export type IPager = {
  /**
   * 文本样式配置
   */
  textStyle?: Partial<NoVisibleMarkStyle<ITextMarkSpec>>;
  handler?: {
    /**
     * 按钮同文本内容区的间距，默认为 8
     */
    space?: number;
    /**
     * 上一页按钮形状
     */
    preShape?: string;
    /**
     * 下一页按钮形状
     */
    nextShape?: string;
    style?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
    state?: {
      /**
       * hover 状态下的样式
       */
      hover?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
      /**
       * 不可用状态样式
       */
      disable?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
    };
  };
} & Omit<DiscreteLegendAttrs['pager'], 'textStyle' | 'handler'>;

/** spec */
export type IDiscreteLegendSpec = ILegendCommonSpec & {
  type?: 'discrete';
  /**
   * 在原始图例绘制数据的基础上，进行自定义，比如可以自定义 value 值
   * @param data 图例的绘制数据
   * @param colorScale 全局颜色映射 scale
   * @param globalScale 图表上所有的 scale
   * @returns
   */
  data?: (data: LegendItemDatum[], colorScale: IBaseScale, globalScale: IGlobalScale) => LegendItemDatum[];

  /** 图例项配置 */
  item?: IItem;

  /**
   * 翻页器配置
   */
  pager?: IPager;

  /**
   * scaleName must match the id of the scale configured in **scales**
   */
  scaleName?: string;
  /**
   * After the legend is bound to the scale, the dimension associated with the series data and the legend can be configured through field.
   * If the field is not configured, the first item of fields in the domain of scale is used by default
   * If the domain of the scale is not dependent on data statistics, series.getSeriesField() is used by default
   */
  field?: string;
  /**
   * 默认筛选的数据范围
   */
  defaultSelected?: string[];
} & Omit<DiscreteLegendAttrs, 'layout' | 'title' | 'items' | 'item' | 'pager'>;

// theme 主题相关配置
export type IDiscreteLegendTheme = Omit<
  IDiscreteLegendSpec,
  'type' | 'data' | 'regionIndex' | 'regionId' | 'seriesIndex' | 'seriesId' | 'id' | 'defaultSelected'
>;
