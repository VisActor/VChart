import type { ITooltipPattern, TooltipActiveType, TooltipData } from '../../../typings';
import type { ISeries } from '../../../series/interface';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';
import { isValid } from '@visactor/vutils';
import type { ITooltipSpec } from '..';
import { combinePattern, isActiveTypeVisible } from './common';

export const getTooltipSpecForShow = (
  activeType: TooltipActiveType,
  globalSpec: ITooltipSpec,
  series?: ISeries,
  data?: TooltipData
): ITooltipSpec => {
  // 组装tooltip spec
  const finalSpec = {
    activeType
  } as ITooltipSpec;

  switch (activeType) {
    case 'mark':
    case 'group':
      if (series) {
        // tooltip spec覆盖优先级: series spec > global spec > default pattern
        const seriesSpec = series.getSpec()?.tooltip as ITooltipSpec;

        finalSpec.visible = true;

        if (seriesSpec?.handler) {
          // 优先使用自定义handler
          finalSpec.handler = seriesSpec.handler;
        }
        if (finalSpec.handler?.showTooltip) {
          return finalSpec;
        }

        finalSpec[activeType] = series.tooltipHelper.getTooltipPattern(activeType, globalSpec, data);
      }
      break;
    case 'dimension':
      if ((data as IDimensionInfo[])?.length) {
        // tooltip spec覆盖优先级: series spec > global spec > default pattern
        const seriesList = getSeriesListFromDimensionInfo(data as IDimensionInfo[]);

        // visible
        if (seriesList.every(series => !isActiveTypeVisible('dimension', series.tooltipHelper?.spec))) {
          finalSpec.visible = false;
        } else {
          finalSpec.visible = true;
        }

        // 优先使用自定义handler
        finalSpec.handler = globalSpec.handler;
        if (finalSpec.handler?.showTooltip) {
          return finalSpec;
        }

        const patternList: ITooltipPattern[] = [];
        (data as IDimensionInfo[]).forEach(info =>
          info.data.forEach(datum => {
            const { series } = datum;
            const mockDimensionInfo = [
              {
                ...info,
                data: [datum]
              }
            ] as IDimensionInfo[];
            const pattern = series.tooltipHelper.getTooltipPattern(activeType, globalSpec, mockDimensionInfo);
            if (pattern) {
              patternList.push(pattern);
            }
          })
        );

        finalSpec[activeType] = combinePattern(patternList);
      }
      break;
  }

  return finalSpec;
};

const getSeriesListFromDimensionInfo = (dimensionInfo: IDimensionInfo[]): ISeries[] => {
  const list: ISeries[] = [];
  dimensionInfo.forEach(info => {
    info.data.forEach(datum => {
      if (isValid(datum.series)) {
        list.push(datum.series);
      }
    });
  });

  return list;
};
