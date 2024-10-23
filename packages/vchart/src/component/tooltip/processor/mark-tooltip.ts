import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType } from '../../../typings';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
import type { MarkTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
import type { ISeries } from '../../../series/interface';
import { IContainPointMode } from '@visactor/vrender-core';
import type { IDimensionData } from '../../../event/events/dimension/interface';

export class MarkTooltipProcessor extends BaseTooltipProcessor {
  activeType: TooltipActiveType = 'mark';

  /** 触发对应类型的 tooltip */
  showTooltip(info: MarkTooltipInfo, params: BaseEventParams, changePositionOnly: boolean) {
    const { datum, series } = info;
    const tooltipSpec = this.component.getSpec();
    const tooltipData = [{ datum: [datum], series }];
    const helper = series.tooltipHelper;
    const seriesSpec = series.getSpec()?.tooltip as ITooltipSpec;
    const seriesCheckOverlap = seriesSpec?.mark?.checkOverlap;
    let checkOverlap = false;

    if (seriesCheckOverlap === true || (tooltipSpec.mark?.checkOverlap === true && seriesCheckOverlap !== false)) {
      const activeTriggers = helper?.activeTriggerSet.mark;

      if (activeTriggers) {
        checkOverlap = true;
        const chart = this.component.getChart();
        // compute layer offset
        const layer = chart.getCompiler().getStage().getLayer(undefined);
        const point = { x: params.event.viewX, y: params.event.viewY };
        layer.globalTransMatrix.transformPoint({ x: params.event.viewX, y: params.event.viewY }, point);

        activeTriggers.forEach(mark => {
          mark.getProductElements().forEach(el => {
            const graphic = el.getGraphicItem();

            if (
              el !== params.item &&
              graphic &&
              graphic.containsPoint(point.x, point.y, IContainPointMode.GLOBAL, graphic.stage.getPickerService())
            ) {
              tooltipData[0].datum.push(el.getDatum());
            }
          });
        });
      }
    }

    const newParams: TooltipHandlerParams = {
      ...(params as any),
      changePositionOnly,
      tooltip: this.component
    };
    if (changePositionOnly && checkOverlap) {
      const cacheData = this._cacheActiveSpec && this._cacheActiveSpec.data;

      if (
        !cacheData ||
        (cacheData as IDimensionData[])[0].series !== tooltipData[0].series ||
        (cacheData as IDimensionData[])[0].datum.length !== tooltipData[0].datum.length ||
        (cacheData as IDimensionData[])[0].datum.some((d, index) => d !== tooltipData[0].datum[index])
      ) {
        newParams.changePositionOnly = false;
      }
    }
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
