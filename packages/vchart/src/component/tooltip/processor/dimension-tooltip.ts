import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
import type { DimensionTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
import { isNil } from '@visactor/vutils';
import type { ISeries } from '../../../series/interface';

export class DimensionTooltipProcessor extends BaseTooltipProcessor {
  activeType: TooltipActiveType = 'dimension';

  /** 触发对应类型的 tooltip */
  showTooltip(info: DimensionTooltipInfo, params: BaseEventParams, changePositionOnly: boolean) {
    const newParams: TooltipHandlerParams = {
      ...(params as TooltipHandlerParams),
      dimensionInfo: this._preprocessDimensionInfo(info),
      changePositionOnly,
      tooltip: this.component
    };
    return this._showTooltipByHandler(info, newParams);
  }

  /** 判断是否应该触发 tooltip */
  shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean {
    const { tooltipInfo: info } = mouseEventData;
    if (isNil(info)) {
      return false;
    }

    const helper = (params.model as ISeries)?.tooltipHelper;
    const activeType = helper?.activeType ?? this.component.getSpec().activeType;
    if (!activeType.includes('dimension')) {
      return false;
    }
    return true;
  }

  /** 获取触发 tooltip 需要的信息 */
  getMouseEventData(params: BaseEventParams): MouseEventData {
    return {
      tooltipInfo: this._getDimensionInfo(params),
      // 排除被声明要忽略的项
      ignore: [...((this.component.getOption() as any).getAllSeries() ?? [])].some(model => {
        const ignoreTriggers = model.tooltipHelper?.ignoreTriggerSet.dimension;
        return (params.model && ignoreTriggers?.has(params.model)) || (params.mark && ignoreTriggers?.has(params.mark));
      })
    };
  }
}
