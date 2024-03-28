import { isValid, isNil, TimeUtil } from '@visactor/vutils';
import type { ITooltipLinePattern, ITooltipPattern, TooltipData, ITooltipLineActual } from '../../../typings/tooltip';
import {
  getFirstDatumFromTooltipData,
  getTooltipContentPattern,
  getTooltipContentValue,
  getTooltipPatternValue
} from './get-value';
import type { IDimensionData, IDimensionInfo } from '../../../event';
import { TOOLTIP_MAX_LINE_COUNT, TOOLTIP_OTHERS_LINE } from '../constant';
import { getTooltipActualActiveType } from '.';
import type { TooltipActualTitleContent, TooltipHandlerParams } from '..';
import type { Datum } from '../../../typings';

const getTimeString = (value: any, timeFormat?: string, timeFormatMode?: 'local' | 'utc') => {
  if (!timeFormat && !timeFormatMode) {
    if (typeof value !== 'object') {
      return value?.toString();
    }
    return value;
  }

  const timeUtil = TimeUtil.getInstance();
  timeFormat = timeFormat || '%Y%m%d';
  timeFormatMode = timeFormatMode || 'local';
  const timeFormatter = timeFormatMode === 'local' ? timeUtil.timeFormat : timeUtil.timeUTCFormat;
  return timeFormatter(timeFormat, value);
};

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

  const tooltipActualTitleContent: Required<TooltipActualTitleContent> = {
    title: {},
    content: []
  };

  /** title */
  const patternTitle = getTooltipPatternValue(pattern.title, data, params);
  const { visible, value, valueTimeFormat, valueTimeFormatMode, valueStyle, hasShape, valueFormatter } =
    patternTitle ?? {};
  const patternTitleVisible = getTooltipContentValue(visible, data, params) !== false;

  if (!patternTitle || !patternTitleVisible) {
    tooltipActualTitleContent.title = {
      hasShape: false,
      visible: false
    };
  } else {
    // 找到第一个可用的datum
    const datum = getFirstDatumFromTooltipData(data);
    tooltipActualTitleContent.title = {
      value: getTimeString(
        getTooltipContentValue(value, datum, params, valueFormatter),
        valueTimeFormat,
        valueTimeFormatMode
      ),
      valueStyle: getTooltipContentValue(valueStyle, datum, params),
      hasShape
    };
  }

  /** content */
  const patternContent = getTooltipContentPattern(pattern.content, data, params);
  const { maxLineCount = TOOLTIP_MAX_LINE_COUNT } = pattern;

  const getTooltipContentFromDatumList = (datumList?: Datum[]) => {
    if (datumList?.length) {
      for (const datum of datumList) {
        for (const content of patternContent ?? []) {
          const oneLineData = getOneLineData(datum, content, params);
          if (oneLineData.visible !== false) {
            if (tooltipActualTitleContent.content.length === maxLineCount - 1) {
              tooltipActualTitleContent.content.push({
                ...oneLineData,
                ...TOOLTIP_OTHERS_LINE
              });
              break;
            } else if (tooltipActualTitleContent.content.length < maxLineCount) {
              tooltipActualTitleContent.content.push(oneLineData);
            } else {
              break;
            }
          }
        }
      }
    }
  };

  switch (pattern.activeType) {
    case 'mark':
      getTooltipContentFromDatumList((data as IDimensionData[])[0]?.datum);
      break;
    case 'group':
      getTooltipContentFromDatumList(params.groupDatum);
      break;
    case 'dimension':
      for (const { data: d } of data as IDimensionInfo[]) {
        for (const { datum: datumList, series } of d) {
          if (!getTooltipActualActiveType(series.tooltipHelper?.spec).includes('dimension')) {
            continue;
          }
          const contentPatterns =
            patternContent?.filter(
              c => isNil(c.seriesId) || c.seriesId === series.id // 匹配对应series
            ) ?? [];
          for (const datum of datumList) {
            for (const linePattern of contentPatterns) {
              const oneLineData = getOneLineData(datum, linePattern, params);
              if (oneLineData.visible === false) {
                continue;
              }
              if (tooltipActualTitleContent.content.length === maxLineCount - 1) {
                tooltipActualTitleContent.content.push({
                  ...oneLineData,
                  ...TOOLTIP_OTHERS_LINE
                });
                break;
              } else if (tooltipActualTitleContent.content.length < maxLineCount) {
                tooltipActualTitleContent.content.push(oneLineData);
              } else {
                break;
              }
            }
            if (tooltipActualTitleContent.content.length >= maxLineCount) {
              break;
            }
          }
          if (tooltipActualTitleContent.content.length >= maxLineCount) {
            break;
          }
        }
        if (tooltipActualTitleContent.content.length >= maxLineCount) {
          break;
        }
      }
      break;
  }

  if (tooltipActualTitleContent.title) {
    // TODO：对 title shape 的支持目前还不完整，尚没有相关需求
    if (tooltipActualTitleContent.content.length > 0 && tooltipActualTitleContent.content[0].shapeType) {
      if (isNil(tooltipActualTitleContent.title.shapeType)) {
        tooltipActualTitleContent.title.shapeType = tooltipActualTitleContent.content[0].shapeType;
      }
      if (isNil(tooltipActualTitleContent.title.shapeColor)) {
        tooltipActualTitleContent.title.shapeColor = tooltipActualTitleContent.content[0].shapeColor;
      }
    } else {
      tooltipActualTitleContent.title.hasShape = false;
    }
  }

  return tooltipActualTitleContent;
};

/**
 * 获得tooltip的单行实际显示内容
 * @param datum
 * @param config
 * @returns
 */
export const getOneLineData = (
  datum: any,
  config: ITooltipLinePattern,
  params: TooltipHandlerParams
): ITooltipLineActual => {
  const key = getTimeString(
    getTooltipContentValue(config.key, datum, params, config.keyFormatter),
    config.keyTimeFormat,
    config.keyTimeFormatMode
  );
  const value = getTimeString(
    getTooltipContentValue(config.value, datum, params, config.valueFormatter),
    config.valueTimeFormat,
    config.valueTimeFormatMode
  );
  const visible: boolean =
    getTooltipContentValue(config.visible, datum, params) !== false && (isValid(key) || isValid(value));
  const isKeyAdaptive = getTooltipContentValue(config.isKeyAdaptive, datum, params);
  const spaceRow = getTooltipContentValue(config.spaceRow, datum, params);

  const shapeType = getTooltipContentValue(config.shapeType, datum, params);
  const shapeColor = getTooltipContentValue(config.shapeColor, datum, params);
  const shapeFill = getTooltipContentValue(config.shapeFill, datum, params);
  const shapeStroke = getTooltipContentValue(config.shapeStroke, datum, params);
  const shapeLineWidth = getTooltipContentValue(config.shapeLineWidth, datum, params);
  const shapeHollow = getTooltipContentValue(config.shapeHollow, datum, params);
  const keyStyle = getTooltipContentValue(config.keyStyle, datum, params);
  const valueStyle = getTooltipContentValue(config.valueStyle, datum, params);

  return {
    key,
    value,
    visible,
    isKeyAdaptive,
    hasShape: config.hasShape,
    shapeType,
    shapeFill,
    shapeStroke,
    shapeLineWidth,
    shapeHollow,
    shapeColor,
    keyStyle,
    valueStyle,
    spaceRow,
    datum
  };
};
