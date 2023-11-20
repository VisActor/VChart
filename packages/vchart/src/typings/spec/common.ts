import type { IFillMarkSpec, IImageMarkSpec } from '../visual';
import type { LayoutCallBack } from '../../layout/interface';
import type { IElement, srIOption3DType } from '@visactor/vgrammar-core';
import type {
  DataSet,
  DataView,
  ISimplifyOptions,
  IFieldsOptions,
  IFilterOptions,
  IFoldOptions,
  IDsvParserOptions
} from '@visactor/vdataset';
import type { IRegionSpec } from '../../region/interface';
import type { IHoverSpec, ISelectSpec, ITriggerSpec } from '../../interaction/interface';
import type { IRenderOption } from '../../compile/interface';
import type { ITooltipSpec } from '../../component/tooltip/interface';
// eslint-disable-next-line no-duplicate-imports
import type { ILayoutSpec } from '../../layout/interface';
// eslint-disable-next-line no-duplicate-imports
import type {
  ConvertToMarkStyleSpec,
  IArc3dMarkSpec,
  IArcMarkSpec,
  IAreaMarkSpec,
  IBoxPlotMarkSpec,
  ICommonSpec,
  IGroupMarkSpec,
  ILineMarkSpec,
  ILinkPathMarkSpec,
  IPathMarkSpec,
  IPolygonMarkSpec,
  IProgressArcMarkSpec,
  IPyramid3dMarkSpec,
  IRect3dMarkSpec,
  IRectMarkSpec,
  IRuleMarkSpec,
  ISymbolMarkSpec,
  IRippleMarkSpec,
  ITextMarkSpec,
  IVisualSpecScale
} from '../visual';
import type { StateValue } from '../../compile/mark';
import type { ISeriesStyle, SeriesType } from '../../series/interface';
import type { Datum, StringOrNumber } from '../common';
import type { IInvalidType } from '../data';
import type { IMorphSeriesSpec } from '../../animation/spec';
import type { IPlayer } from '../../component/player';
import type { IMarkProgressiveConfig, MarkTypeEnum } from '../../mark/interface';
import type { IDataZoomSpec, IScrollBarSpec } from '../../component/data-zoom';
import type { ICrosshairSpec } from '../../component/crosshair/interface';
import type { ITheme } from '../../theme';
import type { ITitleSpec } from '../../component/title/interface';
import type { IBrushSpec } from '../../component/brush';
import type { ITotalLabelSpec } from '../../component/label';
import type { ILegendSpec } from '../../component/legend';
import type { ILayoutOrientPadding, ILayoutPaddingSpec } from '../layout';

export type IChartPadding = ILayoutOrientPadding | number;

/** chart option */
export interface IInitOption extends Omit<IRenderOption, 'pluginList'> {
  /**
   * **仅生效于浏览器环境。**
   * 图表挂载的父容器，可以直接指定容器 id，也可以传入 dom 对象
   */
  dom?: string | HTMLElement;
  /**
   * 除去选择 dom 属性进行挂载父容器，也可以使用 renderCanvas 属性直接传入 canvas 实例/ canvasId
   * 小程序/小组件环境请直接传入 id
   */
  renderCanvas?: string | HTMLCanvasElement;
  /** 数据集 */
  dataSet?: DataSet;
  /** 是否自适应容器大小 */
  autoFit?: boolean;
  /**
   * 性能测试钩子
   */
  performanceHook?: IPerformanceHook;
  /**
   * 是否开启动画
   */
  animation?: boolean;
  /**
   * 3d配置
   */
  options3d?: srIOption3DType;

  /**
   * 自定义布局函数
   */
  layout?: LayoutCallBack;

  /**
   * 当文本省略时，鼠标 hover 到文本上时是否显示 poptip
   * @default true
   */
  poptip?: boolean;

  /**
   * 报错的回调函数
   * @since 1.2.0
   */
  onError?: (...args: any[]) => void;

  /**
   * 默认主题（支持完整主题对象或者主题名称，主题名称需要提前在 `ThemeManager` 中注册）
   * @since 1.3.0
   */
  theme?: string | ITheme;

  /**
   * 是否关闭交互效果
   * @since 1.5.0
   * @default false
   */
  disableTriggerEvent?: boolean;
}

export enum RenderModeEnum {
  'desktop-browser' = 'desktop-browser',
  'mobile-browser' = 'mobile-browser',
  'node' = 'node',
  'worker' = 'worker',
  'miniApp' = 'miniApp',
  'wx' = 'wx',
  'desktop-miniApp' = 'desktop-miniApp',
  'lynx' = 'lynx'
}
export type RenderMode = keyof typeof RenderModeEnum;

/** chart spec */
export interface IChartSpec {
  /** 图表类型 */
  type: string;
  /** 数据 */
  data?: IData;
  /** 画布宽度 */
  width?: number;
  /** 画布高度 */
  height?: number;
  /**
   * 图表宽高是否自适应容器，浏览器环境下默认为 true。
   * 该配置的优先级高于构造函数中的 autoFit 配置。
   * 如果用户配置了 width，则以用户配置的 width 为准，height 同理。
   */
  autoFit?: boolean;
  /**
   * 图表整体 padding 设置
   */
  padding?: ILayoutPaddingSpec;
  /**
   * 图表色系配置
   */
  color?: string[] | Omit<IVisualSpecScale<unknown, string>, 'id'>;
  /**
   * 系列
   * @description 仅在组合图中使用, 文档中除组合图外均未透出该配置
   */
  series?: ISeriesSpec[];
  /**
   * 系列样式
   * @description 仅在图表配置了seriesField时生效
   */
  seriesStyle?: ISeriesStyle;

  /**
   * 自动关闭动画的阀值，对应的是单系列data的长度
   * @since 1.2.0
   */
  animationThreshold?: number;

  /** hover 交互 */
  hover?: boolean | IHoverSpec;
  /** select 交互 */
  select?: boolean | ISelectSpec;

  /** region配置 */
  region?: IRegionSpec[];
  /** 图表标题配置 */
  title?: ITitleSpec;
  /** 布局配置 */
  layout?: ILayoutSpec;
  /** 图例配置 */
  legends?: ILegendSpec | ILegendSpec[];
  /** 十字辅助线配置 */
  crosshair?: ICrosshairSpec | ICrosshairSpec[];
  /** tooltip配置 */
  tooltip?: ITooltipSpec;
  /** 播放器配置 */
  player?: IPlayer;
  /** 缩略轴配置 */
  dataZoom?: IDataZoomSpec | IDataZoomSpec[];
  /** 滚动条配置 */
  scrollBar?: IScrollBarSpec | IScrollBarSpec[];
  /** 框选配置 */
  brush?: IBrushSpec;
  /** 全局 scale 配置 */
  scales?: IVisualSpecScale<unknown, unknown>[];
  /** 自定义mark */
  customMark?: ICustomMarkSpec<EnableMarkType>[];
  /**
   * 图表上的主题定义。
   * 可以直接配置主题名，前提是该主题名已经注册
   */
  theme?: Omit<ITheme, 'name'> | string;
  /**
   * 图表背景色配置，优先级高于构造函数中的 background 配置
   */
  background?: IBackgroundSpec;

  // TODO：后续开放，现在仍有问题
  // poptip?: PopTipAttributes;
  // TODO: 补充动画配置

  /**
   * 堆积时是否逆序
   * @default false
   * @since 1.4.0
   */
  stackInverse?: boolean;
}

export type IBackgroundStyleSpec = ConvertToMarkStyleSpec<Omit<IFillMarkSpec, 'width' | 'height' | 'background'>> & {
  image?: IRectMarkSpec['background'];
  cornerRadius?: IRectMarkSpec['cornerRadius'];
};

export type IBackgroundSpec = string | IBackgroundStyleSpec;

/** data */
export type IDataType = IDataValues | DataView;
export type IData = IDataType | IDataType[];
export type DataKeyType = string | string[] | ((data: Datum, index: number) => string);
export type BuildInTransformOptions =
  | {
      /** 地理数据简化 */
      type: 'simplify';
      options: ISimplifyOptions;
    }
  | {
      /** 数据维度处理，包括排序，逆序，数据筛选能力 */
      type: 'fields';
      options: IFieldsOptions;
    }
  | {
      /** 使用回调的自定义筛选 */
      type: 'filter';
      options: IFilterOptions;
    }
  | {
      /** 数据展开 */
      type: 'fold';
      options: IFoldOptions;
    };

export interface IFieldsMeta {
  /** TODO: 字段通用format, 暂时先不支持 */
  // format?: (datum: Datum, index: number) => unknown;
  /** 字段别名 */
  alias?: string;
  /** 字段取值范围 */
  domain?: StringOrNumber[];
  /** 是否使用 domain 锁定统计信息。默认为 false */
  lockStatisticsByDomain?: boolean;
  /** 连续型 还是 离散型 */
  type?: 'ordinal' | 'linear';
  /** 排序顺序 不设置的话当前维度不进行排序 */
  sortIndex?: number;
  /** 排序时是否反转 默认为 false */
  sortReverse?: boolean;
}

export interface SheetParseOptions extends CommonParseOptions {
  type: 'csv' | 'dsv' | 'tsv';
  options?: IDsvParserOptions;
}

export interface CommonParseOptions {
  /**
   * 是否需要对数据进行 clone，默认为 true。
   * 如果考虑性能，你可以将其关闭，但是这会带了一些副作用，即我们会对传入的数据进行修改（不会对原有字段及值修改，只会在原有数据基础上添加一些字段）。
   * @default true
   * @since 1.3.0
   */
  clone?: boolean;
}

export interface IDataValues {
  /**
   * 数据唯一标识
   */
  id?: StringOrNumber;
  /**
   * 数据
   */
  values: Datum[] | string;
  /**
   * 引用的数据索引
   */
  fromDataIndex?: number;
  /**
   * 引用的数据 id
   */
  fromDataId?: StringOrNumber;
  /**
   * 数据 transform 配置
   */
  transforms?: BuildInTransformOptions[];
  /**
   * 数据字段相关配置
   */
  fields?: Record<
    /** 字段key */
    string,
    IFieldsMeta
  >;

  parser?: SheetParseOptions | CommonParseOptions;
}

export type IHierarchyNodeData = {
  value?: number;
  children?: IHierarchyNodeData[];
} & Datum;

export interface IHierarchyDataValues extends Omit<IDataValues, 'values'> {
  values: IHierarchyNodeData;
}

export type IHierarchyData = DataView | IHierarchyDataValues;

/** series */
export interface ISeriesSpec extends ITriggerSpec {
  /** 系列类型 */
  type: SeriesType;

  /** 系列名称 */
  name?: string;

  /** 用户自定义的 series id */
  id?: StringOrNumber;
  /**
   * 系列数据
   * @description 系列可以配置自身的数据，也可以从chart.data中获取数据
   */
  data?: IDataType;
  /**
   * 系列关联的数据索引
   * @default 0
   */
  dataIndex?: number;
  /**
   * 系列关联的数据id
   */
  dataId?: StringOrNumber;
  /**
   * dataKey用于绑定数据与Mark的关系, 该配置在动画中非常重要.
   */
  dataKey?: DataKeyType;

  /**
   * 系列关联的region索引
   * @default 0
   */
  regionIndex?: number;
  /** 系列关联的region id */
  regionId?: StringOrNumber;
  /**
   * 分组字段
   */
  seriesField?: string;
  /**
   * 系列样式
   * @description 仅在图表配置了seriesField时生效
   */
  seriesStyle?: ISeriesStyle;

  /** 是否对数据进行堆叠处理 */
  stack?: boolean;

  /**
   * 堆叠时的分组值
   * stackValue 相等的系列将在一起堆积。没有配置的系列将在一组
   * @since 1.4.0
   */
  stackValue?: StringOrNumber;

  /** 堆叠汇总标签
   * @since 1.3.0
   */
  totalLabel?: ITotalLabelSpec;

  /** 是否对数据进行百分比处理 */
  percent?: boolean;

  /** 是否围绕中心轴偏移轮廓 */
  stackOffsetSilhouette?: boolean;

  /**
   * 非合规数据点连接方式
   * @description null，undefined等非法数据点连接方式。
   * @default 'break'
   * 'break'指在该数据点处断开
   * 'link' 指忽略该点保持连续
   * 'zero' 指该点默认数值为0
   * 'ignore' 指不处理
   */
  invalidType?: IInvalidType;

  /** 提示信息 */
  tooltip?: ITooltipSpec;

  /**
   * 是否开启系列动画
   */
  animation?: boolean;
  /**
   * 自动关闭动画的阀值，对应的是单系列data的长度
   * @since 1.2.0
   */
  animationThreshold?: number;

  /**
   * 是否支持3d视角
   */
  support3d?: boolean;
  /**
   * morph 动画配置
   */
  morph?: IMorphSeriesSpec;

  /**
   * 扩展mark
   */
  extensionMark?: (IExtensionMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | IExtensionGroupMarkSpec)[];

  /**
   * series background
   * 作用是支持系列的图形对系列背景进行 mask，或者切分等效果。不是作为背景图
   * 暂时不开放api，避免出现break change
   */
  // background?: IBackgroundSpec;
}

export type IChartExtendsSeriesSpec<T extends ISeriesSpec> = Omit<T, 'data' | 'morph' | 'stackValue'>;

export type AdaptiveSpec<T, K extends keyof any> = {
  [key in Exclude<keyof T, K>]: T[key];
} & { [key in K]: any };

/** markSpec */
export type IMarkSpec<T extends ICommonSpec = ICommonSpec> = {
  /**
   * 用户id
   */
  id?: StringOrNumber;
  /**
   * 是否响应交互
   */
  interactive?: boolean;
  // /**
  //  * 是否会被region区域裁减
  //  * @todo 暂未支持
  //  */
  // clip?: boolean;
  /**
   * 与其他mark元素的层级
   */
  zIndex?: number;
  /**
   * mark 层 是否显示配置
   */
  visible?: boolean;
  /** 默认样式设置 */
  style?: ConvertToMarkStyleSpec<T>;
  /** 不同状态下的样式配置 */
  state?: Record<StateValue, IMarkStateSpec<T> | IMarkStateStyleSpec<T>>;

  /* 是否是3d视角的mark */
  support3d?: boolean;
} & IMarkProgressiveConfig;

export type IMarkStateFilter =
  | {
      /** 维度筛选 */
      fields: { [key in string]: { type: 'ordinal' | 'linear'; domain: StringOrNumber[] } };
    }
  | {
      /** 筛选数据 */
      datums: Datum[];
      /** 筛选数据 */
      datumKeys: string[];
    }
  | {
      /** 筛选 item */
      items: IElement[];
    }
  /** 筛选函数 */
  | ((datum: Datum, options: Record<string, any>) => boolean);

export interface IMarkStateSpec<T> {
  /** 筛选器 */
  filter?: IMarkStateFilter;
  /** 状态优先级 */
  level?: number | undefined;
  style: ConvertToMarkStyleSpec<T>;
}

export type IMarkStateStyleSpec<T> = ConvertToMarkStyleSpec<T>;

export type IMarkTheme<T> = {
  /**
   * mark 层 是否显示配置
   */
  visible?: boolean;
  /** 默认样式设置 */
  style?: T;
  /** 不同状态下的样式配置 */
  state?: Record<StateValue, T>;
  /**
   * 可交互的开关
   */
  interactive?: boolean;
};

export interface IPerformanceHook {
  // InitRender
  //   ├── InitializeChart
  //   ├── CompileToVGrammar
  //   ├── ParseView
  //   |  └── ParseExpression
  //   ├── (new View)
  //   |  ├── CreateRuntime
  //   |  └── (view.initialize)
  //   |     └── CreateVRenderStage
  //   └── SrViewEvaluateAsync / SrViewRunAsync
  //      ├── MarkTransform
  //      ├── FacetTransform
  //      ├── CreateVRenderMark
  //      └── VRenderDraw

  // 初始化图表配置
  beforeInitializeChart?: () => void;
  afterInitializeChart?: () => void;

  // 编译
  beforeCompileToVGrammar?: () => void;
  afterCompileToVGrammar?: () => void;
  // 各个图表模块编译
  beforeRegionCompile?: () => void;
  afterRegionCompile?: () => void;
  beforeSeriesCompile?: () => void;
  afterSeriesCompile?: () => void;
  beforeComponentCompile?: () => void;
  afterComponentCompile?: () => void;

  // resize的时候的钩子
  beforeResizeWithUpdate?: () => void;
  afterResizeWithUpdate?: () => void;

  // LayoutWithSceneGraph 二次布局
  beforeLayoutWithSceneGraph?: () => void;
  afterLayoutWithSceneGraph?: () => void;

  // VGrammar 解析spec
  beforeParseView?: () => void;
  afterParseView?: () => void;

  // 初始化runtime
  beforeCreateRuntime?: () => void;
  afterCreateRuntime?: () => void;

  // VGrammar EvaluateAsync 时间
  beforeSrViewEvaluateAsync?: () => void;
  afterSrViewEvaluateAsync?: () => void;

  // VGrammar RunAsync 时间
  beforeSrViewRunAsync?: () => void;
  afterSrViewRunAsync?: () => void;

  // transform测量
  beforeTransform?: (name: string) => void;
  afterTransform?: (name: string) => void;

  // Create VRender Stage 时间
  beforeCreateVRenderStage?: () => void;
  afterCreateVRenderStage?: () => void;

  // Create VRender Mark 时间
  beforeCreateVRenderMark?: () => void;
  afterCreateVRenderMark?: () => void;

  // VRender Draw 时间
  beforeVRenderDraw?: () => void;
  afterVRenderDraw?: () => void;
}

export type IBuildinMarkSpec = {
  [MarkTypeEnum.group]: IGroupMarkSpec;

  [MarkTypeEnum.symbol]: ISymbolMarkSpec;
  [MarkTypeEnum.rule]: IRuleMarkSpec;
  [MarkTypeEnum.line]: ILineMarkSpec;
  [MarkTypeEnum.text]: ITextMarkSpec;
  [MarkTypeEnum.rect]: IRectMarkSpec;
  [MarkTypeEnum.rect3d]: IRect3dMarkSpec;
  [MarkTypeEnum.image]: IImageMarkSpec;
  [MarkTypeEnum.path]: IPathMarkSpec;
  [MarkTypeEnum.area]: IAreaMarkSpec;
  [MarkTypeEnum.arc]: IArcMarkSpec;
  [MarkTypeEnum.arc3d]: IArc3dMarkSpec;
  [MarkTypeEnum.polygon]: IPolygonMarkSpec;
  [MarkTypeEnum.pyramid3d]: IPyramid3dMarkSpec;
  [MarkTypeEnum.boxPlot]: IBoxPlotMarkSpec;
  [MarkTypeEnum.linkPath]: ILinkPathMarkSpec;
  [MarkTypeEnum.progressArc]: IProgressArcMarkSpec;
  [MarkTypeEnum.ripple]: IRippleMarkSpec;
};
export type EnableMarkType = keyof IBuildinMarkSpec;
export interface ICustomMarkSpec<T extends EnableMarkType> extends IMarkSpec<IBuildinMarkSpec[T]> {
  type: T;
  /**
   * 关联的数据索引
   * @default 与系列使用同一份数据
   */
  dataIndex?: number;
  /**
   * 关联的数据id
   */
  dataId?: StringOrNumber;
}
export interface ICustomMarkGroupSpec extends ICustomMarkSpec<MarkTypeEnum.group> {
  children?: ICustomMarkSpec<EnableMarkType>[];
}

export interface IExtensionMarkSpec<T extends Exclude<EnableMarkType, MarkTypeEnum.group>> extends ICustomMarkSpec<T> {
  /**
   * 关联的数据索引
   * @default 与系列使用同一份数据
   */
  dataIndex?: number;
  /**
   * 关联的数据id
   */
  dataId?: StringOrNumber;
}

export interface IExtensionGroupMarkSpec extends ICustomMarkSpec<MarkTypeEnum.group> {
  /**
   * 支持子节点
   */
  children?: ICustomMarkSpec<EnableMarkType>[];
}
