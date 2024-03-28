import type { BaseEventParams } from '../../../event/interface';
import type { Datum, IGroupTooltipPattern, TooltipActiveType } from '../../../typings';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
import type { DimensionTooltipInfo, GroupTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
import { array, isNil } from '@visactor/vutils';
import type { ISeries } from '../../../series/interface';

export class GroupTooltipProcessor extends BaseTooltipProcessor {
  activeType: TooltipActiveType = 'group';

  /** 触发对应类型的 tooltip */
  showTooltip(info: GroupTooltipInfo, params: BaseEventParams, changePositionOnly: boolean) {
    const { datum, series, dimensionInfo } = info;
    const tooltipData = [{ datum: array(datum), series }];
    const newParams: TooltipHandlerParams = {
      ...(params as any),
      groupDatum: this._getGroupDatum(params),
      dimensionInfo: this._preprocessDimensionInfo(dimensionInfo),
      changePositionOnly,
      tooltip: this.component
    };
    return this._showTooltipByHandler(tooltipData, newParams);
  }

  /** 判断是否应该触发 tooltip */
  shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean {
    const { tooltipInfo: info } = mouseEventData;
    if (isNil(info)) {
      return false;
    }

    const helper = (params.model as ISeries)?.tooltipHelper;
    if (!helper?.activeType.includes('group')) {
      return false;
    }
    return true;
  }

  /** 获取触发 tooltip 需要的信息 */
  getMouseEventData(params: BaseEventParams, dimensionInfo?: DimensionTooltipInfo): MouseEventData {
    let info: GroupTooltipInfo | undefined;
    let ignore: boolean | undefined;

    // 处理mark info
    if (params.model?.modelType === 'series') {
      const series = params.model as ISeries;
      const helper = series.tooltipHelper;
      const activeTriggers = helper?.activeTriggerSet.group;
      const ignoreTriggers = helper?.ignoreTriggerSet.group;

      if (activeTriggers?.has(params.model) || activeTriggers?.has(params.mark)) {
        const patternSpec: IGroupTooltipPattern = (this.component.getSpec() as ITooltipSpec)[this.activeType];
        const triggerMark = patternSpec?.triggerMark ? array(patternSpec.triggerMark) : [];
        if (triggerMark.includes(params.mark?.name as any)) {
          info = {
            mark: params.mark,
            datum: params.datum,
            series,
            dimensionInfo
          };
        }
      } else if (ignoreTriggers?.has(params.model) || ignoreTriggers?.has(params.mark)) {
        ignore = true;
      }
    }

    return {
      tooltipInfo: info,
      ignore
    };
  }

  protected _getGroupDatum(params: BaseEventParams) {
    const { model, mark, datum } = params;
    const series = model as ISeries;
    if (['line', 'area'].includes(mark.type)) {
      return array(datum);
    }

    const datumList = series.getViewData().latestData;
    const seriesField = series.getSeriesField();
    if (!seriesField) {
      return datumList;
    }

    const seriesFieldValue = array(datum)[0][seriesField];
    return datumList.filter((d: Datum) => d[seriesField] === seriesFieldValue);
  }
}
