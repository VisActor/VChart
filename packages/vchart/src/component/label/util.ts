import type { Datum } from '../../typings';
import type { ILabelInfo } from './label';
import { barLabel } from './bar';
import { symbolLabel } from './symbol';
import { pieLabel } from './pie';

export const markLabelConfigFunc = {
  rect: barLabel,
  symbol: symbolLabel,
  arc: pieLabel
};

export function textAttribute(
  labelInfo: ILabelInfo,
  datum: Datum,
  formatMethod: (text: string | string[], datum?: any) => string | string[]
) {
  const { labelMark, series } = labelInfo;
  const field = series.getMeasureField()[0];
  const textAttribute = { text: datum[field], data: datum } as any;

  const attributes = Object.keys(labelMark.stateStyle.normal);
  for (const key of attributes) {
    const attr = labelMark.getAttribute(key as any, datum);
    textAttribute[key] = attr;
    if (key === 'text' && formatMethod) {
      textAttribute[key] = formatMethod(textAttribute[key], datum);
    }
  }
  return textAttribute;
}
