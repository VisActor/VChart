import { isValid } from '@visactor/vutils';
import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface/common';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';
import { ChartEvent } from '../../../constant';
import type { TooltipEventParams } from '../interface/event';
import type { IDimensionInfo } from '../../../event/events/dimension';
import { getPolarDimensionInfo } from '../../../event/events/dimension/util/polar';
import { getCartesianDimensionInfo } from '../../../event/events/dimension/util/cartesian';
import { isDiscrete } from '@visactor/vscale';
import type { ICartesianSeries } from '../../../series/interface';

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

  protected _preprocessDimensionInfo(dimensionInfo?: IDimensionInfo[]): IDimensionInfo[] | undefined {
    const newDimensionInfo: IDimensionInfo[] = [];
    dimensionInfo?.forEach(info => {
      const di: IDimensionInfo = {
        ...info,
        data: info.data.filter(
          ({ series }: any) => series.getSpec()?.tooltip?.visible !== false // 过滤掉不需要显示的维度数据
        )
      };
      if (di.data.length > 0) {
        newDimensionInfo.push(di);
      }
    });
    if (newDimensionInfo.length > 0) {
      return newDimensionInfo;
    }
    return undefined;
  }

  protected _getDimensionInfo(params: BaseEventParams): IDimensionInfo[] {
    let targetDimensionInfo: IDimensionInfo[] | undefined;

    // 处理dimension info
    const x = (params.event as any).viewX;
    const y = (params.event as any).viewY;
    const chart = this.component.getChart();
    const pos = { x, y };
    targetDimensionInfo = [
      ...(getCartesianDimensionInfo(chart, pos) ?? []),
      ...(getPolarDimensionInfo(chart, pos) ?? [])
    ];
    if (targetDimensionInfo.length === 0) {
      targetDimensionInfo = undefined;
    } else if (targetDimensionInfo.length > 1) {
      // 只保留一个轴的dimension info
      const dimensionAxisInfo =
        targetDimensionInfo.filter(info => {
          const axis = info.axis;
          // 优先显示离散轴 tooltip
          if (!isDiscrete(axis.getScale().type)) {
            return false;
          }
          // 下面的逻辑用来判断当前的离散轴是不是维度轴
          let firstSeries: ICartesianSeries | undefined;
          for (const region of axis?.getRegions() ?? []) {
            for (const series of region.getSeries()) {
              if (series.coordinate === 'cartesian') {
                firstSeries = series as ICartesianSeries;
                break;
              }
            }
            if (isValid(firstSeries)) {
              break;
            }
          }
          if (isValid(firstSeries) && firstSeries.getDimensionField()[0] === firstSeries.fieldY[0]) {
            return axis.getOrient() === 'left' || axis.getOrient() === 'right'; // 维度轴为Y轴时，选择只显示Y轴tooltip
          }
          return axis.getOrient() === 'bottom' || axis.getOrient() === 'top'; // 维度轴为X轴时，选择只显示X轴tooltip
        })[0] ?? targetDimensionInfo[0];
      targetDimensionInfo = [dimensionAxisInfo];
    }

    return targetDimensionInfo;
  }
}
