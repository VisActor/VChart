import { isValid, isNil } from '../../../../util';
import type { TooltipContent } from '../../tooltip';
import type {
  IToolTipLinePattern,
  ITooltipPattern,
  TooltipData,
  IToolTipLineActual
} from '../../../../typings/tooltip';
import { getTooltipValue } from './common';
import { getTooltipActualActiveType } from '../../utils';
import type { IDimensionData, IDimensionInfo } from '../../../../event/events/dimension/interface';

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
  event: MouseEvent
): TooltipContent | null => {
  if (
    !data ||
    // data.key === undefined ||
    event.type === 'mouseout'
  ) {
    return null;
  }
  const tooltipContent: TooltipContent = {
    title: {
      value: pattern.title?.value?.toString(),
      hasShape: false,
      shapeType: undefined,
      shapeHollow: undefined
    },
    content: []
  };

  /** title */
  if (!pattern.title || pattern.title.visible === false) {
    tooltipContent.title = {
      hasShape: false,
      visible: false
    };
  } else {
    tooltipContent.title.hasShape = pattern.title.hasShape;
    if (isValid(pattern.title) && isValid(pattern.title.value)) {
      tooltipContent.title = {
        hasShape: pattern.title?.hasShape,
        shapeHollow: pattern.title?.shapeHollow
      };
      // 找到第一个可用的datum
      let datum: any;
      const dimInfoList: IDimensionInfo[] = (data as IDimensionData[])[0]?.series
        ? [{ data: data as IDimensionData[], value: '' }]
        : (data as IDimensionInfo[]);
      for (const { data: dataList } of dimInfoList) {
        for (const { datum: datumList } of dataList) {
          for (const datumItem of datumList ?? []) {
            if (datumItem) {
              datum = datumItem;
              break;
            }
          }
          if (datum) {
            break;
          }
        }
        if (datum) {
          break;
        }
      }
      tooltipContent.title.value = getTooltipValue(pattern.title?.value, datum);
    }
  }

  /** content */
  if (pattern.activeType === 'mark') {
    pattern.content?.forEach(content => {
      const oneLineData = getOneLineData((data as IDimensionData[])[0]?.datum[0], content);
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
          pattern.content?.filter(
            c => isNil(c.seriesId) || c.seriesId === series.id // 匹配对应series
          ) ?? [];
        datum.forEach(datumItem =>
          contentPatterns.forEach(c => {
            const oneLineData = getOneLineData(datumItem, c);
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
export const getOneLineData = (datum: any, config: IToolTipLinePattern): IToolTipLineActual => {
  const key = getTooltipValue(config.key, datum);
  const value = getTooltipValue(config.value, datum);
  const visible: boolean = isValid(key) || isValid(value);

  const shapeType = getTooltipValue(config.shapeType, datum);
  const shapeColor = getTooltipValue(config.shapeColor, datum);

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
