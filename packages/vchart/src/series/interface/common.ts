import type { DataView } from '@visactor/vdataset';
import type { IGrammarItem } from '../../compile/interface';
import type { IGroupMark } from '../../mark/group';
import type { IModelMarkInfo, IModelOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { ISeries } from './series';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { StringOrNumber } from '../../typings';
import type { ILabelSpec } from '../../component/label';

// export type SeriesStyle = 'color' | 'size' | 'shape';

export interface ISeriesSeriesInfo {
  key: string;
  index?: number;
  // 样式的值类型可能是 StringOrNumber | number[] | xxxx
  style: (attribute: string) => any;
  /** series 对应的缩略图类型 */
  shapeType: string;
}

export interface ISeriesOption extends IModelOption {
  mode: RenderMode;
  region: IRegion;
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
}

export interface ISeriesConstructor {
  type: string;
  mark?: SeriesMarkMap;
  new (spec: any, options: ISeriesOption): ISeries;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISeriesInitOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISeriesUpdateDataOption {}

export interface ISeriesStackDataNode {
  nodes: {
    [key: string]: ISeriesStackDataMeta;
  };
}
export interface ISeriesStackDataLeaf {
  values: any[];
  total?: number;
}

export type ISeriesStackDataMeta = ISeriesStackDataNode | ISeriesStackDataLeaf;
export type ISeriesStackData = ISeriesStackDataNode;

export type ISeriesStyle = ISeriesStyleItem[];
export type ISeriesStyleItem = {
  name: string;
} & {
  [markName: string]: {
    style?: any;
  };
};

export interface ISeriesMarkInitOption {
  /** theme spec */
  themeSpec?: any;

  /** mark spec */
  markSpec?: any;

  /** 是否在编译时更新实际数据 */
  skipBeforeLayouted?: boolean;

  /** 父级 mark（如果是 undefined 则默认是系列的 root mark，如果是 false 则不配置父级 mark） */
  parent?: IGroupMark | false;

  /** 是否是 series field 所作用的 mark（用于 tooltip shape 取色等） */
  isSeriesMark?: boolean;

  /** 该 mark 依赖于哪些语法元素 */
  depend?: IGrammarItem | IGrammarItem[];

  /** 数据 key 值 */
  key?: string;

  /** 分组 key 值 */
  groupKey?: string;

  /** morph 配置开关 */
  morph?: boolean;

  /** morph元素的唯一key */
  defaultMorphElementKey?: string;

  /** 绑定系列数据（如果是 undefined 则默认是系列的 data，如果是 false 则不配置数据） */
  dataView?: DataView | false;
  /** 系列数据编译产物的名称 */
  dataProductId?: string;
  /** mark scale 如果需要使用统计信息设置domain的话，使用的统计数据 */
  dataStatistics?: DataView;

  /** 渐进渲染相关配置 */
  progressive?: IMarkProgressiveConfig;

  /** 标签spec */
  label?: ILabelSpec;

  /** 是否支持 3d */
  support3d?: boolean;
}

export interface ISeriesMarkInfo extends IModelMarkInfo {
  /** mark 名称 */
  name: SeriesMarkNameEnum | string;
}

export enum SeriesMarkNameEnum {
  label = 'label',
  point = 'point',
  line = 'line',
  area = 'area',
  bar = 'bar',
  bar3d = 'bar3d',
  boxPlot = 'boxPlot',
  outlier = 'outlier',
  circlePacking = 'circlePacking',
  group = 'group',
  gridBackground = 'gridBackground',
  grid = 'grid',
  dot = 'dot',
  title = 'title',
  subTitle = 'subTitle',
  symbol = 'symbol',
  funnel = 'funnel',
  funnel3d = 'funnel3d',
  transform = 'transform',
  transform3d = 'transform3d',
  transformLabel = 'transformLabel',
  outerLabel = 'outerLabel',
  outerLabelLine = 'outerLabelLine',
  pin = 'pin',
  pinBackground = 'pinBackground',
  pointer = 'pointer',
  segment = 'segment',
  track = 'track',
  cell = 'cell',
  cellBackground = 'cellBackground',
  link = 'link',
  arrow = 'arrow',
  pie = 'pie',
  pie3d = 'pie3d',
  labelLine = 'labelLine',
  progress = 'progress',
  minLabel = 'minLabel',
  maxLabel = 'maxLabel',
  rose = 'rose',
  node = 'node',
  sunburst = 'sunburst',
  nonLeaf = 'nonLeaf',
  leaf = 'leaf',
  nonLeafLabel = 'nonLeafLabel',
  leaderLine = 'leaderLine',
  stackLabel = 'stackLabel',
  word = 'word',
  fillingWord = 'fillingWord'
}

export type SeriesMarkMap = Partial<Record<SeriesMarkNameEnum, ISeriesMarkInfo>>;
