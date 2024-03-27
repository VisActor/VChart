import { array, isFunction, isNil } from '@visactor/vutils';
import type {
  Datum,
  ITooltipLinePattern,
  ITooltipPattern,
  TooltipContentProperty,
  TooltipData,
  TooltipPatternProperty
} from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
import { getFormatFunction } from '../../util';
import type { IDimensionData, IDimensionInfo } from '../../../event';

export const getTooltipContentValue = <T>(
  field?: TooltipContentProperty<T>,
  datum?: any,
  params?: TooltipHandlerParams,
  formatter?: string
): T | undefined => {
  let value: T;
  if (isFunction(field)) {
    value = field(datum, params);
  } else {
    value = field;
  }

  if (formatter) {
    const { formatFunc, args } = getFormatFunction(undefined, formatter, field as string, datum);
    if (formatFunc && args) {
      value = formatFunc(...args);
    }
  }

  return value;
};

export const getTooltipPatternValue = <T>(
  field?: TooltipPatternProperty<T>,
  data?: TooltipData,
  params?: TooltipHandlerParams
): T | undefined => {
  if (isNil(field)) {
    return field;
  }
  if (isFunction(field)) {
    return field(data, params);
  }
  return field;
};

export const getTooltipContentPattern = (
  field?: ITooltipPattern['content'],
  data?: TooltipData,
  params?: TooltipHandlerParams
): Array<ITooltipLinePattern> | undefined => {
  if (isNil(field)) {
    return field;
  }
  let result: ITooltipLinePattern[] = [];
  array(field).forEach(patternItem => {
    if (isFunction(patternItem)) {
      result = result.concat(array(patternItem(data, params)));
    } else {
      result.push(patternItem as ITooltipLinePattern);
    }
  });
  return result;
};

export function getFirstDatumFromTooltipData(data: TooltipData): Datum {
  // 找到第一个可用的datum
  const dimInfoList: IDimensionInfo[] = (data as IDimensionData[])[0]?.series
    ? [{ data: data as IDimensionData[], value: '' }]
    : (data as IDimensionInfo[]);
  for (const { data: dataList } of dimInfoList) {
    for (const { datum: datumList } of dataList) {
      for (const datumItem of datumList ?? []) {
        if (datumItem) {
          return datumItem;
        }
      }
    }
  }
}
