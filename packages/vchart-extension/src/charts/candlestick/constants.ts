import { PREFIX } from '@visactor/vchart';

export const CandlestickType = 'candlestick' as const;

export enum CANDLESTICK_TOOLTIP_KEYS {
  OPEN = 'open',
  CLOSE = 'close',
  HIGH = 'high',
  LOW = 'low'
}

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

export const VCHART_CANDLESTICK_STATE = `${PREFIX}_CANDLESTICK_STATE` as const;
