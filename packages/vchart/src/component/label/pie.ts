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
  let smartInvert = false;
  if (isString(labelPosition) && labelPosition.includes('inside')) {
    smartInvert = labelSpec?.smartInvert ?? true;
  }

  return { position, smartInvert };
}
