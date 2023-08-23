import { isString } from '@visactor/vutils';
import type { ILabelInfo } from './label';
import type { BaseLabelAttrs, Strategy } from '@visactor/vrender-components';
import type { ICartesianSeries } from '../../series/interface';
import type { Datum } from '../../typings';

export function pieLabel(labelInfo: ILabelInfo) {
  const { series, baseMark } = labelInfo;
  const labelSpec = baseMark.getLabelSpec() ?? {};

  // encode position config
  const labelPosition = labelSpec.position ?? 'outside';
  const position = labelPosition as BaseLabelAttrs['position'];

  // encode smartInvert
  let smartInvert;
  if (labelSpec.smartInvert) {
    smartInvert = labelSpec.smartInvert;
  } else {
    smartInvert = isString(labelPosition) && labelPosition.includes('inside');
  }

  return { position, smartInvert };
}
