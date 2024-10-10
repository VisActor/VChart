import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
import type { MarkTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
import type { ISeries } from '../../../series/interface';

export class MarkTooltipProcessor extends BaseTooltipProcessor {
  activeType: TooltipActiveType = 'mark';

  /** 触发对应类型的 tooltip */
  showTooltip(info: MarkTooltipInfo, params: BaseEventParams, changePositionOnly: boolean) {
    const { datum, series } = info;
    const tooltipData = [{ datum: [datum], series }];
    const newParams: TooltipHandlerParams = {
      ...(params as any),
      changePositionOnly,
      tooltip: this.component
    };
    return this._showTooltipByHandler(tooltipData, newParams);
  }

  /** 获取触发 tooltip 需要的信息 */
  getMouseEventData(params: BaseEventParams): MouseEventData {
    let info: MarkTooltipInfo | undefined;
    let ignore: boolean | undefined;

    // 处理mark info
    if (params.model?.modelType === 'series') {
      const series = params.model as ISeries;
      const helper = series.tooltipHelper;
      const activeTriggers = helper?.activeTriggerSet.mark;
      const ignoreTriggers = helper?.ignoreTriggerSet.mark;
      if (activeTriggers?.has(params.mark)) {
        info = {
          mark: params.mark,
          datum: params.datum,
          series
        };
      } else if (ignoreTriggers?.has(params.mark)) {
        ignore = true;
      }
    }

    return {
      tooltipInfo: info,
      ignore
    };
  }
}
