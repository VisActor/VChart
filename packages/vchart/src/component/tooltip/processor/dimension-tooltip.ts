import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
import type { DimensionTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
import { isEmptyPos } from '../utils';
import { isNil, isValid } from '@visactor/vutils';
import type { ICartesianSeries, ISeries } from '../../../series/interface';
import { getCartesianDimensionInfo, getPolarDimensionInfo } from '../../../event/events/dimension/util';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';
import { TooltipHandlerType } from '../handler/constants';
import { isDiscrete } from '@visactor/vscale';

export class DimensionTooltipProcessor extends BaseTooltipProcessor {
  activeType: TooltipActiveType = 'dimension';

  /** 触发对应类型的 tooltip */
  showTooltip(info: DimensionTooltipInfo, params: BaseEventParams, changePositionOnly: boolean) {
    const newParams: TooltipHandlerParams = {
      ...params,
      dimensionInfo: this._preprocessDimensionInfo(info),
      changePositionOnly
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
    let targetDimensionInfo: DimensionTooltipInfo | undefined;
    let ignore: boolean | undefined;

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
            return axis.orient === 'left' || axis.orient === 'right'; // 维度轴为Y轴时，选择只显示Y轴tooltip
          }
          return axis.orient === 'bottom' || axis.orient === 'top'; // 维度轴为X轴时，选择只显示X轴tooltip
        })[0] ?? targetDimensionInfo[0];
      targetDimensionInfo = [dimensionAxisInfo];
    }
    // 排除被声明要忽略的项
    if (
      [...((this.component.getOption() as any).getAllSeries() ?? [])].some(model => {
        const ignoreTriggers = model.tooltipHelper?.ignoreTriggerSet.dimension;
        return (params.model && ignoreTriggers?.has(params.model)) || (params.mark && ignoreTriggers?.has(params.mark));
      })
    ) {
      ignore = true;
    }

    return {
      tooltipInfo: targetDimensionInfo,
      ignore
    };
  }

  private _preprocessDimensionInfo(dimensionInfo?: DimensionTooltipInfo): DimensionTooltipInfo | undefined {
    const newDimensionInfo: DimensionTooltipInfo = [];
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
}
