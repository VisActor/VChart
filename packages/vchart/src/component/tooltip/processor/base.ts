import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid } from '@visactor/vutils';
import type { BaseEventParams } from '../../../event/interface';
import type { ITooltipHandler, TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';

export abstract class BaseTooltipProcessor {
  readonly component: Tooltip;
  readonly tooltipHandler: Maybe<ITooltipHandler>;
  activeType: TooltipActiveType;

  constructor(component: Tooltip, handler?: ITooltipHandler) {
    this.component = component;
    this.tooltipHandler = handler;
  }

  /** 触发对应类型的 tooltip */
  abstract showTooltip(info: TooltipInfo, params: BaseEventParams, changePositionOnly: boolean): TooltipResult;

  /** 判断是否应该触发 tooltip */
  abstract shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean;

  /** 获取触发 tooltip 需要的信息 */
  abstract getMouseEventData(params: BaseEventParams): MouseEventData;

  protected _showTooltipByHandler = (data: TooltipData | undefined, params: TooltipHandlerParams): TooltipResult => {
    if (this.tooltipHandler?.showTooltip && isValid(data)) {
      return this.tooltipHandler?.showTooltip(this.activeType, data, params) ?? TooltipResult.failed;
    }
    return TooltipResult.failed;
  };
}
