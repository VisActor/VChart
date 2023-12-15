import { isNumber } from '@visactor/vutils';
import { MarkerTypeEnum } from '../../interface';
import { calculateCAGR } from './common';

export function getMarkLineFormatText(value: string | number, isPercent?: boolean) {
  if (isNumber(value)) {
    return isPercent === true ? `${((value as number) * 100).toFixed(0)}%` : parseInt(`${value}`, 10);
  }

  return value;
}

export function getMarkAreaFormatText(value: (string | number)[], isPercent?: boolean) {
  const [start, end] = value;
  if (isNumber(start)) {
    return isPercent === true
      ? `${(start * 100).toFixed(0)}% - ${((end as number) * 100).toFixed(0)}%`
      : `${start.toFixed(0)} - ${(end as number).toFixed(0)}`;
  }

  return start === end ? start : `${start} - ${end}`;
}

export function getCAGRFormatText(value: [number, number], length: number) {
  const [startValue, endValue] = value;

  return startValue === 0 ? '<超过 0 的百分比>' : `${(calculateCAGR(endValue, startValue, length) * 100).toFixed(0)}%`;
}

export function getGrowthFormatText(value: [number, number], isPercent?: boolean) {
  const [startValue, endValue] = value;
  return isPercent === true
    ? `${((endValue - startValue) * 100).toFixed(0)}%`
    : startValue === 0
    ? '<超过 0 的百分比>'
    : `${(((endValue - startValue) / startValue) * 100).toFixed(0)}%`;
}

type Option = {
  isPercent?: boolean;
  length?: number;
};

export const markerFormatMap = {
  [MarkerTypeEnum.horizontalLine]: getMarkLineFormatText,
  [MarkerTypeEnum.verticalLine]: getMarkLineFormatText,
  [MarkerTypeEnum.horizontalArea]: getMarkAreaFormatText,
  [MarkerTypeEnum.verticalArea]: getMarkAreaFormatText,
  [MarkerTypeEnum.growthLine]: getCAGRFormatText,
  [MarkerTypeEnum.totalDiffLine]: getGrowthFormatText,
  [MarkerTypeEnum.hierarchyDiffLine]: getGrowthFormatText
};

export function parseMarkerSpecWithExpression(expression: string, spec: any, option: Option) {
  const markerType = spec.name;

  if (expression) {
    // 判断是否存在 ## 关键字
    if (expression.indexOf('##') !== -1) {
      const originValue = markerFormatMap[markerType](spec._originValue_, option.isPercent ?? option.length);
      spec.label.text = expression.replaceAll('##', originValue).split('\n');
    } else {
      spec.label.text = expression.split('\n');
    }
    spec.expression = expression;
  } else {
    spec.expression = null;
    spec.label.text = markerFormatMap[markerType](spec._originValue_, option.isPercent ?? option.length);
  }

  return spec;
}

export function parseMarkerLabelText(labelText: string, spec: any, spit: boolean = true) {
  const { expression } = spec;

  let parsedText = labelText;
  if (expression) {
    // 如果存在表达式，那么需要进行判断
    if (expression.indexOf('##') !== -1) {
      parsedText = expression.replaceAll('##', labelText);
    } else {
      parsedText = expression;
    }
  }
  return spit ? parsedText.split('\n') : parsedText;
}
