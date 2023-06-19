import { isValid, isNil } from '../../../../util';
import type { TooltipContent } from '../../tooltip';
import type {
  IToolTipLinePattern,
  ITooltipPattern,
  TooltipData,
  IToolTipLineActual
} from '../../../../typings/tooltip';
import { getFirstDatumFromTooltipData, getTooltipContentValue, getTooltipPatternValue } from './common';
import { getTooltipActualActiveType } from '../../utils';
import type { IDimensionData, IDimensionInfo } from '../../../../event/events/dimension/interface';
import type { TooltipHandlerParams } from '../../interface';

/**
 * 获得tooltip的实际显示内容
 * @param pattern
 * @param data
 * @param event
 * @returns
 */
export const getShowContent = (
  pattern: ITooltipPattern,
  data: TooltipData,
  params: TooltipHandlerParams
): TooltipContent | null => {
  if (
    !data ||
    // data.key === undefined ||
    params?.event?.type === 'mouseout'
  ) {
    return null;
  }

  const patternTitle = getTooltipPatternValue(pattern.title, data, params);
  const patternContent = getTooltipPatternValue(pattern.content, data, params);

  const tooltipContent: Required<TooltipContent> = {
    title: {
      value: patternTitle?.value?.toString(),
      hasShape: false,
      shapeType: undefined,
      shapeHollow: undefined
    },
    content: []
  };

  /** title */
  if (!patternTitle || patternTitle.visible === false) {
    tooltipContent.title = {
      hasShape: false,
      visible: false
    };
  } else {
    tooltipContent.title.hasShape = patternTitle.hasShape;
    if (isValid(patternTitle.value)) {
      tooltipContent.title = {
        hasShape: patternTitle.hasShape,
        shapeHollow: patternTitle.shapeHollow
      };
      // 找到第一个可用的datum
      const datum = getFirstDatumFromTooltipData(data);
      tooltipContent.title.value = getTooltipContentValue(patternTitle?.value, datum, params);
    }
  }

  /** content */
  if (pattern.activeType === 'mark') {
    patternContent?.forEach(content => {
      const oneLineData = getOneLineData((data as IDimensionData[])[0]?.datum[0], content, params);
      if (oneLineData.visible !== false) {
        tooltipContent.content.push(oneLineData);
      }
    });
  } else if (pattern.activeType === 'dimension') {
    (data as IDimensionInfo[]).forEach(({ data: d }) =>
      d.forEach(({ datum, series }) => {
        if (!getTooltipActualActiveType(series.tooltipHelper?.spec).includes('dimension')) {
          return;
        }
        const contentPatterns =
          patternContent?.filter(
            c => isNil(c.seriesId) || c.seriesId === series.id // 匹配对应series
          ) ?? [];
        datum.forEach(datumItem =>
          contentPatterns.forEach(c => {
            const oneLineData = getOneLineData(datumItem, c, params);
            if (oneLineData.visible !== false) {
              tooltipContent.content.push(oneLineData);
            }
          })
        );
      })
    );
  }

  if (tooltipContent.title) {
    // TODO：对 title shape 的支持目前还不完整，尚没有相关需求
    if (tooltipContent.content.length > 0 && tooltipContent.content[0].shapeType) {
      if (isNil(tooltipContent.title.shapeType)) {
        tooltipContent.title.shapeType = tooltipContent.content[0].shapeType;
      }
      if (isNil(tooltipContent.title.shapeColor)) {
        tooltipContent.title.shapeColor = tooltipContent.content[0].shapeColor;
      }
    } else {
      tooltipContent.title.hasShape = false;
    }
  }

  return tooltipContent;
};

/**
 * 获得tooltip的单行实际显示内容
 * @param datum
 * @param config
 * @returns
 */
export const getOneLineData = (
  datum: any,
  config: IToolTipLinePattern,
  params: TooltipHandlerParams
): IToolTipLineActual => {
  const key = getTooltipContentValue(config.key, datum, params);
  const value = getTooltipContentValue(config.value, datum, params);
  const visible: boolean = isValid(key) || isValid(value);

  const shapeType = getTooltipContentValue(config.shapeType, datum, params);
  const shapeColor = getTooltipContentValue(config.shapeColor, datum, params);

  return {
    key,
    value,
    visible,
    hasShape: config.hasShape,
    shapeType: shapeType as any,
    shapeHollow: config.shapeHollow,
    shapeColor
  };
};
