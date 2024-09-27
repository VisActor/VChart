import { isNil, isValid } from '@visactor/vutils';
import type { BaseEventParams } from '../../../event/interface';
import type { ITooltipActual, ITooltipPattern, TooltipActiveType, TooltipData } from '../../../typings';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface/common';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';
import { ChartEvent } from '../../../constant/event';
import type { TooltipEventParams } from '../interface/event';
import type { IDimensionInfo } from '../../../event/events/dimension';
import type { ISeries } from '../../../series/interface';
import { getTooltipSpecForShow } from '../utils/get-spec';
import { getShowContent } from '../utils/compose';
import { getTooltipPatternValue } from '../utils/get-value';
import { isActiveTypeVisible } from '../utils/common';

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
  /** 获取触发 tooltip 需要的信息 */
  abstract getMouseEventData(params: BaseEventParams): MouseEventData;

  protected _showTooltipByHandler = (data: TooltipData | undefined, params: TooltipHandlerParams): TooltipResult => {
    if (isNil(data)) {
      return TooltipResult.failed;
    }

    if (!params.changePositionOnly) {
      this.clearCache();
    }

    // 更新 this._cacheViewSpec
    this._updateViewSpec(data, params);
    const spec = this._cacheViewSpec;
    if (isNil(spec?.[this.activeType]) || spec.visible === false) {
      return TooltipResult.failed;
    }
    params.tooltipSpec = this.component.getSpec();
    params.activeTooltipSpec = spec;

    // 更新 this._cacheActualTooltip
    this._updateActualTooltip(data, params);
    params.tooltipActual = this._cacheActualTooltip;

    // 判断 tooltip 是否为空
    const { title, content } = this._cacheActualTooltip;

    const isEmpty = isNil(title?.key) && isNil(title?.value) && !content?.length;
    // 触发事件
    this.component.event.emit(ChartEvent.tooltipShow, {
      ...params,
      isEmptyTooltip: isNil(title?.key) && isNil(title?.value) && !content?.length,
      tooltipData: data,
      activeType: this.activeType,
      tooltip: this.component
    } as TooltipEventParams);

    if (isEmpty) {
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

  /**
   * 合成实际显示的 tooltip spec
   * @param params
   */
  protected _updateViewSpec(data: TooltipData, params: TooltipHandlerParams) {
    const { changePositionOnly, model } = params;
    if (!changePositionOnly || !this._cacheViewSpec) {
      /** spec 预处理 */
      this._cacheViewSpec = getTooltipSpecForShow(this.activeType, this.component.getSpec(), model as ISeries, data);
    }
  }

  /**
   * 合成 tooltip 内容
   * @param data
   * @param params
   * @param changePositionOnly
   */
  protected _updateActualTooltip(data: TooltipData, params: TooltipHandlerParams) {
    const pattern = this._cacheViewSpec[this.activeType] ?? (params.tooltipSpec?.[this.activeType] as ITooltipPattern);
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
      const updateTitle =
        this._cacheViewSpec[this.activeType]?.updateTitle ?? params.tooltipSpec?.[this.activeType]?.updateTitle;

      if (updateTitle) {
        const prevTitle = this._cacheActualTooltip.title;
        this._cacheActualTooltip.title = updateTitle(prevTitle, data, params) ?? prevTitle;
      }
      const updateContent =
        this._cacheViewSpec[this.activeType]?.updateContent ?? params.tooltipSpec?.[this.activeType]?.updateContent;
      if (updateContent) {
        const prevContent = this._cacheActualTooltip.content;
        this._cacheActualTooltip.content = updateContent?.(prevContent, data, params) ?? prevContent;
      }
    }
  }

  /** 判断是否应该触发 tooltip */
  shouldHandleTooltip(params: BaseEventParams, info: TooltipInfo): boolean {
    if (isNil(info)) {
      return false;
    }

    return isActiveTypeVisible(this.activeType, (params.model as ISeries)?.tooltipHelper?.spec);
  }

  clearCache() {
    this._cacheViewSpec = undefined;
    this._cacheActualTooltip = undefined;
  }
}
