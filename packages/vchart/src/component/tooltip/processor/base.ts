import { isNil, isValid } from '@visactor/vutils';
import type { BaseEventParams } from '../../../event/interface';
import type { ITooltipActual, ITooltipPattern, TooltipActiveType, TooltipData } from '../../../typings';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface/common';
import type { Tooltip } from '../tooltip';
import type { DimensionTooltipInfo, MouseEventData, TooltipInfo } from './interface';
import { ChartEvent } from '../../../constant';
import type { TooltipEventParams } from '../interface/event';
import type { IDimensionData, IDimensionInfo } from '../../../event/events/dimension';
import { getPolarDimensionInfo } from '../../../event/events/dimension/util/polar';
import { getCartesianDimensionInfo } from '../../../event/events/dimension/util/cartesian';
import { isDiscrete } from '@visactor/vscale';
import type { ICartesianSeries, ISeries } from '../../../series/interface';
import { getTooltipSpecForShow } from '../utils/get-spec';
import { getShowContent } from '../utils/compose';
import { getTooltipPatternValue } from '../utils/get-value';

export abstract class BaseTooltipProcessor {
  readonly component: Tooltip;
  abstract activeType: TooltipActiveType;

  protected _cacheViewSpec: ITooltipSpec | undefined;
  protected _cacheActualTooltip: ITooltipActual | undefined;

  constructor(component: Tooltip) {
    this.component = component;
  }

  /** 触发对应类型的 tooltip */
  abstract showTooltip(info: TooltipInfo, params: BaseEventParams, changePositionOnly: boolean): TooltipResult;

  /** 判断是否应该触发 tooltip */
  abstract shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean;

  /** 获取触发 tooltip 需要的信息 */
  abstract getMouseEventData(params: BaseEventParams, dimensionInfo?: DimensionTooltipInfo): MouseEventData;

  protected _showTooltipByHandler = (data: TooltipData | undefined, params: TooltipHandlerParams): TooltipResult => {
    if (isNil(data)) {
      return TooltipResult.failed;
    }

    if (!params.changePositionOnly) {
      this.clearCache();
    }

    // 更新 this._cacheViewSpec
    this._updateViewSpec(params);
    const spec = this._cacheViewSpec;
    if (isNil(spec?.[this.activeType]) || spec.visible === false) {
      return TooltipResult.failed;
    }
    params.tooltipSpec = spec;

    // 更新 this._cacheActualTooltip
    this._updateActualTooltip(data, params);
    params.tooltipActual = this._cacheActualTooltip;

    // 触发事件
    this.component.event.emit(ChartEvent.tooltipShow, {
      ...params,
      tooltipData: data,
      activeType: this.activeType,
      tooltip: this.component
    } as TooltipEventParams);

    // 判断 tooltip 是否为空
    const { title, content } = this._cacheActualTooltip;
    if (isNil(title?.key) && isNil(title?.value) && !content?.length) {
      return TooltipResult.failed;
    }

    // 显示 tooltip
    let showTooltip;
    if (spec.handler?.showTooltip) {
      showTooltip = spec.handler.showTooltip.bind(spec.handler);
    } else if (this.component.tooltipHandler?.showTooltip) {
      showTooltip = this.component.tooltipHandler.showTooltip.bind(this.component.tooltipHandler);
    }
    if (showTooltip) {
      return showTooltip(this.activeType, data, params) ?? TooltipResult.success;
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
    const chart = this.component.getChart();

    // compute layer offset
    const layer = chart.getCompiler().getStage().getLayer(undefined);
    const point = { x: params.event.viewX, y: params.event.viewY };
    layer.globalTransMatrix.transformPoint({ x: params.event.viewX, y: params.event.viewY }, point);

    targetDimensionInfo = [
      ...(getCartesianDimensionInfo(chart, point, true) ?? []),
      ...(getPolarDimensionInfo(chart, point) ?? [])
    ];
    if (targetDimensionInfo.length === 0) {
      targetDimensionInfo = undefined;
    } else if (targetDimensionInfo.length > 1) {
      // 只保留一个轴的dimension info
      const dimensionAxisInfo = targetDimensionInfo.filter(info => {
        const axis = info.axis;
        if (axis.getSpec().hasDimensionTooltip) {
          return true;
        }

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
          // 维度轴为Y轴时，选择只显示Y轴tooltip
          return axis.getOrient() === 'left' || axis.getOrient() === 'right';
        }
        // 维度轴为X轴时，选择只显示X轴tooltip
        return axis.getOrient() === 'bottom' || axis.getOrient() === 'top';
      });
      targetDimensionInfo = dimensionAxisInfo.length ? dimensionAxisInfo : targetDimensionInfo.slice(0, 1);

      // datum 去重，保证每个系列的每个数据项只对应于一行 tooltip 内容项
      if (targetDimensionInfo.length > 1) {
        const dimensionDataKeySet = new Set<string>();
        targetDimensionInfo.forEach(info => {
          info.data = info.data.filter(({ key }: IDimensionData) => {
            if (dimensionDataKeySet.has(key)) {
              return false;
            }
            dimensionDataKeySet.add(key);
            return true;
          });
        });
      }
    }

    return targetDimensionInfo;
  }

  /**
   * 合成实际显示的 tooltip spec
   * @param params
   */
  protected _updateViewSpec(params: TooltipHandlerParams) {
    const { changePositionOnly, model, dimensionInfo } = params;
    if (!changePositionOnly || !this._cacheViewSpec) {
      /** spec 预处理 */
      this._cacheViewSpec = getTooltipSpecForShow(
        this.activeType,
        this.component.getSpec(),
        model as ISeries,
        dimensionInfo
      );
    }
  }

  /**
   * 合成 tooltip 内容
   * @param data
   * @param params
   * @param changePositionOnly
   */
  protected _updateActualTooltip(data: TooltipData, params: TooltipHandlerParams) {
    const pattern = this._cacheViewSpec[this.activeType] as ITooltipPattern;
    const { changePositionOnly } = params;

    if (!changePositionOnly || !this._cacheActualTooltip) {
      // 合成 tooltip 内容
      const tooltipContent = getShowContent(pattern, data, params);

      // 判断可见性
      const visible = isValid(tooltipContent) ? getTooltipPatternValue(pattern.visible, data, params) !== false : false; // 最终展示数据为 null 则不展示

      this._cacheActualTooltip = {
        ...tooltipContent,
        visible,
        activeType: pattern.activeType,
        data
      };

      const { title, content } = this._cacheActualTooltip;
      this._cacheActualTooltip.title = pattern.updateTitle?.(title, data, params) ?? title;
      this._cacheActualTooltip.content = pattern.updateContent?.(content, data, params) ?? content;
    }
  }

  clearCache() {
    this._cacheViewSpec = undefined;
    this._cacheActualTooltip = undefined;
  }
}
