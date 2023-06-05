import type { Datum } from '../../typings';
import type { ILabelInfo } from './label';
import { barLabel } from './bar';
import { symbolLabel } from './symbol';

export const markLabelConfigFunc = {
  rect: barLabel,
  symbol: symbolLabel
};

export function textAttribute(labelInfo: ILabelInfo, datum: Datum) {
  const { labelMark, series, baseMark } = labelInfo;
  const formatMethod = baseMark.getLabelSpec()?.formatMethod;
  const field = series.getMeasureField()[0];
  const textAttribute = { text: datum[field], data: datum } as any;

  const attributes = Object.keys(labelMark.stateStyle.normal);
  for (const key of attributes) {
    const attr = labelMark.getAttribute(key as any, datum);
    if (key in TextAttributeMap) {
      textAttribute[TextAttributeMap[key]] = attr;
    } else {
      textAttribute[key] = attr;
    }
    if (key === 'text' && formatMethod) {
      textAttribute[key] = formatMethod(textAttribute[key], datum);
    }
  }
  return textAttribute;
}

const TextAttributeMap = {
  fill: 'fillColor',
  stroke: 'strokeColor'
};
