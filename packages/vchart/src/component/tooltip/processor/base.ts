import { isValid } from '@visactor/vutils';
import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';
import { ChartEvent } from '../../../constant';
import type { TooltipEventParams } from '../interface/event';

export abstract class BaseTooltipProcessor {
  readonly component: Tooltip;
  activeType: TooltipActiveType;

  constructor(component: Tooltip) {
    this.component = component;
  }

  /** 触发对应类型的 tooltip */
  abstract showTooltip(info: TooltipInfo, params: BaseEventParams, changePositionOnly: boolean): TooltipResult;

  /** 判断是否应该触发 tooltip */
  abstract shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean;

  /** 获取触发 tooltip 需要的信息 */
  abstract getMouseEventData(params: BaseEventParams): MouseEventData;

  protected _showTooltipByHandler = (data: TooltipData | undefined, params: TooltipHandlerParams): TooltipResult => {
    this.component.event.emit(ChartEvent.tooltipShow, {
      ...params,
      tooltipData: data,
      activeType: this.activeType,
      tooltip: this.component
    } as TooltipEventParams);
    if (this.component.tooltipHandler?.showTooltip && isValid(data)) {
      return this.component.tooltipHandler.showTooltip(this.activeType, data, params) ?? TooltipResult.success;
    }
    return TooltipResult.failed;
  };
}
