import type { ISeriesSpec, DirectionType, IMarkTheme } from '../../typings';
import type { IMarkSpec } from '../../typings/spec/common';
import type { IRectMarkSpec, ILinkPathMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { SankeyAppearPreset, SankeyMark } from './animation';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILabelSpec } from '../../component/label';

export interface ISankeySeriesSpec extends Omit<ISeriesSpec, 'data'>, IAnimationSpec<SankeyMark, SankeyAppearPreset> {
  nameKey: any;
  type: 'sankey';

  /**
   * 数据字段配置
   */
  /** 节点名称字段配置 */
  categoryField: string;
  /** 节点之间关系的权重字段 */
  valueField: string;
  /** 来源节点数据字段
   *  层级数据不提供
   */
  sourceField?: string;
  /** 目标节点数据字段
   *  层级数据不提供
   */
  targetField?: string;

  /**
   * 图表布局方向
   */
  direction?: DirectionType;
  /**
   * 节点的对齐类型
   */
  nodeAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  /**
   * 同一层中两个节点之间的间隙大小
   */
  nodeGap?: number;
  /**
   * 每个节点的宽度，支持三种取值
   * 1. 百分比字符串，例如：{ nodeWidth: '12%' }
   * 2. 以'px'为单位的简单数字，eg: { nodeWidth: 20 }
   * 3. function，通过自定义计算指定nodeWidth
   */
  nodeWidth?: string | number | ((node: SankeyNodeElement) => number);
  /**
   * link宽度，单位px
   */
  linkWidth?: number | ((link: SankeyLinkElement) => number);
  /**
   * link + node 的最小宽度
   */
  minStepWidth?: number;
  /**
   * 数据不为零或空时节点的最小大小
   *  - 这个配置可以用来避免数据太小时看不到太细的节点
   *  - 建议小于5px
   */
  minNodeHeight?: number;
  /**
   * 数据不为零或空时边的最小大小
   *  - 这个配置可以用来避免数据太小的时候看不到太细的链接
   *  - 建议小于5px
   *  - 当同时指定 `minNodeHeight` 和 `minLinkHeight` 两个选项时，此选项应小于 `minNodeHeight`
   */
  minLinkHeight?: number;
  /** 布局的迭代次数 */
  iterations?: number;
  /** 解析node的key，defaultValue */
  nodeKey?: string | number | ((datum: SankeyNodeDatum) => string | number);
  /** 按此funtion排序link */
  linkSortBy?: (a: SankeyLinkElement, b: SankeyLinkElement) => number;
  /** 按此funtion排序node */
  nodeSortBy?: (a: SankeyNodeElement, b: SankeyNodeElement) => number;
  /** 自定义指定节点层 */
  setNodeLayer?: (datum: SankeyNodeDatum) => number;

  /** 节点配置 */
  [SeriesMarkNameEnum.node]?: IMarkSpec<IRectMarkSpec>;

  /** 边配置 */
  [SeriesMarkNameEnum.link]?: IMarkSpec<ILinkPathMarkSpec>;

  /** 联动交互配置 */
  emphasis?: {
    /** 是否开启交互 */
    enable: boolean;
    /**
     * 交互触发类型
     * 默认为‘click'
     */
    trigger?: 'click' | 'hover';
    /**桑基图提供3种在节点上的交互联动效果
     * self: 仅高亮当前节点。
     * adjacency: 高亮当前节点上下游节点和关联的边，淡化其它图形元素。
     * related： 高亮与当前节点相关的整条路径上的节点和边，淡化其它图形元素。 */
    effect: 'self' | 'adjacency' | 'related';
  };

  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: ILabelSpec & {
    /**
     * 标签布局方式
     * @default 'outside'
     */
    position?: 'outside' | 'inside-start' | 'inside-middle' | 'inside-end' | 'left' | 'right';
    /** 标签文字缩略 */
    limit?: number;
  };

  /** 进度条配置 */
  // scroll?: IScrollSpec & {
  //   /** 是否开启进度条 */
  //   enable: boolean;
  // };
}

export interface SankeyLinkDatum {
  source: string | number;
  target: string | number;
  value?: number;
}

export interface SankeyNodeDatum {
  value?: number;
}

export interface HierarchyNodeDatum {
  value?: number;
  children?: HierarchyNodeDatum[];
}

export type SankeyData =
  | {
      nodes?: SankeyNodeDatum[];
      links: SankeyLinkDatum[];
    }
  | {
      nodes: HierarchyNodeDatum[];
    };

/**
 * The node element after sankey layout
 */
export interface SankeyNodeElement {
  key: string | number;
  index: number;
  /** the depth of node, from source to target */
  depth: number;

  /** the depth of node, from target to source */
  endDepth?: number;
  /** the final layer index after layout */
  layer?: number;
  isLastLayer?: boolean;
  value: number;
  datum: SankeyNodeDatum;
  sourceLinks: SankeyLinkElement[];
  targetLinks: SankeyLinkElement[];
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}
/**
 * the link element after sankey layout
 */
export interface SankeyLinkElement {
  vertical?: boolean;
  index: number;
  source: string | number;
  target: string | number;
  value: number;
  datum: SankeyLinkDatum | SankeyLinkDatum[];
  thickness?: number;
  sourceRect?: { x0: number; x1: number; y0: number; y1: number };
  targetRect?: { x0: number; x1: number; y0: number; y1: number };
  /** this will only be generate in hierarchy node data*/
  parents?: (string | number)[];
  y0?: number;
  y1?: number;
  x0?: number;
  x1?: number;
}

export type SankeyLayoutResult = {
  nodes: SankeyNodeElement[];
  links: SankeyLinkElement[];
  columns: SankeyNodeElement[][];
}[];

export interface ISankeySeriesTheme {
  [SeriesMarkNameEnum.node]?: IMarkTheme<IRectMarkSpec>;
  [SeriesMarkNameEnum.link]?: IMarkTheme<ILinkPathMarkSpec>;
}
