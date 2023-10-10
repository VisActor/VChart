import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { TooltipHandlerParams } from '../../component/tooltip/interface';
import type { Datum } from '@visactor/vgrammar-core';
export declare class FunnelSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  titleValueCallback: (datum: Datum, params?: TooltipHandlerParams) => any;
  contentValueCallback: (datum: Datum, params?: TooltipHandlerParams) => any;
  contentKeyCallback: (datum: Datum, params?: TooltipHandlerParams) => any;
}
