import { PREFIX } from '@visactor/vchart';

/** 蜡烛图标记类型 */
export const CandlestickType = 'candlestick' as const;

/** 蜡烛图工具提示关键字枚举 */
export enum CANDLESTICK_TOOLTIP_KEYS {
  /** 开盘价字段 */
  OPEN = 'open',
  /** 收盘价字段 */
  CLOSE = 'close',
  /** 最高价字段 */
  HIGH = 'high',
  /** 最低价字段 */
  LOW = 'low'
}

/** 蜡烛图样式配置项列表 */
export const CANDLESTICK_STYLE_LIST: string[] = [
  'bodySize',
  'bodyFill',
  'bodyStroke',
  'bodyLineWidth',
  'bodyOpacity',
  'bodyFillOpacity',
  'bodyStrokeOpacity',
  'shadowStroke',
  'shadowLineWidth',
  'shadowOpacity'
];

/** 蜡烛图状态属性名 */
export const VCHART_CANDLESTICK_STATE = `${PREFIX}_CANDLESTICK_STATE` as const;
