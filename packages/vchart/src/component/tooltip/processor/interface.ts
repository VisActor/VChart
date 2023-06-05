import type { Datum } from '@visactor/vgrammar';
import type { IMark } from '../../../mark/interface';
import type { ISeries } from '../../../series/interface';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';

export type DimensionTooltipInfo = IDimensionInfo[];

export type MarkTooltipInfo = {
  datum: Datum;
  mark: IMark;
  series: ISeries;
};

export type TooltipInfo = DimensionTooltipInfo | MarkTooltipInfo;

export type MouseEventData = {
  /** 展示 tooltip 需要的信息 */
  tooltipInfo: TooltipInfo;
  /** 是否忽略该 tooltip */
  ignore: boolean;
};
