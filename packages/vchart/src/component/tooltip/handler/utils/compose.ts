import { isValid, isNil, array } from '@visactor/vutils';
import type { TooltipActualTitleContent } from '../../tooltip';
import type {
  IToolTipLinePattern,
  ITooltipPattern,
  TooltipData,
  IToolTipLineActual
} from '../../../../typings/tooltip';
import { getFirstDatumFromTooltipData, getTooltipContentValue, getTooltipPatternValue } from './common';
import { getTooltipActualActiveType } from '../../utils/common';
import type { IDimensionData, IDimensionInfo } from '../../../../event/events/dimension/interface';
import type { TooltipHandlerParams } from '../../interface';
import { TOOLTIP_MAX_LINE_COUNT, TOOLTIP_OTHERS_LINE } from '../constants';

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
): TooltipActualTitleContent | null => {
  if (
    !data ||
    // data.key === undefined ||
    params?.event?.type === 'mouseout'
  ) {
    return null;
  }

  const patternTitle = getTooltipPatternValue(pattern.title, data, params);
  const patternContent = array(getTooltipPatternValue(pattern.content, data, params));

  const tooltipContent: Required<TooltipActualTitleContent> = {
    title: {
      value: patternTitle?.value?.toString(),
      hasShape: false,
      shapeType: undefined,
      shapeHollow: undefined
    },
    content: []
  };

  const { maxLineCount = TOOLTIP_MAX_LINE_COUNT } = pattern;

  /** title */
  const patternTitleVisible = getTooltipContentValue(patternTitle?.visible, data, params) !== false;
  if (!patternTitle || !patternTitleVisible) {
    tooltipContent.title = {
      hasShape: false,
      visible: false
    };
  } else {
    // 找到第一个可用的datum
    const datum = getFirstDatumFromTooltipData(data);
    tooltipContent.title = {
      value: getTooltipContentValue(patternTitle?.value, datum, params),
      valueStyle: getTooltipContentValue(patternTitle?.valueStyle, datum, params),
      hasShape: patternTitle.hasShape
    };
  }

  /** content */
  if (pattern.activeType === 'mark') {
    for (const content of patternContent ?? []) {
      const oneLineData = getOneLineData((data as IDimensionData[])[0]?.datum[0], content, params);
      if (oneLineData.visible !== false) {
        if (tooltipContent.content.length === maxLineCount - 1) {
          tooltipContent.content.push({
            ...oneLineData,
            ...TOOLTIP_OTHERS_LINE
          });
          break;
        } else if (tooltipContent.content.length < maxLineCount) {
          tooltipContent.content.push(oneLineData);
        } else {
          break;
        }
      }
    }
  } else if (pattern.activeType === 'dimension') {
    for (const { data: d } of data as IDimensionInfo[]) {
      for (const { datum, series } of d) {
        if (!getTooltipActualActiveType(series.tooltipHelper?.spec).includes('dimension')) {
          continue;
        }
        const contentPatterns =
          patternContent?.filter(
            c => isNil(c.seriesId) || c.seriesId === series.id // 匹配对应series
          ) ?? [];
        for (const datumItem of datum) {
          for (const linePattern of contentPatterns) {
            const oneLineData = getOneLineData(datumItem, linePattern, params);
            if (oneLineData.visible === false) {
              continue;
            }
            if (tooltipContent.content.length === maxLineCount - 1) {
              tooltipContent.content.push({
                ...oneLineData,
                ...TOOLTIP_OTHERS_LINE
              });
              break;
            } else if (tooltipContent.content.length < maxLineCount) {
              tooltipContent.content.push(oneLineData);
            } else {
              break;
            }
          }
          if (tooltipContent.content.length >= maxLineCount) {
            break;
          }
        }
        if (tooltipContent.content.length >= maxLineCount) {
          break;
        }
      }
      if (tooltipContent.content.length >= maxLineCount) {
        break;
      }
    }
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
  const visible: boolean =
    getTooltipContentValue(config.visible, datum, params) !== false && (isValid(key) || isValid(value));
  const isKeyAdaptive = getTooltipContentValue(config.isKeyAdaptive, datum, params);
  const spaceRow = getTooltipContentValue(config.spaceRow, datum, params);

  const shapeType = getTooltipContentValue(config.shapeType, datum, params);
  const shapeColor = getTooltipContentValue(config.shapeColor, datum, params);
  const shapeFill = getTooltipContentValue(config.shapeFill, datum, params);
  const shapeStroke = getTooltipContentValue(config.shapeStroke, datum, params);
  const shapeLineWidth = getTooltipContentValue(config.shapeLineWidth, datum, params);
  const keyStyle = getTooltipContentValue(config.keyStyle, datum, params);
  const valueStyle = getTooltipContentValue(config.valueStyle, datum, params);

  return {
    key,
    value,
    visible,
    isKeyAdaptive,
    hasShape: config.hasShape,
    shapeType: shapeType as any,
    shapeFill,
    shapeStroke,
    shapeLineWidth,
    shapeHollow: config.shapeHollow,
    shapeColor,
    keyStyle,
    valueStyle,
    spaceRow,
    datum
  };
};
