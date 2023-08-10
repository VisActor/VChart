import type { LegendTitle } from '@visactor/vrender-components';
import type {
  Datum,
  IOrientType,
  IPadding,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec,
  StringOrNumber
} from '../../typings';
import type { IComponent } from '../interface';
import type { IModelSpec } from '../../model/interface';

export type ILegend = IComponent & {
  getLegendData: () => Datum[];
  getSelectedData: () => StringOrNumber[];
  setSelectedData: (d: StringOrNumber[]) => void;
};

export type NoVisibleMarkStyle<T> = Omit<T, 'visible'>;

export type ITitle = {
  /** 标题文本样式 */
  textStyle?: NoVisibleMarkStyle<ITextMarkSpec>;
  /**
   * @deprecated 请使用 textStyle 配置文本样式
   */
  style?: NoVisibleMarkStyle<ITextMarkSpec>;
  /** 文本前 mark 图元 */
  shape?: {
    /**
     * 是否展示 shape
     */
    visible?: boolean;
    /**
     * shape 同 文本的间距
     */
    space?: number;
    style?: NoVisibleMarkStyle<ISymbolMarkSpec>;
  };
  /**
   * 标题的背景面板配置
   */
  background?: {
    /**
     * 是否绘制背景层
     */
    visible?: boolean;
    /**
     * 背景层样式
     */
    style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'visible' | 'width' | 'height'>;
  };
} & Omit<LegendTitle, 'textStyle' | 'style' | 'background'>;

// 图例组件通用配置
export type ILegendCommonSpec = {
  /**
   * 是否显示图例
   * @default true
   */
  visible?: boolean;
  /**
   * 图例位置
   * @default 'left'
   */
  orient?: IOrientType;
  /**
   * 图例在当前行列的对齐方式，起始 | 居中 | 末尾
   * @default 'middle'
   */
  position?: 'start' | 'middle' | 'end';

  /**
   * 是否进行数据筛选，默认为 true
   */
  filter?: boolean;

  /**
   * 图例标题配置
   */
  title?: ITitle;

  /**
   * 图例背景配置
   */
  background?: {
    /**
     * 是否绘制背景层
     */
    visible?: boolean;
    /**
     * 背景内边距
     */
    padding?: IPadding | number | number[];
    /**
     * 背景层样式
     */
    style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'visible' | 'width' | 'height'>;
  };

  /**
   * 图例关联的region索引
   * @default 0
   */
  regionIndex?: number | number[];
  /**
   * 图例关联的region id
   */
  regionId?: StringOrNumber | StringOrNumber[];
  /**
   * 图例关联的系列索引
   */
  seriesIndex?: number | number[];
  /**
   * 图例关联的系列id
   */
  seriesId?: StringOrNumber | StringOrNumber[];
} & Omit<IModelSpec, 'orient'>;
