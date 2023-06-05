import type { ITooltipHandlerSpec } from '../../component/tooltip/interface';
import type { IDimensionData, IDimensionInfo } from '../../event/events/dimension/interface';

export interface ITooltipHandler extends ITooltipHandlerSpec {
  visible?: boolean;

  getTooltipContainer?: () => any;
}

export type TooltipData = IDimensionInfo[] | IDimensionData[];

export type TooltipActiveType = 'mark' | 'dimension';
