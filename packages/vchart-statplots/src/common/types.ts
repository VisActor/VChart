/** 显示区间的统计含义；数值由计算端提供。 */
export type Interval =
  | { kind: 'confidence' | 'prediction' | 'credible'; level: number }
  | { kind: 'standardError' | 'standardDeviation'; multiplier: number }
  | { kind: 'range' };

/** 六位不透明 RGB 色号。
 * @pattern ^#[0-9a-fA-F]{6}$
 */
export type HexColor = string;
/** @minItems 1
 * @items.type string
 * @items.pattern ^#[0-9a-fA-F]{6}$
 */
export type CategoricalColorList = HexColor[];
/** @minItems 2
 * @items.type string
 * @items.pattern ^#[0-9a-fA-F]{6}$
 */
export type SequentialColorList = HexColor[];
/** @minItems 3
 * @items.type string
 * @items.pattern ^#[0-9a-fA-F]{6}$
 */
export type DivergingColorList = HexColor[];

/** 全图共用的颜色角色；省略时使用各角色默认色板。 */
export interface StatPlotColors {
  /** 无序分组，默认 colorblind；vchart 使用原生主题分类色。 */
  categorical?: 'colorblind' | 'deep' | 'vchart' | CategoricalColorList;
  /** 从低到高，默认 viridis；数组停靠点等距。 */
  sequential?: 'viridis' | 'cividis' | SequentialColorList;
  /** 从负到正，默认 RdBu_r（蓝→浅色→红）；数组中点对应统计中心。 */
  diverging?: 'RdBu_r' | DivergingColorList;
}

export interface BaseSpec {
  /** 图表标题。 */
  title?: string;
  /** 数据范围或统计方法说明。 */
  description?: string;
  theme?: 'light' | 'dark';
  colors?: StatPlotColors;
}

export interface SeriesRow {
  /** 同一数据表要么全部提供系列名称，要么全部省略。 */
  series?: string;
}

export interface StatPlotIssue {
  code:
    | 'SCHEMA_ERROR'
    | 'INVALID_RANGE'
    | 'INVALID_ORDER'
    | 'DUPLICATE_KEY'
    | 'INCONSISTENT_SERIES'
    | 'UNSUPPORTED_COMBINATION';
  /** JSON Pointer，指向有问题的输入字段。 */
  path: string;
  message: string;
}

export type ValidationResult = { valid: true; errors: [] } | { valid: false; errors: StatPlotIssue[] };
